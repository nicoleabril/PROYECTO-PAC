
import React, { useState, Component } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import TablaFiltrada from '../components/TABLA_FILTRADA';
import { toast, ToastContainer } from "react-toastify";
const body = {
        position:'absolute',
        top: '20%',
        left:'20%',
        width:'60%',
    
};

const etiqueta = {
    fontWeight: 'bold',
    marginRight: '5px',
}

const grupoForm = {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: '0px 2px 2px 2px',
    borderRadius: '0px 0px 5px 5px',
    padding: '10px',
    width: '140%',
}

const encabezaGrupoForm = {
    border: '2px solid #000',
    borderRadius: '5px 5px 0px 0px',
    backgroundColor: '#176B87',
    fontWeight: 'bold',
    color: 'white',
    width: '140%',
    padding: '10px',
}

const enlace={
    cursor:'pointer',
    color: 'blue',
    width: '3%',
}

const recargar_ventana = () => {
    window.location.reload();
};


class Aprobacion_reformas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Cookies.get('authToken'),
            isLoggedIn: Cookies.get('authToken') ? true : false,
            procesosConRevision: [],
            filaSeleccionada: null,
            columns : [
                {
                    header: "ID Procesos",
                    accessorKey: "id_proceso",
                    footer: "ID Procesos",
                },
                {
                    header: "Codigo Proceso",
                    accessorKey: "codigo_proceso",
                    footer: "Codigo Proceso",
                },
                {
                    header: "Detalle Producto",
                    accessorKey: "descripcion",
                    footer: "Detalle Producto",
                },
                {
                    header: "Tipo Compra",
                    accessorKey: "tipo_compra",
                    footer: "Tipo Compra",
                },
                {
                    header: "Tipo Regimen",
                    accessorKey: "tipo_regimen",
                    footer: "Tipo Regimen",
                },
                {
                    header: "Partida Presupuestaria",
                    accessorKey: "partida_presupuestaria",
                    footer: "Partida Presupuestaria",
                },
                {
                    header: "Dirección",
                    accessorKey: "area_requirente",
                    footer: "Dirección",
                },
                {
                    header: "Departamento",
                    accessorKey: "id_departamento",
                    footer: "Departamento",
                },
                {
                    header: "Año",
                    accessorKey: "anio",
                    footer: "Año",
                },
                ]
        };
    }

    regresar_Inicio = () => {
        window.history.back();
    };

    componentDidMount() {
        if (this.state.isLoggedIn) {
            this.obtenerProcesosConRevision();
        }
    }

    obtenerProcesosConRevision = async () => {
        const username = Cookies.get('usr');
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtenerReformas/estado_aprobador/Iniciado`);
            this.setState({ procesosConRevision: response.data });
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };

    mandarReformaARevision = async () => {
        if(this.state.filaSeleccionada!=null){
          try {
            const response = await Axios.post(`http://190.154.254.187:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_revisor', estadoNuevo:'Iniciado', secuencial_reforma:this.state.filaSeleccionada});
            const response_data = await Axios.post(`http://190.154.254.187:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_aprobador', estadoNuevo:'Pendiente', secuencial_reforma:this.state.filaSeleccionada});
            await toast.success(response_data.data.message);
            recargar_ventana();
          } catch (error) {
              console.error('Error al cambiar estado de Reforma:', error);
          }
        }else{
          toast.error('Por favor, escoja una reforma');
        }  
    }

    aprobarReforma = async () => {
        if(this.state.filaSeleccionada!=null){
          try {
            const response = await Axios.post(`http://190.154.254.187:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_aprobador', estadoNuevo:'Finalizado', secuencial_reforma:this.state.filaSeleccionada});
            const response2 = await Axios.post(`http://190.154.254.187:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_consolidador', estadoNuevo:'Iniciado', secuencial_reforma:this.state.filaSeleccionada});
            console.log('Respuesta del servidor:', response.data);
            await toast.success(response.data.message);
            recargar_ventana();
          } catch (error) {
              console.error('Error al cambiar estado de Reforma:', error);
          }
        }else{
          toast.error('Por favor, escoja una reforma');
        }  
    }

    onFilaSeleccionada = (fila) => {
        // Manejar la lógica para la fila seleccionada
        console.log('Fila seleccionada:', fila);
        this.setState({filaSeleccionada: fila});
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
                        <div style={encabezaGrupoForm}>
                        <table width="100%">
                            <tr>
                                <td style={{ width: '70%' }}><label style={etiqueta}>Reformas por Aprobar</label></td>
                                <td onClick={() => this.aprobarReforma()} style={{ width: '10%' }}>Aprobar</td>
                                <td onClick={() => this.mandarReformaARevision()} style={{ width: '10%' }}>Revisar</td>
                                <td onClick={() => this.regresar_Inicio()} style={{ width: '10%' }}>Regresar</td>
                            </tr>
                        </table>
                    </div>
                    <div id="tablaFiltrada" className="form-group" style={grupoForm}>
                        {this.state.procesosConRevision.length > 0 ? (
                            <TablaFiltrada data={this.state.procesosConRevision} columns={this.state.columns} verCambios={true} eliminar={true} onSeleccionarFila={this.onFilaSeleccionada}/>
                        ) : (
                            <p>No hay procesos disponibles.</p>
                        )}
                    </div>
                    </div><br/><br/>
                </body>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
                <Footer />
            </div>
        );
    }
}

export default Aprobacion_reformas;