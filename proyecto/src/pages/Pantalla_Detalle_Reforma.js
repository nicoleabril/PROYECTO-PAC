import React, { useState, useEffect, } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

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

const Detalle_reforma = () => {
    const token = Cookies.get('authToken');
    const isLoggedIn = token ? true : false;
    const { id } = useParams();
    const [proceso, setProceso] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const obtenerProceso = async () => {
        try {
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
      <div>
        <Header />
        <Menu />
        <div style={body}>
          <div>
            <h1>Detalle Reforma</h1>
            {error && <p>Error al obtener procesos: {error.message}</p>}
            {proceso.length > 0 ? (
              /*<table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Codigo Proceso</th>
                    <th>Objeto Contratación</th>
                    <th>Tipo Compra</th>
                    <th>Tipo Regimen</th>
                  </tr>
                </thead>
                <tbody>*/
                <div>
                  {proceso.map((procesoItem) => (
                    <div key={procesoItem.id_proceso}>
                      <p><span style={etiqueta}>Código Proceso:</span>{procesoItem.codigo_proceso}</p>
                      <p><span style={etiqueta}>Objeto de Contratación:</span>{procesoItem.detalle_producto}</p>
                      <p><span style={etiqueta}>Tipo Compra:</span>{procesoItem.tipo_compra}</p>
                      <p><span style={etiqueta}>Tipo Régimen:</span>{procesoItem.tipo_regimen}</p>
                    </div>
                  ))}
                  </div>
                /*</tbody>
              </table>*/
              
            ) : (
              <p>No hay procesos disponibles.</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  
  export default Detalle_reforma;