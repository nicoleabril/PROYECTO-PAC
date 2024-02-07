import React, { useState, Component, useEffect } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import Footer from '../components/FOOTER';
import TablaFiltrada from '../components/TABLA_FILTRADA_REFORMA';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import {flexRender,useReactTable,getCoreRowModel,getPaginationRowModel,getSortedRowModel,getFilteredRowModel} from "@tanstack/react-table";
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

const modalStyles={
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
}

const buscarIcono={
    margin:'4px 4px 0 0',
    color: '#a1a1a1'
}

const encabezado={
    padding:'4px 10px',
    borderBottom: '0 none'
}

const fila_seleccionada_estilo ={
  backgroundColor: '#cce5ff',
}

const styles = `
/* Agrega estos estilos a tu hoja de estilos CSS */

/* Estilos para resaltar la fila seleccionada */
.fila-seleccionada {
  background-color: #cce5ff  !important; /* Cambia el color de fondo según tus preferencias */
}

/* Estilos para el encabezado de la tabla */
.ui-widget-header {
  background-color: #f2f2f2; /* Cambia el color de fondo del encabezado según tus preferencias */
  padding: 8px;
  text-align: left;
}

/* Estilos para el botón de búsqueda */
.ui-widget-header i.fa-search {
  margin-right: 8px;
  color: #666; /* Cambia el color del icono de búsqueda según tus preferencias */
}

/* Estilos para los botones de paginación */
button {
  margin: 4px;
  padding: 8px;
  cursor: pointer;
  background-color: #007bff; /* Cambia el color de fondo del botón según tus preferencias */
  color: #fff; /* Cambia el color del texto del botón según tus preferencias */
  border: none;
  border-radius: 4px;
}

button:disabled {
  background-color: #ccc; /* Cambia el color de fondo del botón deshabilitado según tus preferencias */
  color: #666; /* Cambia el color del texto del botón deshabilitado según tus preferencias */
}

/* Estilos para los íconos en las celdas de acción */
td[style*="fa-eye"],
td[style*="fa-pencil"],
td[style*="fa-trash"] {
  cursor: pointer;
  color: #007bff; /* Cambia el color del ícono según tus preferencias */
}

/* Puedes añadir más estilos según sea necesario */

`;


const recargar_ventana = () => {
  window.location.reload();
};


class Seguimiento_reformas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Cookies.get('authToken'),
            isLoggedIn: Cookies.get('authToken') ? true : false,
            procesosSinRevision: [],
            procesosConRevision: [],
            filtered: [],
            abierto: false,
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
                    header: "Tipo Reforma",
                    accessorKey: "tipo_reforma",
                    footer: "Tipo Reforma",
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

    
    abrirModal=()=>{
        this.setState({abierto: !this.state.abierto});
    }

    componentDidMount() {
        if (this.state.isLoggedIn) {
            this.obtenerProcesosSinRevision();
            this.obtenerProcesosConRevision();
        }
    }

    

    obtenerProcesosSinRevision = async () => {
        const username = Cookies.get('usr');
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtener_reformas/`);
            this.setState({ procesosSinRevision: response.data });
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };

    obtenerProcesosConRevision = async () => {
        const username = Cookies.get('usr');
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtenerReformas/estado_revisor/Iniciado`);
            this.setState({ procesosConRevision: response.data });
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };

    regresar_Inicio = () => {
        window.history.back();
    };

    mandarReformaARevision = async () => {
      if(this.state.filaSeleccionada!=null){
        try {
          const response = await Axios.post(`http://190.154.254.187:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_revisor', estadoNuevo:'Iniciado', secuencial_reforma:this.state.filaSeleccionada});
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
                        <h1>Seguimiento de Reformas</h1>
                    </div>
                    <div style={encabezaGrupoForm}>
                        <table width="100%">
                            <tr>
                                <td style={{ width: '70%' }}><label style={etiqueta}>Mis Reformas</label></td>
                                <td onClick={() => this.regresar_Inicio()} style={{ width: '10%' }}>Regresar</td>
                            </tr>
                        </table>
                    </div>
                    <div id="tablaFiltrada" className="form-group" style={grupoForm}>
                        {this.state.procesosSinRevision.length > 0 ? (
                            <TablaFiltrada data={this.state.procesosSinRevision} columns={this.state.columns}  verCambios={true} />
                        ) : (
                            <p>No hay procesos disponibles.</p>
                        )}
                    </div><br/><br/>
                </body>
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </div>
        );
    }
}

    export default Seguimiento_reformas;