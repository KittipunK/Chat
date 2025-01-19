const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('connect');
  socket.on('join_room', (room) => {
    socket.join(room);

  });


  socket.on('send_message', (data) => {
    
    io.to(data.server).emit('receive_message', data);
  });

  socket.on('disconnect', () => {

  });
});

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'messegesdata'
});

app.post("/send", (req, res)=>{

  const server = req.body.server;
  const messege = req.body.messege;
  
  pool.query('INSERT INTO messeges (serverId, messege) VALUES (?, ?)', [server, messege], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error inserting data');
    } else {
      res.status(200).send('Data inserted successfully');
    }
  });

})

app.post("/messege", (req, res)=>{

  const qr = `SELECT messege FROM messeges WHERE serverId = '${req.body.server}' LIMIT 15;`;
  pool.query(qr, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error inserting data');
    } else {
      res.status(200).send(results);
    }
  });

})

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});