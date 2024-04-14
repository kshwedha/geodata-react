import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/register/Register.jsx';
import Login from './components/login/Login';
import MapComponent from './components/home/Home.jsx';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/login' element={<Login />} /> 
          <Route path='/home' element={<MapComponent/>} />
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
