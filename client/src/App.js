import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Chat from './Components/Chat.js';
import Main from './Components/Main.tsx';
import Room from './Components/Room.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Main/>}/>
        <Route path='/:server' element={<Room/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
