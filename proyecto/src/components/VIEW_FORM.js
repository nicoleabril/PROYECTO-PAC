import React, { useState, useEffect, } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

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

const View_Form = () => {
    const token = Cookies.get('authToken');
    const isLoggedIn = token ? true : false;
    const { id, tabla, posicionAbsoluta } = useParams();
    let posicion = '';
    if(posicionAbsoluta === 'true'){
      posicion = 'absolute';
    }else{
      posicion = 'relative';
    }

    const body = {
        position: `${posicion}`,
        
    };

    console.log(posicionAbsoluta);
    console.log(id);
    console.log(useParams());
    const [proceso, setProceso] = useState([]);
    const [error, setError] = useState(null);

    
  
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
  
    return (
      <div>
        
        <div style={body}>
          <div>
            <h1>Detalle Reforma</h1>
            {error && <p>Error al obtener procesos: {error.message}</p>}
            <div style={encabezaGrupoForm}>
                  <table width="100%">
                            <tr>
                                <td style={{ width: '80%' }}><label style={etiqueta}>Datos Generales</label></td>
                                <td onClick={() => regresar_Inicio()} style={{ width: '10%' }}>Regresar</td>
                            </tr>
                        </table>
            </div>   
            {proceso.length > 0 ? (
                <div style={grupoForm}>  
                  {proceso.map((procesoItem) => (
                    <table width="100%"  key={procesoItem.id_proceso}>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Año</label></td>
                          {tabla==='procesos' && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.año}</label></td>)}
                          {tabla==='reformas' && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.anio}</label></td>)}
                          <td style={{width:'auto'}}></td>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Cantidad</label></td>
                          {tabla==='procesos' && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.cantidad_anual}</label></td>)}
                          {tabla==='reformas' && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.cantidad}</label></td>)}
                          
                      </tr>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Dirección</label></td>
                          {tabla==='procesos' && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.direccion}</label></td>)}
                          {tabla==='reformas' && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.area_requirente}</label></td>)}
                          <td style={{width:'auto'}}></td>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Unidad</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.unidad}</label></td>
                      </tr>
                      <tr>
                          <td style={{width:'auto', textAlign: 'right'}}><label style={etiqueta}>Partida Presupuestaria</label></td>
                          <td style={{width:'auto', textAlign: 'left'}}><label>{procesoItem.partida_presupuestaria}</label></td>
                          <td style={{width:'auto'}}></td>
                      </tr>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Código Proceso</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.codigo_proceso}</label></td>
                          <td style={{width:'auto'}}></td>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Costo Unitario</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{parseFloat(procesoItem.costo_unitario).toFixed(2)}</label></td>
                      </tr>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>CPC</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.cpc}</label></td>
                          <td style={{width:'auto'}}></td>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Total</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{parseFloat(procesoItem.total).toFixed(2)}</label></td>
                      </tr>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Tipo Compra</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.tipo_compra}</label></td>
                          <td style={{width:'auto'}}></td>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Cuatrimestre</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.cuatrimestre}</label></td>
                      </tr>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Tipo Régimen</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.tipo_regimen}</label></td>
                          <td style={{width:'auto'}}></td>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Fecha Entrega Documentos Habilitantes</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.fecha_eedh}</label></td>
                      </tr>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Tipo Presupuesto</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.tipo_presupuesto}</label></td>
                          <td style={{width:'auto'}}></td>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Fecha Estimada Publicación</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.fecha_est_public}</label></td>
                      </tr>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Tipo Producto</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.tipo_producto}</label></td>
                          <td style={{width:'auto'}}></td>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Responsable</label></td>
                          {tabla==='procesos' && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.funcionario_responsable}</label></td>)}
                          {tabla==='reformas' && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.usr_creacion}</label></td>)}
                      </tr>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Procedimiento Sugerido</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.procedimiento_sugerido}</label></td>
                          <td style={{width:'auto'}}></td>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Revisor Compras</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.revisor_compras}</label></td>
                      </tr>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Objeto de Contratación</label></td>
                          {tabla==='procesos' && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.detalle_producto}</label></td>)}
                          {tabla==='reformas' && (<td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.descripcion}</label></td>)}
                      
                          <td style={{width:'auto'}}></td>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Revisor Jurídico</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.revisor_juridico}</label></td>
                      </tr>
                      <tr>
                          <td style={{width:'auto',textAlign: 'right'}}><label style={etiqueta}>Estado Fase Preparatoria</label></td>
                          <td style={{width:'auto',textAlign: 'left'}}><label>{procesoItem.estado_fase_preparatoria}</label></td>
                          <td style={{width:'auto'}}></td>
                      </tr>
                    </table>
                  ))}
                </div>
                /*</tbody>
              </table>*/
              
            ) : (
              <p>No hay procesos disponibles.</p>
            )}
          </div>
        </div>
        
      </div>
    );
  };
  
  export default View_Form;