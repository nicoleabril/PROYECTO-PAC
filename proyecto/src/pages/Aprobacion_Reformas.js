
import React, { useState, Component } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';

const body = {
        position:'absolute',
        top: '20%',
        left:'20%',
        width:'60%',
    
};


class Aprobacion_reformas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Cookies.get('authToken'),
            isLoggedIn: Cookies.get('authToken') ? true : false,
            procesos: []
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
                        <h1>Reformas por Aprobar</h1>
                        {this.state.procesos.length > 0 ? (
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Codigo Proceso</th>
                                        <th>Objeto Contratación</th>
                                        <th>Tipo Compra</th>
                                        <th>Tipo Regimen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.procesos.map(proceso => (
                                        <tr key={proceso.id_proceso}>
                                            <td>{proceso.id_proceso}</td>
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

export default Aprobacion_reformas;