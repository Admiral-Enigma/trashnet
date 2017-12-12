var net = require('net');
var readline = require('readline')
const uuidv4 = require('uuid/v4');
var colors = require('colors');

var HOST = '127.0.0.1';
var PORT = 1337;

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
var cli = {
  rl: null,
  init: function () {
    this.rl = readline.createInterface(process.stdin, process.stdout)
    this.rl.setPrompt('=> ')
    this.rl.prompt()
  },

  printPretty: function (s, type) {
    if (type == null) {
      console.log(s)
      this.rl.prompt()
    }else {
      if (type == 'cwarn') {
        console.log(s.red)
        this.rl.prompt()
      }else if (type == 'warn') {
        console.log(s.yellow)
        this.rl.prompt()
      }else if (type == 'good'){
        console.log(s.green)
        this.rl.prompt()
      }
    }
  },

  handleInput: function (input) {
    if (input[0] == 'exit') {
      this.rl.close()
    }else if (input[0] == 'ping'){
      io.emit('status')
    }
    this.rl.prompt()
  }
}
cli.init()
cli.rl.on('line', function (line) {
  var input = line.split(' ')
  cli.handleInput(input)
}).on('close', function () {
    process.exit(0)
})

function parsePacket (packet) {
  var data = JSON.parse(packet.data)
  if (data.type != undefined) {
    if (data.type === 'HEARTBEAT') {
      cli.printPretty('Heartbeat from '+data.uuid, 'good');
    }
  }else {
    console.log('ERROR');
  }
}


net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    cli.printPretty('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort, 'good');

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {

        //console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        //sock.write('You said "' + data + '"');
        parsePacket({data:data, ip:sock.remoteAddress})

    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
        cli.rl.prompt()
    });

    sock.on("error", (err) => {
      cli.printPretty('Client might have closed the bot' + sock.remoteAddress, 'cwarn');
      cli.rl.prompt()
    })

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
cli.rl.prompt()
