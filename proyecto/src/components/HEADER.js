import React, {Component} from 'react';
import { Button } from 'react-bootstrap';
import './css/MAIN.css';
import Cookies from 'js-cookie';

const usrn={
  position:'absolute',
  color:'white',
  top:'40%',
  left:'15px',
}

const Header=()=>{
  const handleLogOut = () => {
    Cookies.remove('authToken');
    window.location.href = '/auth/login';
  }  
  return (
      <header className='header'>
        <p style={usrn}>Bienvenido: {Cookies.get('usr')}</p>  
        <Button onClick={handleLogOut} className='lg-button'>
          Cerrar Sesión <i className='fa fa-sign-out' aria-hidden='true'></i>
        </Button>
      </header>
    );
  };

  export default Header;