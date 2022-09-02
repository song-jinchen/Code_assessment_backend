const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');   
const {Server} = require('socket.io');
app.use(cors());


const server = http.createServer(app);

const io =new Server(server,{
    cors: { 
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
room_number = {}
io.on('connection', (socket) =>{
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        if (!room_number[data]){
            room_number[data] = 0;
        }
        room_number[data] +=1;
        console.log(`User with ID: ${socket.id} joined room: ${data} `);
        socket.to(data).emit("receive_room_number", room_number[data]);
        
    });
    socket.on('get_room_number', (data) => {
        socket.to(data).emit("receive_room", room_number[data]);
    });

    socket.on('send_message', (data) =>{
        console.log('room ' + data.room + ' message ' + data.message);
        socket.to(data.room).emit("receive_message", data);
    });
    
    socket.on('disconnect', (socket) =>{
        console.log('User Disconnected', socket.id);
    });
})

server.listen(3001, () => {
    console.log('SERVER RUNNING')
});
