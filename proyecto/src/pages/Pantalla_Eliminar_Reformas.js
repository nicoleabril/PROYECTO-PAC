import React, { useState, useEffect, } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import View_Form from "../components/VIEW_FORM";
const body = {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '60%'
};

const modalStyles={
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
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

const grupoForm = {
  borderStyle: 'solid',
  borderColor: '#000',
  borderWidth: '0px 2px 2px 2px',
  borderRadius: '0px 0px 5px 5px',
  padding: '10px',
  width: '100%',
}

const mensaje_Error = {
    color: '#FF0000',
    fontWeight: 'bold'
};


const etiqueta = {
    fontWeight: 'bold',
    marginRight: '5px',
}

const Eliminacion_Reformas = () => {
    const token = Cookies.get('authToken');
    const user = Cookies.get('usr');
    const isLoggedIn = token ? true : false;
    const { id, tabla, posicionAbsoluta } = useParams();
    const [error, setError] = useState(null);
    const [justificacionTec, setJustificacionTec] = useState('');
    const [justificacionEco, setJustificacionEco] = useState('');
    const [justificacionFortuita, setJustificacionFortuita] = useState('');
    const [area, setArea] = useState('');
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const [proceso, setProceso] = useState([]);
    const [mensajeError, setMensajeError] = useState({
        mensaje_justificacionTec: '',mensaje_justificacionEco: '',mensaje_justificacionFortuita: ''
    });

    const [state, setState] = useState({
        abierto: false,
    });

    const cerrarModal=()=>{
        setState({abierto: false});
      }
    
    const abrirModal=(e)=>{
        const errores= {
            mensaje_justificacionTec: '',mensaje_justificacionEco: '',mensaje_justificacionFortuita: ''
        };
        e.preventDefault();
        let formValido = true;
        if (!justificacionTec.trim()) {
            errores.mensaje_justificacionTec ='*Ingrese justificación técnica';
            formValido = false;
        }
        if (!justificacionEco.trim()) {
            errores.mensaje_justificacionEco = '*Ingrese justificación económica';
            formValido = false;
        }
        if (!justificacionFortuita.trim()) {
            errores.mensaje_justificacionFortuita = ('*Ingrese justificación caso fortuito o fuerza mayor');
            formValido = false;
        }
        if(!formValido){
            setMensajeError(errores);
        }
        if(formValido){
            setState({abierto: !state.abierto});
        }
    } 

    const eliminarProceso = async () => {
        try {
            const response = await Axios.post(`http://190.154.254.187:5000/eliminarReforma/`, {
                id_proceso: proceso[0].id_proceso, 
                version_proceso: proceso[0].version_proceso,
                just_tec: justificacionTec,
                just_econom: justificacionEco,
                just_caso_fort: justificacionFortuita
            });
            console.log(response.data);
            toast.success(response.data.message);
        } catch (error) {
            toast.error('Error al eliminar el proceso', error.message);
            console.log(error);
        }
        cerrarModal();
        //this.recargar_ventana();
    };

    const regresar_Inicio = () => {
        window.history.back();
    };


    const handleInputChangeEliminarProceso = (e) => {
        eliminarProceso();
    };

    useEffect(() => {
        const obtenerProceso = async () => {
          try {
            const userResponse = await Axios.get(`http://190.154.254.187:5000/obtener_info_user/${user}`);
            const idDepartamento = userResponse.data[0].depar_usuario;
            const departamentoResponse = await Axios.get(`http://190.154.254.187:5000/obtener_departamento_user/${idDepartamento}`);
            const idDireccion = departamentoResponse.data[0].id_direccion;
            const direccionResponse = await Axios.get(`http://190.154.254.187:5000/obtener_direccion_departamento/${idDireccion}`);
            setArea(direccionResponse.data[0].nombre_direccion);
            const response = await Axios.get(`http://190.154.254.187:5000/obtener_proceso/${id}`);
            setProceso(response.data);
          } catch (error) {
            console.error('Error al obtener procesos:', error);
            setError(error);
          }
        };
    
        if (!isLoggedIn) {
          return <Navigate to="/" />;
        }
    
        obtenerProceso();
    }, [id, isLoggedIn]);


    return (
        <>
        <Header />
        <Menu />
        <div style={body}>
            <div>
                <h1>Eliminar Reforma</h1>
                <div>
                    <form onSubmit={abrirModal}>
                        <div style={encabezaGrupoForm}>
                        <table width="100%">
                            <tr>
                                <td style={{ width: '80%' }}><label style={etiqueta}>Justificación</label></td>
                                <td onClick={() => regresar_Inicio()} style={{ width: '10%' }}>Cancelar</td>
                                <td style={{ width: '10%' }}><button type="submit">Eliminar</button></td>
                            </tr>
                        </table>
                        </div>  
                        <div className="form-group" style={grupoForm}>
                                <table width="100%">
                                    <tr>
                                        <td style={{ width: '20%' }}><label style={etiqueta}>Área Requiriente:</label></td>
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
                                    placeholder="MOTIVAR LA RAZON TÉCNICA DEL PORQUE SE INCLUYE, CANCELA O MODIFICA EL PAC."
                                />
                                <p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_justificacionTec}</p>
                                <label style={etiqueta}>Justificación Económica</label>
                                <textarea
                                placeholder="MOTIVAR LA RAZON ECONÓMICA DEL PORQUE SE INCLUYE, CANCELA O MODIFICA EL PAC (En caso de no aplicar señalar los motivos por los cuales no impact al presupuesto)."
                                    className="form-control"
                                    id="justificacionEco"
                                    value={justificacionEco}
                                    onChange={(e) => setJustificacionEco(e.target.value)}
                                    
                                />
                                <p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_justificacionEco}</p>
                                <label style={etiqueta}>Justificación Caso Fortuito / Fuerza mayor</label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    id="justificacionFortuita"
                                    value={justificacionFortuita}
                                    onChange={(e) => setJustificacionFortuita(e.target.value)}
                                    placeholder="MOTIVAR LA RAZON DEL PORQUE SE INCLUYE, CANCELA O MODIFICA EL PAC (Este punto solo aplica para caso fortuito o fuerza mayor, caso contrario señalar &quot;No Aplica&quot;)"
                                />
                                <p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_justificacionFortuita}</p>
                            </div>
                            <br />
                            <br />
                            <div>
                                <View_Form />
                            </div>
                    
                    </form>
                </div>
                <Modal isOpen={state.abierto} style={modalStyles}>
                    <ModalHeader>
                    Confirmación
                    </ModalHeader>
                    <ModalBody>
                    <p>¿Está seguro de que desea eliminar este proceso?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={handleInputChangeEliminarProceso} >Sí, estoy seguro</Button>
                        <Button color="secondary" onClick={cerrarModal}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
        </>
    );
};

export default Eliminacion_Reformas;