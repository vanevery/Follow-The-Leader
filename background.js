var background = "hi there";

var socket = io.connect('http://104.131.82.13:9001/');

socket.on('connect', function() {
  console.log("Connected");
});

socket.on('url',function(data) {
	console.log("Got a URL: " + data);
	/*
	chrome.windows.getCurrent(function(win) {
	    chrome.tabs.getAllInWindow(win.id, function(tabs)
	    {
	        // Should output an array of tab objects to your dev console.
	        console.debug(tabs);
	        if (tabs.length) {
	        	tabs[0].update(tabs[0].id, {url: "http://itp.nyu.edu/"});
	        }
	    });
		//window.location.assign(data);
	});
	*/
	chrome.tabs.getSelected(function(tab){
		console.log(tab);
		chrome.tabs.update(tab.id, {url: data});
	});
}); 

// Message from popup
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
        socket.emit('url', msg);
  });
});

