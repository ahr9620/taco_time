//Initialize the express 'app' object
let express = require("express");
let path = require("path");
let app = express();
// server-side in-memory store for burritos (simple persistence while server runs)
const burritos = [];



//I HAD LOTS OF PROBLEMS HERE -- uploading an image on server is tricky
app.use("/", express.static("public"));
// expose project root at /assets so files like taco_time.png in repo root
// can be referenced from the client as /assets/taco_time.png
app.use('/assets', express.static(path.join(__dirname)));

//Initialize HTTP server
let http = require("http");
let server = http.createServer(app);

//initialize socket.io
let io = require("socket.io");
io = new io.Server(server);

//Listen for a client to connect and disconnect
io.on("connection", (socket) => {
  console.log("We have a new client: " + socket.id);
  // send existing burritos to the new client so it can render history
  socket.emit('burrito-sync', burritos);

  //Listen for messages from the client
  //Listen for an event named 'burrito-offer' from client
  socket.on('burrito-offer', (data) => {
    console.log("Received 'burrito-offer' with the following data:");
    console.log(data);

  // basic validation & normalization
  if (!data || typeof data.x !== 'number' || typeof data.y !== 'number' || !data.id) return;
  data.createdAt = data.createdAt || Date.now();
  data.message = String(data.message || '').slice(0, 500);

  // store in memory (cap size)
  burritos.push(data);
  if (burritos.length > 1000) burritos.shift();

  // broadcast to all clients including the sender
  io.emit('burrito-share', data);

    //Send data to ALL other clients EXCEPT the sender
    // socket.broadcast.emit('burrito-share', data);

    //Send the data ONLY to the sender
    // socket.emit('message-share', data);

  });

  //Listen for this client to disconnect
  socket.on("disconnect", () => {
    console.log("A client has disconnected: " + socket.id);
  });
});


//'port' variable allows for deployment
let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("App listening at port: " + port);
});