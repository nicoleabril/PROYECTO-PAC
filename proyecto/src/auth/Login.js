import React, { Component } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Axios from 'axios';
import Cookies from 'js-cookie';

const loginContainerStyle = {
    background: 'rgba(29, 29, 29, 0.8)', // Gris con 80% de opacidad
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '100%'
};

const formContainerStyle = {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '100%', // Ancho del contenedor blanco al 100%
    justifyContent: 'center',
    alignItems: 'center',
};

const submitButton = {
    marginTop: '15px'
};

const logoStyle = {
    display: 'block',
    margin: '0 auto', // Centra el logo horizontalmente
    marginBottom: '20px', // Espacio entre el logo y el título
};

const labelForm = {
    fontWeight: '500',
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            token: Cookies.get('authToken'),
            isLoggedIn: Cookies.get('authToken') ? true : false
        };
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleEnterPress = (e) => {
        if(e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleSubmit = async () => {
        const { username, password, token, isLoggedIn } = this.state;
        try {
            console.log(username, password);
            //http://190.154.254.187:5000/
            const response = await Axios.post('http://190.154.254.187:5000/login', {
                username,
                password
            });
            console.log(response.data);
            this.setState({
                token: response.data.token,
                isLoggedIn: true
            });
            Cookies.set('authToken', token);
            Cookies.set('usr', username);
        } catch (error) {
            console.error(error);
        }
        // Aquí puedes agregar la lógica de autenticación, como una llamada a una API.
    }

    render() {

        // Si el usuario ha iniciado sesión, redirige a la página del menú
        if (this.state.isLoggedIn) {
            return <Navigate to='/inicio'/>;
        }

        return (
            <Container fluid style={loginContainerStyle}>
                <Row className="justify-content-center">
                    <Col md={50}>
                        <div style={formContainerStyle} className="p-5 shadow rounded">
                            <img src="./logo192.png" width="60" height="60" alt="Logo de la empresa" style={logoStyle} />
                            <h2 className="text-center mb-6">Iniciar Sesión</h2>
                            <br></br>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="formBasicusername">
                                    <Form.Label style={labelForm}>Usuario</Form.Label>
                                    <Form.Control
                                        type="username"
                                        name="username"
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label style={labelForm}>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        onChange={this.handleInputChange}
                                        onKeyDown={this.handleEnterPress}
                                    />
                                </Form.Group>
                                <Button style={submitButton} variant="primary" className="btn-block" onClick={this.handleSubmit}>
                                    Iniciar Sesión
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Login;
