import React, { useState, Component } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import {  Form, Container, Row, Col, Table } from 'react-bootstrap';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const body = {
    position:'absolute',
    top: '20%',
    left:'8%',
    width:'60%',

};

const enlace={
    cursor:'pointer',
    color: 'blue',
};

const modalStyles={
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
}

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
            procesos: [],
            abierto: false,
            id: '',
            version: ''
        };
    }
    
    abrirModal=(id, version)=>{
        this.setState({abierto: !this.state.abierto, id: id, version: version});
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

    eliminarProceso = async () => {
        try {
            const response = await Axios.post(`http://190.154.254.187:5000/eliminarReforma/`, {
                id_proceso: this.state.id, 
                version_proceso: this.state.version
            });
            console.log(response.data);
            toast.success(response.data.message);
        } catch (error) {
            toast.error('Error al eliminar el proceso:', error.message);
            console.log(error);
        }
        this.abrirModal();
        //this.recargar_ventana();
    };

    detalle_reforma = (id) => {
        window.location.href=`/detalle_reforma/${id}`;
    };

    editar_reforma = (id) => {
        window.location.href=`/editar_reforma/${id}`;
    };

    recargar_ventana = () => {
        window.location.reload();
    };
    
    eliminar_reforma = (id) => {
        window.location.href=`/eliminar_reforma/${id}`;
    };

    agregar_proceso = (id) => {
        window.location.href=`/incluir_reforma/${id}`;
    };

    handleInputChangeEliminarProceso = (e) => {
        const value = e.target.value;
        this.eliminarProceso();
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
                        <h1>Mis Procesos</h1>
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
                                        <th>
                                            <button onClick={() => this.agregar_proceso(username)} style={BotonCircular}>Crear Proceso</button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.procesos.map(proceso => (
                                        <tr key={proceso.id_proceso}>
                                            <td onClick={() => this.detalle_reforma(proceso.pac_fase_preparatoria_pk)} style={enlace}><i class="fa fa-eye" aria-hidden="true"></i></td>
                                            <td onClick={() => this.editar_reforma(proceso.pac_fase_preparatoria_pk)} style={enlace}><i class="fa fa-pencil" aria-hidden="true"></i></td>
                                            <td onClick={() => this.abrirModal(proceso.id_proceso, proceso.version_proceso)} style={enlace}><i class="fa fa-trash" aria-hidden="true"></i></td>
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
                    <Modal isOpen={this.state.abierto} style={modalStyles}>
                        <ModalHeader>
                        Confirmación
                        </ModalHeader>
                        <ModalBody>
                        <p>¿Está seguro de que desea eliminar este proceso?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.handleInputChangeEliminarProceso} >Sí, estoy seguro</Button>
                            <Button color="secondary" onClick={this.abrirModal}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
                </body>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
                <Footer />
            </div>
        );
    }
}

export default Inicio;
