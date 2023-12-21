import React, { Component } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
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

const enlace={
    cursor:'pointer',
}



class PAC extends Component {
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
                        <h1>PAC</h1>
                        {this.state.procesos.length > 0 ? (
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        
                                        <th>Nro</th>
                                        <th>Año</th>
                                        <th>Dirección</th>
                                        <th>Departamento</th>
                                        <th>Partida Presupuestaria</th>
                                        <th>CPC</th>
                                        <th>Tipo Compra</th>
                                        <th>Tipo Régimen</th>
                                        <th>Tipo Presupuesto</th>
                                        <th>Tipo Producto</th>
                                        <th>Procedimiento Sugerido</th>
                                        <th>Objeto Contratación</th>
                                        <th>Cantidad</th>
                                        <th>Unidad</th>
                                        <th>Costo Unitario</th>
                                        <th>Total</th>
                                        <th>Cuatrimestre</th>
                                        <th>Funcionario Responsable</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.procesos.map(proceso => (
                                        <tr key={proceso.id_proceso} >
                                            <td>{proceso.row_number}</td>
                                            <td>{proceso.año}</td>
                                            <td>{proceso.direccion}</td>
                                            <td>{proceso.id_departamento}</td>
                                            <td>{proceso.partida_presupuestaria}</td>
                                            <td>{proceso.cpc}</td>
                                            <td>{proceso.tipo_compra}</td>
                                            <td>{proceso.tipo_regimen}</td>
                                            <td>{proceso.tipo_presupuesto}</td>
                                            <td>{proceso.tipo_producto}</td>
                                            <td>{proceso.procedimiento_sugerido}</td>
                                            <td>{proceso.detalle_producto}</td>
                                            <td>{proceso.cantidad}</td>
                                            <td>{proceso.unidad}</td>
                                            <td>{proceso.costo_unitario}</td>
                                            <td>{proceso.total}</td>
                                            <td>{proceso.cuatrimestre}</td>
                                            <td>{proceso.funcionario_responsable}</td>
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

export default PAC;