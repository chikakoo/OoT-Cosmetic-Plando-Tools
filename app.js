const staticServer = require('node-static');
const http = require('http');
const port = 25565;

var file = new(staticServer.Server)();

// Static server
var httpServer = http.createServer(function (req, res) {
  file.serve(req, res);
});

const io = require('socket.io')(httpServer);
io.on('connection', function(client) {
    console.log(`Connection to client ${client.id} established`);
    
    client.on('disconnect', function() {
        console.log(`Client ${client.id} has disconnected`);
    });
});

httpServer.listen(port, function (err) {
  if (err) throw err
  console.log('listening on port ' + port);
});