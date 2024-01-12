import React, { useState, Component } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';

const body = {
        position:'absolute',
        top: '20%',
        left:'20%',
        width:'60%',
    
};

const enlace={
    cursor:'pointer',
    color: 'blue',
}

const modalStyles={
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
}



class Mis_reformas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Cookies.get('authToken'),
            isLoggedIn: Cookies.get('authToken') ? true : false,
            procesos: []
        };
    }

    state={
        abierto: false,
    }
    
    abrirModal=()=>{
        this.setState({abierto: !this.state.abierto});
    }

    componentDidMount() {
        if (this.state.isLoggedIn) {
            this.obtenerProcesos();
        }
    }

    obtenerProcesos = async () => {
        const username = Cookies.get('usr');
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtener_procesos/${username}`);
            this.setState({ procesos: response.data });
            console.log(response.data);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };

    detalle_reforma = (id) => {
        window.location.href=`/detalle_reforma/${id}`;
    };

    editar_reforma = (id) => {
        window.location.href=`/editar_reforma/${id}`;
    };

    
    eliminar_reforma = (id) => {
        window.location.href=`/eliminar_reforma/${id}`;
    };

    render() {
        if (!this.state.isLoggedIn) {
            return <Navigate to="/"></Navigate>;
        }
        return (
            <div>
                <Header />
                <Menu />
                <body style={body}>
                    <div>
                        <h1>Mis Reformas</h1>
                        {this.state.procesos.length > 0 ? (
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th>Codigo Proceso</th>
                                        <th>Objeto Contratación</th>
                                        <th>Tipo Compra</th>
                                        <th>Tipo Regimen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.procesos.map(proceso => (
                                        <tr key={proceso.id_proceso} >
                                            <td onClick={() => this.detalle_reforma(proceso.id_proceso)} style={enlace}>Ver</td>
                                            <td onClick={() => this.editar_reforma(proceso.id_proceso)} style={enlace}>Editar</td>
                                            <td onClick={() => this.eliminar_reforma(proceso.id_proceso)} style={enlace}>Eliminar</td>
                                            <td>{proceso.codigo_proceso}</td>
                                            <td>{proceso.detalle_producto}</td>
                                            <td>{proceso.tipo_compra}</td>
                                            <td>{proceso.tipo_regimen}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay procesos disponibles.</p>
                        )}
                    </div>
                </body>
                <Footer />
            </div>
        );
    }
}

export default Mis_reformas;