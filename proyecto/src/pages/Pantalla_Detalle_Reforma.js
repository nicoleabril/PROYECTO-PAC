import React, { useState, useEffect, } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import View_Form from '../components/VIEW_FORM';
import { toast, ToastContainer } from "react-toastify";
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

const etiqueta = {
    fontWeight: 'bold',
    marginRight: '5px',
}

const Detalle_reforma = () => {
    const token = Cookies.get('authToken');
    const isLoggedIn = token ? true : false;
    const { id, tabla, posicionAbsoluta } = useParams();
    const body = {
      position: `absolute`,
        top: '20%',
        left: '20%',
        width: '60%'
    };

    console.log(posicionAbsoluta);
    console.log(id);
    console.log(useParams());
    const [proceso, setProceso] = useState([]);
    const [error, setError] = useState(null);
    const [comentario, setComentario] = useState(null);

    
  
    useEffect(() => {
      
        const obtenerProceso = async () => {
          if(tabla==='procesos'){
            try {
              const response = await Axios.get(`http://190.154.254.187:5000/obtener_proceso/${id}`);
              setProceso(response.data);
            } catch (error) {
              console.error('Error al obtener procesos:', error);
              setError(error);
            }
          } 
          if(tabla==='reformas'){
            try {
              const response = await Axios.get(`http://190.154.254.187:5000/obtener_reforma/${id}`);
              setProceso(response.data);
            } catch (error) {
              console.error('Error al obtener procesos:', error);
              setError(error);
            }
          }
        };
      
  
      if (!isLoggedIn) {
        return <Navigate to="/" />;
      }
  
      obtenerProceso();
    }, [id, isLoggedIn]);

    const regresar_Inicio = () => {
      window.history.back();
    };

    const enviarComentario = async () => {
      if(comentario!=null){
        try {
          const response = await Axios.post(`http://190.154.254.187:5000/enviarComentario`, {comentario: comentario, secuencial_reforma: id });
          console.log('Respuesta del servidor:', response.data);
          await toast.success(response.data.message);
        } catch (error) {
            console.error('Error al enviar comentario:', error);
        }
      }else{
        toast.error('Por favor, escriba un comentario');
      }
        
    }
  
    return (
      <div>
            <Header />
            <Menu />
            <body style={body}>
            <div>
                <div>
                    <View_Form />
                </div>
                <div>
                </div>  
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </body>
        </div>
    );
  };
  
  export default Detalle_reforma;