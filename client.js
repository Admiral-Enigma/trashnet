var net = require('net');
const uuidv4 = require('uuid/v4');
var HOST = '127.0.0.1';
var PORT = 1337;
const id = uuidv4()

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    setInterval(function () {
      client.write(JSON.stringify({type:'HEARTBEAT', uuid:id}));
    }, 10000)
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {

    console.log('DATA: ' + data);
    // Close the client socket completely
    //client.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    //console.log('Connection closed');
});
