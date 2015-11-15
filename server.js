// Use the http module: http://nodejs.org/api/http.html
var http = require('http');
var fs = require('fs');
var url =  require('url');

// http://nodejs.org/api/http.html#http_event_request
function handleIt(req, res) {
	console.log("The URL is: " + req.url);

	//req is an IncominMessage: http://nodejs.org/api/http.html#http_http_incomingmessage
	//res is a ServerResponse: http://nodejs.org/api/http.html#http_class_http_serverresponse
	//res.writeHead(200, {'Content-Type': 'text/html'});
	//res.end('<html><body><b>Hello World</b></body></html>\n');

	var parsedUrl = url.parse(req.url);
	console.log("They asked for " + parsedUrl.pathname);

	var path = parsedUrl.pathname;
	if (path == "/") {
		path = "index.html";
	}

	fs.readFile(__dirname + path,

		// Callback function for reading
		function (err, fileContents) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + req.url);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(fileContents);
  		}
  	);	
	
	// Send a log message to the console
	console.log("Got a request " + req.url);
}



// Call the createServer method, passing in an anonymous callback function that will be called when a request is made
var httpServer = http.createServer(handleIt);

// Tell that server to listen on port 8081
httpServer.listen(9000);  

console.log('Server listening on port 9000');

//////////////////////////

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);
		
		socket.on('url', function(data) {
			io.sockets.emit("url", data);
		});

		socket.on('drawing', function(data) {
			io.sockets.emit("drawing", data);
		});
	}
);