import React, { useState, useEffect, } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

const body = {
    position: 'absolute',
    top: '20%',
    left: '8%',
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
  width: '135%',
  padding: '10px',
}

const grupoForm = {
  borderStyle: 'solid',
  borderColor: '#000',
  borderWidth: '0px 2px 2px 2px',
  borderRadius: '0px 0px 5px 5px',
  padding: '10px',
  width: '135%',
}

const etiqueta = {
    fontWeight: 'bold',
    marginRight: '5px',
}

const Eliminacion_Reformas = () => {
    const token = Cookies.get('authToken');
    const isLoggedIn = token ? true : false;
    const { id } = useParams();


    
    useEffect(() => {

        if (!isLoggedIn) {
            return <Navigate to="/" />;
        }


    }, [id, isLoggedIn]);

    const [state, setState] = useState({
        abierto: true,
    });
    
    const abrirModal=()=>{
        setState({abierto: !state.abierto});
    } 

    return (
        <>
        <Modal isOpen={state.abierto} style={modalStyles}>
                        <ModalHeader>
                        Confirmación de Eliminación
                        </ModalHeader>
                        <ModalBody>
                        <p>¿Está seguro de que desea eliminar este proceso?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" >Sí, estoy seguro</Button>
                            <Button color="secondary" onClick={abrirModal}>Cancelar</Button>
                        </ModalFooter>
                    </Modal>
        </>
    );
};

export default Eliminacion_Reformas;