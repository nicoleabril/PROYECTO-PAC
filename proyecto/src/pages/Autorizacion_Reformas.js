
import React, { useState, Component } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import TablaFiltrada from '../components/TABLA_FILTRADA_REFORMA';
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


class Autorizacion_reformas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Cookies.get('authToken'),
            isLoggedIn: Cookies.get('authToken') ? true : false,
            username: Cookies.get('usr'),
            procesosConRevision: [],
            fechaActual: new Date(),
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
                {
                    header: "Estado Autorizador",
                    accessorKey: "estado_autorizador",
                    footer: "Estado Autorizador",
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
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtenerReformas/estado_autorizador/Iniciado`);
            const response2 = await Axios.get(`http://190.154.254.187:5000/obtenerReformas/estado_autorizador/Autorizado`);
            this.setState({ procesosConRevision: response.data.concat(response2.data) });
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };

    autorizarTodo = async () => {
        const response_data=[];
        try {
            if(this.state.procesosConRevision.length!== 0){
                for (let elemento of this.state.procesosConRevision) {
                    response_data = await Axios.post(`http://190.154.254.187:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_autorizador', estadoNuevo:'Autorizado', secuencial_reforma:elemento.secuencial_reforma});
                }  
                await toast.success(response_data.data.message);
                recargar_ventana();
            }else{
                toast.error("No existen reformas para autorizar");
            }
            
        } catch (error) {
            console.error('Error al cambiar estado de Reforma:', error);
        }
        
    }

    obtener_id_resolucion = async () => {
        try {
            const response = await Axios.get('http://190.154.254.187:5000/obtener_id_resolucion');
            console.log(response.data.nextval);
            return response.data.nextval;
        } catch (error) {
            console.error(error);
        }
    };


    generarPDF = async () => {
        const resoluciones = this.obtenerResolucionesAutorizadas();
        try {
            const response = await fetch('http://190.154.254.187:5000/generar_detalle_reforma', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ datos: resoluciones }),
            });
    
            if (!response.ok) {
                throw new Error('Error al generar el PDF');
            }
            const blob = await response.blob();
            // Crear un enlace para la descarga del PDF
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'output.pdf';
            link.click();
            return blob;
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };

    obtenerResolucionesAutorizadas = () => {
        const autorizados = [];
        for (let elemento of this.state.procesosConRevision) {
            if(elemento.estado_autorizador === 'Autorizado'){
                autorizados.push(elemento);
            }
        }
        console.log(autorizados);
        return autorizados;
    }

    crearResolucion = async () => {
        const resoluciones = this.obtenerResolucionesAutorizadas();
        if (resoluciones.length !== 0) {
            const id_resolucion = await this.obtener_id_resolucion();
            const archivoGenerado = await this.generarPDF();
            try {
                if (archivoGenerado !== null) {
                    
                    const formData = new FormData();
                    formData.append('secuencial_resolucion', parseInt(id_resolucion));
                    formData.append('fch_solicitada', new Date().toISOString());
                    formData.append('usr_solicita', Cookies.get('usr'));
                    formData.append('estado', 'Pendiente');
                    formData.append('url_detalle_resol', archivoGenerado);

                    const response = await Axios.post('http://190.154.254.187:5000/registrarResolucion', formData);
                    console.log(response.data.message);
                    // Resto de tu código
                    await this.solicitarResolucion(id_resolucion);
                    await recargar_ventana();
                }
            } catch (error) {
                console.error('Error al crear resolucion:', error);
            }
        } else {
            toast.error('Primero autorice las resoluciones');
        } 
    };
    
    


    solicitarResolucion = async (id_resolucion) => {
        const resoluciones = this.obtenerResolucionesAutorizadas();
        for (let elemento of resoluciones) {
            try {
                const response_data = await Axios.post(`http://190.154.254.187:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_autorizador', estadoNuevo:'Completado', secuencial_reforma:elemento.secuencial_reforma});
                const secuencial_data = await Axios.post(`http://190.154.254.187:5000/actualizarSecuencial`, {secuencial_resolucion:parseInt(id_resolucion), secuencial_reforma:elemento.secuencial_reforma});
                console.log(secuencial_data.data.message);
            } catch (error) {
                    console.error('Error al solicitar resolucion:', error);
            }
            
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
                        <h1>Reformas por Autorizar</h1>
                        <div style={encabezaGrupoForm}>
                        <table width="100%">
                            <tr>
                                <td style={{ width: '70%' }}><label style={etiqueta}>Reformas por Autorizar</label></td>
                                <td onClick={() => this.crearResolucion()} style={{ width: '10%' }}>Solicitar Resolución</td>
                                <td onClick={() => this.autorizarTodo()} style={{ width: '10%' }}>Autorizar todo</td>
                                <td onClick={() => this.regresar_Inicio()} style={{ width: '10%' }}>Regresar</td>
                            </tr>
                        </table>
                    </div>
                    <div id="tablaFiltrada" className="form-group" style={grupoForm}>
                        {this.state.procesosConRevision.length > 0 ? (
                            <TablaFiltrada data={this.state.procesosConRevision} columns={this.state.columns} verCambios={true} eliminar={true} />
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

export default Autorizacion_reformas;