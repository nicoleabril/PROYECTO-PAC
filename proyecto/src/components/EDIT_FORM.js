import React, { Component, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import Axios from 'axios';

const body = {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '60%',

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


const Edit_Form = (props) => {
    const user = Cookies.get('usr');
    const [idDepartamento, setIdDepartamento] = useState('');
    const [idDireccion, setIdDireccion] = useState('');
    const [area, setArea] = useState('');
    const [mostrarLista, setMostrarLista] = useState(false);
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const [proceso, setProceso] = useState([]);
    const [partidasPresu, setPartidasPresu] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [seleccionadoPartidas, setSeleccionadoPartidas] = useState('');
    const [opcionesFiltradas, setOpcionesFiltradas] = useState([]);
    const [error, setError] = useState(null);
    const [justificacionTec, setJustificacionTec] = useState('');
    const [justificacionEco, setJustificacionEco] = useState('');
    const [justificacionFortuita, setJustificacionFortuita] = useState('');

    useEffect(() => {
        const obtenerUser = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_info_user/${user}`);
                setIdDepartamento(response.data[0].depar_usuario);
            } catch (error) {
                console.error('Error al obtener procesos:', error);
                setError(error);
            }
        }

        const obtenerDepartamento = async () => {
            try {
                console.log(idDepartamento);
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_departamento_user/${idDepartamento}`);
                setIdDireccion(response.data[0].id_direccion);
            } catch (error) {
                console.error('Error al obtener procesos:', error);
                setError(error);
            }
        }

        const obtenerDireccion = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_direccion_departamento/${idDireccion}`);
                setArea(response.data[0].nombre_direccion);
            } catch (error) {
                console.error('Error al obtener procesos:', error);
                setError(error);
            }
        }

        const obtenerProceso = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_proceso/${props.idProceso}`);
                setProceso(response.data);
                setJustificacionEco(response.data[0].año);
            } catch (error) {
                console.error('Error al obtener procesos:', error);
                setError(error);
            }
        };

        const obtenerPartidasPresupuestarias = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtenerPartidasPresupuestarias/${idDireccion}`);
                setPartidasPresu(response.data);
                setOpcionesFiltradas(response.data);
            } catch (error) {
                console.error('Error al obtener procesos:', error);
                setError(error);
            }
        };
        obtenerUser();
        obtenerDepartamento();
        obtenerDireccion();
        obtenerProceso();
        obtenerPartidasPresupuestarias();
        console.log(partidasPresu);
    }, [idDepartamento, idDireccion, area, justificacionEco, proceso, partidasPresu, opcionesFiltradas]);

    
    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setFiltro(inputValue);

        // Lógica de filtrado aquí
        const opcionesFiltradas = partidasPresu.filter(opcion =>
            opcion.opcion.toLowerCase().includes(inputValue.toLowerCase())
        );
        setOpcionesFiltradas(opcionesFiltradas);

        setMostrarLista(true); // Mostrar lista al escribir
    };

    return (
        <div style={body}>
            <div>
                <h1>Editar Reforma</h1>
                <div>
                    <form>
                        <div style={encabezaGrupoForm}>Justificación</div>
                        <div className="form-group" style={grupoForm}>
                            <table width="100%">
                                <tr>
                                    <td style={{ width: '15%' }}><label style={etiqueta}>Area Requiriente:</label></td>
                                    <td style={{ width: '15%' }}><label>{area}</label></td>
                                    <td style={{ width: '40%' }}></td>
                                    <td style={{ width: '15%', textAlign: 'right' }}><label style={etiqueta}>Año:</label></td>
                                    <td style={{ width: '15%' }}><label>{anioActual}</label></td>
                                </tr>
                            </table>
                            <br />

                            <label style={etiqueta}>Justificación Técnica</label>
                            <textarea
                                className="form-control"
                                id="justificacionTec"
                                value={justificacionTec}
                                onChange={(e) => setJustificacionTec(e.target.value)}
                            />
                            <label style={etiqueta}>Justificación Económica</label>
                            <textarea
                                className="form-control"
                                id="justificacionEco"
                                value={justificacionEco}
                                onChange={(e) => setJustificacionEco(e.target.value)}
                            />
                            <label style={etiqueta}>Justificación Caso Fortuito / Fuerza mayor</label>
                            <textarea
                                type="text"
                                className="form-control"
                                id="justificacionFortuita"
                                value={justificacionFortuita}
                                onChange={(e) => setJustificacionFortuita(e.target.value)}
                            />
                        </div>
                        <br />
                        <br />
                        <div style={encabezaGrupoForm}>Solicitud Reformas</div>
                        <div className="form-group" style={grupoForm}>
                        <input
                                className="form-control"
                                type="text"
                                value={filtro}
                                onChange={handleInputChange}
                                placeholder="Seleccione una opción..."
                        />
                            {mostrarLista && (
                                <ul>
                                    {opcionesFiltradas.map((opcion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => {
                                                setSeleccionadoPartidas(`${opcion.index}: ${opcion.opcion}`);
                                                setMostrarLista(false);
                                                setFiltro(`${opcion.index}: ${opcion.opcion}`);
                                            }}
                                        >
                                            {opcion.index}: {opcion.opcion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {seleccionadoPartidas && (
                                <p>Opción seleccionada: {seleccionadoPartidas}</p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Edit_Form;