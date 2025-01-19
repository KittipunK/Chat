import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000'); 

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages([...messages, data]);
    });
  }, [messages]);

  const sendMessage = () => {
    socket.emit('send_message', { room, message, user: 'You' }); 
    setMessage('');
  };

  const joinRoom = () => {
    socket.emit('join_room', room);
  };

  return (
    <div>
      <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room" />
      <button onClick={joinRoom}>Join Room</button>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.user}: {msg.message}
          </div>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;