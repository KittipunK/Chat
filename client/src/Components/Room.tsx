import React, { useEffect, useRef, useState } from "react";
import './Styles.css';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import io from 'socket.io-client';
import arrow from '../Img/arrow.png';

const socket = io.connect('http://localhost:5000'); 

const Room = () => {
  const navigate = useNavigate()
  const { server } = useParams();
  ;
  const [myMessege, setMyMessege] = useState("");
  const [messeges, setMesseges] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
        setMesseges([...messeges, data]);
    });
  }, [messeges]);

  useEffect(() => {
    socket.emit('join_room', server);
    axios.post('http://localhost:5000/messege', {server: server}).then((res)=>{
      setMesseges(res.data);
    }).catch((error)=>{
      console.log(error);
    })
  }, []);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ messeges ]);
  

  const onSend = (e) => {
    socket.emit('send_message', { server: server, messege: myMessege }); 
    axios.post('http://localhost:5000/send', { server: server, messege: myMessege}).then((res)=>{
      console.log(res.data);
    }).catch((error)=>{
      console.log(error);
    })

    setMyMessege('');

  }

  return <div className="roomContainer">
    <div className="header">
      <button onClick={(e)=>{navigate("/")}}><img src={arrow}/></button>
      <h1>server: {server}</h1>
    </div>
    
    <div className="messegesContainer">
      {messeges.map((data, index)=>{
        return <p key={index}>
          {data.messege}
        </p>
      })}
      <div ref={messagesEndRef} />
    </div>
    <div className="inputContainer">
      <input value={myMessege} onChange={(e)=>{setMyMessege(e.target.value)}} placeholder="type something..." type='text'/>
      <button  onClick={(e)=>{onSend(e)}}>SEND</button>
    </div>
  </div>;
}

export default Room;