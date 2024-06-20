import React, { Component } from "react";
import { Layout, Button, Form, Input } from "antd";
import Axios from 'axios';
import Cookies from 'js-cookie';
import { FaUser, FaFacebook, FaGoogle, FaInstagram } from 'react-icons/fa';
import { AiOutlineSwapRight } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import { Redirect, Link } from "react-router-dom";

//IMAGENES LOGIN
import imagen from "../assets/images/CHANLUD1.jpg";
import imagen2 from "../assets/images/LABRADO.jpg";
import imagen3 from "../assets/images/EOLICO.jpg"
import imagen4 from "../assets/images/LABRADO2.jpg"
//
const { Header, Footer } = Layout;

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      rol:'',
      token: Cookies.get('authToken'),
      isLoggedIn: false,
      currentImageIndex: 0,
      images: [imagen, imagen2,imagen3,imagen4], // Array de imágenes
      imageTransitionClass: 'fadeIn',
      error: false,
    };
  }
  handleError = () => {
    this.setState({ error: true });
  }
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit = async () => {
    const { username, password, rol, token, isLoggedIn } = this.state;
  
    try {
      const response = await Axios.post('http://localhost:5000/login', {
        username,
        password
      });
      const response_rol = await Axios.get(`http://localhost:5000/obtener_rol_usuario/${username}`);
      this.setState({
        rol: response_rol.data[0].nombre_rol,
        token: response.data.token,
        isLoggedIn: true,
        error: false, // Reiniciar el estado de error a false
      });
      Cookies.set('authToken', token);
      Cookies.set('usr', username);
      Cookies.set('rol', response_rol.data[0].nombre_rol)
  
    } catch (error) {
      console.error(error);
      this.handleError(); 
    }
  }
  

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prevState) => ({
        currentImageIndex: (prevState.currentImageIndex + 1) % this.state.images.length,
        imageTransitionClass: 'fadeOut',
      }));

      setTimeout(() => {
        this.setState({
          imageTransitionClass: 'fadeIn',
        });
      }, 5000);
    }, 5000); 
  }



  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to='/panel' />;
    }

    const { showHeader = true, showFooter = true } = this.props;

    return (
      <>
        <div className="loginPage flex">
          <div className="container flex">
            <div className="imageDiv">
              <img className={`imagenFondo ${this.state.imageTransitionClass}`} src={this.state.images[this.state.currentImageIndex]} alt="Imagen de fondo" />
            </div>
            <div className="formDiv flex">
              <div className="headerDiv">
                <h3>INICIAR SESIÓN</h3>
                {this.state.error && <p className="error-message">Las credenciales ingresadas son incorrectas</p>}
              </div>
              <form action="" className="form grid">
                <div className="inputDiv">
                  <label htmlFor="username">USUARIO</label>
                  <div className="input flex">
                    <FaUser className="icon" />
                    <input type="text" id="username" name="username" onChange={this.handleInputChange} placeholder="Ingrese su usuario"></input>
                  </div>
                </div>
                <div className="inputDiv">
                  <label htmlFor="password">CONTRASEÑA</label>
                  <div className="input flex">
                    <RiLockPasswordFill className="icon" />
                    <input type="password" id="password" name="password" onChange={this.handleInputChange} onKeyDown={this.handleEnterPress} placeholder="Ingrese su contraseña"></input>
                  </div>
                </div>
                <button type="button" className="btn flex" onClick={this.handleSubmit}>
                  <span>INICIAR SESIÓN</span>
                  <AiOutlineSwapRight className="icon"></AiOutlineSwapRight>
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}
