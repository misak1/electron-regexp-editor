var http = require('http'),
    app = require('electron').app;
 
// every worker gets unique port, get it from a process environment variables 
var port = process.env.ELECTRON_WORKER_PORT,
    host = process.env.ELECTRON_WORKER_HOST,
    workerId = process.env.ELECTRON_WORKER_ID; // worker id useful for logging 
 
console.log('Hello from worker', workerId);
 
app.on('ready', function() {
  // you can use any webserver library/framework you like (connect, express, hapi, etc) 
  var server = http.createServer(function(req, res) {
    // You can respond with a status `500` if you want to indicate that something went wrong 
    res.writeHead(200, {'Content-Type': 'application/json'});
    // data passed to `electronWorkers.execute` will be available in req body 
    req.pipe(res);
  });
 
  server.listen(port, host);
});