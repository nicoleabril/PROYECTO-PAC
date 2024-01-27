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
import {flexRender,useReactTable,getCoreRowModel,getPaginationRowModel,getSortedRowModel,getFilteredRowModel} from "@tanstack/react-table";

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

function MostrarDatos  ({procesoItem, tabla}) {
  return (
    <div>
      <table width="100%">
        <tbody>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Dirección</label></td>
            {tabla==='procesos' && procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.direccion}</label></td>)}
            {tabla==='reformas' && procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.area_requirente}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Año</label></td>
            {tabla==='procesos' && procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.año}</label></td>)}
            {tabla==='reformas' && procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.anio}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto', textAlign: 'right'}}><label style={etiqueta}>Partida Presupuestaria</label></td>
            {procesoItem && (<td style={{width:'auto', textAlign: 'left'}}><label>{procesoItem.partida_presupuestaria}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>CPC</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.cpc}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Tipo Compra</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.tipo_compra}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Tipo Régimen</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.tipo_regimen}</label></td>)}
        </tr>
        <tr> 
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Tipo Presupuesto</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.tipo_presupuesto}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Tipo Producto</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.tipo_producto}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Procedimiento Sugerido</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.procedimiento_sugerido}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Objeto de Contratación</label></td>
            {tabla==='procesos' && procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.detalle_producto}</label></td>)}
            {tabla==='reformas' && procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.descripcion}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Cantidad</label></td>
            {tabla==='procesos' && procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.cantidad_anual}</label></td>)}
            {tabla==='reformas' && procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.cantidad}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Unidad</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.unidad}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Costo Unitario</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{parseFloat(procesoItem.costo_unitario).toFixed(2)}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Total</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{parseFloat(procesoItem.total).toFixed(2)}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Cuatrimestre</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.cuatrimestre}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Fecha Entrega Documentos Habilitantes</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.fecha_eedh}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Fecha Estimada Publicación</label></td>
            {procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.fecha_est_public}</label></td>)}
        </tr>
        <tr>
            <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Responsable</label></td>
            {tabla==='procesos' && procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.funcionario_responsable}</label></td>)}
            {tabla==='reformas' && procesoItem && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.usr_creacion}</label></td>)}
        </tr>
        </tbody>
      </table>
    </div>
  );
};



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

    const [proceso, setProceso] = useState(null);
    const [reforma, setReforma] = useState(null);
    const [error, setError] = useState(null);
    const [comentario, setComentario] = useState(null);

    
  
    useEffect(() => {
      if (!isLoggedIn) {
        return <Navigate to="/" />;
      }
    }, [ isLoggedIn]);

    const regresar_Inicio = () => {
      window.history.back();
    };

    const obtenerProceso = async () => {
      try {
        const response = await Axios.get(`http://190.154.254.187:5000/obtener_reforma/${id}`);
        const reforma_temp = response.data[0];
        console.log(reforma_temp);
        const id_Proceso = reforma_temp.id_proceso+'-'+reforma_temp.version_proceso;
        const  response_P = await Axios.get(`http://190.154.254.187:5000/obtener_proceso/${id_Proceso}`);
        setReforma(reforma_temp);
        setProceso(response_P.data[0]);
      } catch (error) {
        console.error('Error al obtener procesos:', error);
        toast.error('Error al obtener datos');
        setError(error);
      }
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
                  <table width="150%">
                    <tr>
                      <td style={{ width: 'auto' }}>
                        <div style={encabezaGrupoForm}>
                          <table width="100%">
                            <tr>
                                <td style={{ width: '70%' }}><label style={etiqueta}>Datos Actuales</label></td>
                                <td onClick={() => obtenerProceso()} style={{ width: '30%' }}>Visualizar Cambios</td>
                            </tr>
                          </table>
                        </div>
                        <div style={grupoForm}>
                            <MostrarDatos procesoItem={proceso}  tabla={'procesos'}/>
                        </div>
                      </td>
                      <td style={{ width: 'auto' }}>
                        <div style={encabezaGrupoForm}>
                          <table width="100%">
                            <tr>
                                <td style={{ width: '80%' }}><label style={etiqueta}>Cambios Realizados</label></td>
                                <td onClick={() => regresar_Inicio()} style={{ width: '10%' }}>Regresar</td>
                            </tr>
                          </table>
                        </div>
                        <div style={grupoForm}>
                          <MostrarDatos procesoItem={reforma} tabla={'reformas'}/>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <div>
                          <div style={encabezaGrupoForm}>
                            <table width="100%">
                                      <tr>
                                          <td style={{ width: '80%' }}><label style={etiqueta}>Comentario</label></td>
                                          <td onClick={() => enviarComentario()} style={{ width: '30%' }}>Enviar Comentario</td>
                                      </tr>
                                  </table>
                            </div>
                            <div style={grupoForm}>
                                <textarea
                                    className="form-control"
                                    id="objetoContra"
                                    value={comentario}
                                    placeholder='Enviar un comentario'
                                    onChange={(e) => setComentario(e.target.value)}
                                />
                            </div>
                        </div>
                      </td>
                    </tr>
                  </table>
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