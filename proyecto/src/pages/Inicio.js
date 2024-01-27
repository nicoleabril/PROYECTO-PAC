import React, { useState, Component } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import {  Form, Container, Row, Col, Table } from 'react-bootstrap';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const body = {
    position:'absolute',
    top: '20%',
    left:'20%',
    width:'60%',

};

const enlace={
    cursor:'pointer',
    color: 'blue',
};


const BotonCircular =  {
    borderRadius: '0%',
    width: '120px',
    height: '50px',
    backgroundColor: '#176B87',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    
};

class Inicio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Cookies.get('authToken'),
            isLoggedIn: Cookies.get('authToken') ? true : false,
            procesos:[]
        };
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
            //alert(JSON.stringify(response.data)); // Muestra la respuesta como una alerta
            console.log(response.data);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };

    detalle_reforma = (id) => {
        window.location.href=`/detalle_reforma/${id}/procesos/false`;
    };

    editar_reforma = (id) => {
        window.location.href=`/editar_reforma/${id}/procesos/false`;
    };

    recargar_ventana = () => {
        window.location.reload();
    };
    
    eliminar_reforma = (id) => {
        window.location.href=`/eliminar_reforma/${id}/procesos/true`;
    };

    agregar_proceso = (id) => {
        window.location.href=`/incluir_reforma/${id}`;
    };

    render() {
        const username = Cookies.get('usr');
        if (!this.state.isLoggedIn) {
            return <Navigate to="/"></Navigate>;
        }
        return (
            <div>
                <Header />
                <Menu />
                <body style={body}>
                    <div>
                        <table width="180%">
                        <tr>
                            <td style={{width:'auto'}}><h1>Mis Procesos</h1></td>
                            <td style={{width:'auto'}}><button onClick={() => this.agregar_proceso(username)} style={BotonCircular}>Crear Proceso</button></td>
                        </tr>
                        </table>
                        {this.state.procesos.length > 0 ? (
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th>Codigo Proceso</th>
                                        <th>Objeto Contratación</th>
                                        <th>Tipo Compra</th>
                                        <th>Tipo Regimen</th>
                                        <th>Partida Presupuestaria</th>
                                        <th>Dirección</th>
                                        <th>Departamento</th>
                                        <th>Año</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.procesos.map(proceso => (
                                        <tr key={proceso.id_proceso}>
                                            <td onClick={() => this.detalle_reforma(proceso.pac_fase_preparatoria_pk)} style={enlace}><i class="fa fa-eye" aria-hidden="true"></i></td>
                                            <td onClick={() => this.editar_reforma(proceso.pac_fase_preparatoria_pk)} style={enlace}><i class="fa fa-pencil" aria-hidden="true"></i></td>
                                            <td onClick={() => this.eliminar_reforma(proceso.pac_fase_preparatoria_pk)} style={enlace}><i class="fa fa-trash" aria-hidden="true"></i></td>
                                            <td>{proceso.id_proceso}</td>
                                            <td>{proceso.codigo_proceso}</td>
                                            <td>{proceso.detalle_producto}</td>
                                            <td>{proceso.tipo_compra}</td>
                                            <td>{proceso.tipo_regimen}</td>
                                            <td>{proceso.partida_presupuestaria}</td>
                                            <td>{proceso.direccion}</td>
                                            <td>{proceso.id_departamento}</td>
                                            <td>{proceso.año}</td>
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

export default Inicio;
