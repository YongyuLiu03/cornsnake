import Link from 'next/link';
import Image from 'next/image';
import Modal from 'react-modal';
import LoginForm from './LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';


Modal.setAppElement('#__next');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'gray'
  },
};

const Navbar = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn, username, setUsername } = useAuth();
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleFormSubmit = async ({ formMode, username, password }) => {
    const apiUrl = formMode === 'login' ? '/api/login' : '/api/register';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    console.log(response.message)
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setIsLoggedIn(true);
      setUsername(data.username);
      setModalIsOpen(false);
      return true;
    }

    return false;
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link href="/"><Image src="/img/corn.png" alt="Logo" className="logo" width={50} height={50}/></Link>
        <Link href="/about" className="nav-link">About</Link>
        <Link href="/morphs" className="nav-link">Morphs</Link>
        <Link href="/rank" className="nav-link">Rank</Link>
        <Link href="/mine" className="nav-link">Mine</Link>
        <Link href="/comments" className="nav-link">Comments</Link>
      </div>
      <div className="nav-right">
        {!isLoggedIn ? (
          <a onClick={openModal}>Login/Register</a>
        ) : (
          <span>
          <Link href="/mine" className="nav-link">{username}</Link>
          <Link href="/api/logout" className="nav-link">Logout</Link>
          </span>
        )}
      <Modal classname="login-modal"  isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel="Login/Register Modal">
        <h2>Login/Register</h2>
        <LoginForm onFormSubmit={handleFormSubmit} />
        <button onClick={closeModal}>Close</button>
      </Modal>
      </div>
    </nav>
  );
};

export default Navbar;
