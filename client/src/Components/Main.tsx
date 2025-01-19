import React, { useState, useEffect } from 'react';
import { v4 as uuid } from "uuid"
import { useNavigate } from "react-router-dom";
import './Styles.css';

import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000'); 

const Main = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState('');
  const unique_id = uuid();
  const small_id = unique_id.slice(0, 6);

  const onCreate = (e) => {

    socket.emit('join_room', small_id);
    navigate(`/${small_id}`);
  }

  const onJoin = (e) => {
    socket.emit('join_room', room);
    navigate(`/${room}`);
  }

  return (
  <div className="center-container">

    <div className="join-container">
        <input onChange={(e)=>{setRoom(e.target.value)}} type='text' />
        <button onClick={(e)=>{onJoin(e)}}>JOIN</button>
    </div >
    <button className="create-btn" onClick={(e)=>{onCreate(e)}}>
        CREATE SERVER
    </button>

  </div>);
}

export default Main;