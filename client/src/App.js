import './App.css';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Morph from './pages/Morph';
import Rank from './pages/Rank';
import Mine from './pages/Mine';
import Comment from './pages/Comment';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';

function App() {
  return (
          <><Navbar /><Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/morph" element={<Morph />} />
      <Route path="/rank" element={<Rank />} />
      <Route path="/mine" element={<Mine />} />
      <Route path="/comment" element={<Comment />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes><Footer /></>
  );
}

export default App;
