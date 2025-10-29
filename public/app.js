console.log("Hello!");


//creating burritos array
let burritos = [];


//Initialize and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
});

// couldnt get this to work, this section is from claude helping me with client
// Accept a full sync of burritos from server on connect
socket.on('burrito-sync', (arr) => {
    if (!Array.isArray(arr)) return;
    // replace local store but keep any we already have (dedupe by id)
    const ids = new Set(burritos.map(b => b.id));
    for (const b of arr) {
        if (!ids.has(b.id)) burritos.push(b);
    }
});

function setup() {
    createCanvas(windowWidth, windowHeight/1.3);

    //Inside setup
    //Generate random fill values
    // myRed = random(0, 255);
    // myGreen = random(0, 255)
    // myBlue = random(0, 255);

    //Generate random ellipse size
    // myDiameter = random(5, 50);

}

// function mouseMoved() {
//     //Grab mouse position
//     // let mouseData = { x: mouseX, y: mouseY };
//     let mouseData = {
//         x: mouseX,
//         y: mouseY,
//         r: myRed,
//         g: myGreen,
//         b: myBlue,
//         d: myDiameter
//     }

function mousePressed() {
    //grab mouse position and
    let mouseData = {
        x: mouseX,
        y: mouseY,
        createdAt: Date.now(),
        id: socket.id,
    }
    

    //Draw yourself? Wait for server?
    // fill(0);
    // ellipse(mouseX, mouseY, 10, 10);

    //send mouse data object to the server
    socket.emit('message', mouseData);

    //emit local burrito
    const burrito = {
        id: String(Date.now()),
        x: mouseX,
        y: mouseY,

        //adding message from input on index.html
        message: (document.getElementById('burrito-message').value || 'A humble offering 🌯'),
        createdAt: Date.now(),
    };
    burritos.push(burrito);
    socket.emit('burrito-offer', burrito);

}


//listen for an event named 'message-share' from the server think of this as event listener
socket.on('message-share', (data) => {
    console.log(data);
    drawEllipse(data);

});

//listen for burritos shared by the server
socket.on('burrito-share', (data) => {
    if (!data || typeof data.x !== 'number' || typeof data.y !== 'number') return;
    data.createdAt = data.createdAt || Date.now();
    burritos.push(data);
});


// function drawBurrito() {
//     // Iterate through burritos and render each; always show message above each burrito
//     for (let i = burritos.length - 1; i >= 0; i--) {
//         const b = burritos[i];

//         // draw burrito emoji
//         push();
//         textAlign(CENTER, CENTER);
//         textSize(42);
//         noStroke();
//         text('🌯', b.x, b.y);
//         pop();

//         // always show message
//         const msg = b.message || '';
//         push();
//         textSize(14);
//         fill(0);
//         text(msg, b.x, b.y - 36 + 4);
//         pop();
//         }
//     }



//Expects an object with x and y properties
function drawEllipse(obj) {
     for (let i = burritos.length - 1; i >= 0; i--) {
        const b = burritos[i];

        // draw burrito emoji
        push();
        textAlign(CENTER, CENTER);
        textSize(42);
        noStroke();
        text('🌯', b.x, b.y);
        pop();

        // always show message
        const msg = b.message || '';
        push();
        textSize(14);
        fill(0);
        text(msg, b.x, b.y - 36 + 4);
        pop();
        }
}



// LISTEN FOR MOUSE PRESS
//GRAB X Y
//EMIT TO SERVER
//HEYYYY EVERYONE THIS ELIPSE WAS DRAWN
//ON THE CLIENT LOO FOR MESSAGE
//DRAW ELIPSE ON CLIENTS