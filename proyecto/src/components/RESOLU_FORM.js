import React, { Component, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import Axios from 'axios';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";

const body = {
    top: '20%',
    left: '20%',
    width: '110%',

};

const mensaje_Error = {
    color: '#FF0000',
    fontWeight: 'bold'
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
    width: '100%',
}

const encabezaGrupoForm = {
    border: '2px solid #000',
    borderRadius: '5px 5px 0px 0px',
    backgroundColor: '#176B87',
    fontWeight: 'bold',
    color: 'white',
    width: '100%',
    padding: '10px',
}


const Resolu_form = (props) => {
    const user = Cookies.get('usr');
    const fechaActual = new Date();
    const { id } = useParams();
    const [codigo_resolucion, setCodigoResolucion] = useState('');
    const [resolucion, setResolucion] = useState([]);
    const [resolucionFirmada, setResolucionFirmada] = useState([]);



    const actualizarResolucion = async (resoluciones) => {
        const archivoGenerado = this.generarDetalleReforma();
        try {
            const registrar_resolucion = await Axios.post(`http://190.154.254.187:5000/actualizarResolucion`, {
                fch_carga_documento:'', 
                fch_carga_firmada:'', 
                usr_carga:'', 
                usr_carga_firmada:'', 
                estado:'', 
                url_resolucion:'', 
                url_resol_firmada:'', 
                codigo_resolucion:'', 
                nro_sol_resol:''});
            await toast.success(registrar_resolucion.data.message);
        } catch (error) {
              console.error('Error al cambiar estado de Reforma:', error);
        }
    }

    const regresar_Inicio = () => {
        window.history.back();
    };

    const handleSubmit = () => {

    }

    return (
        <div style={body}>
            <div>
                <h1>Edición Resolución</h1>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div style={encabezaGrupoForm}>
                        <table width="100%">
                            <tr>
                                <td style={{ width: '80%' }}><label style={etiqueta}>Formulario Resolución Reformas</label></td>
                                <td onClick={() => regresar_Inicio()} style={{ width: '10%' }}>Regresar</td>
                                <td style={{ width: '10%' }}><button type="submit">Guardar</button></td>
                            </tr>
                        </table>
                        </div>  
                        <div className="form-group" style={grupoForm}>
                            <table width="100%">
                                <tr>
                                    <td style={{ width: 'auto' }}><label style={etiqueta}>Número de Resolución</label></td>
                                    <td style={{ width: 'auto' }}>
                                        <label>
                                            <input type="text" value={codigo_resolucion} />
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: 'auto' }}><label style={etiqueta}>Cargar resolución</label></td>
                                    <td style={{ width: 'auto' }}>
                                        <label>
                                            <input type="file" value={resolucion} accept="application/pdf"/>
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: 'auto' }}><label style={etiqueta}>Cargar resolución firmada</label></td>
                                    <td style={{ width: 'auto' }}>
                                        <label>
                                            <input type="file" value={resolucionFirmada} accept="application/pdf"/>
                                        </label>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
}

export default Resolu_form;