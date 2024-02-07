import React, { useEffect, useState } from "react";
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import Footer from '../components/FOOTER';
import Edit_Form from '../components/EDIT_FORM';
import Detalle_reforma from './Pantalla_Detalle_Reforma';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Tab, Table } from "react-bootstrap";
import Resolu_Form from "../components/RESOLU_FORM";
import TablaFiltrada from '../components/TABLA_FILTRADA_REFORMA';
import Axios from 'axios';

const body = {
    position: `absolute`,
    top: '20%',
    left: '20%',
    width: '60%'
};


const encabezaGrupoForm = {
    border: '2px solid #000',
    borderRadius: '5px 5px 0px 0px',
    backgroundColor: '#176B87',
    fontWeight: 'bold',
    color: 'white',
    width: '110%',
    padding: '10px',
};

const grupoForm = {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: '0px 2px 2px 2px',
    borderRadius: '0px 0px 5px 5px',
    padding: '10px',
    width: '110%',
};

const etiqueta = {
    fontWeight: 'bold',
    marginRight: '5px',
}

const Edicion_Resolucion = () => {
    const token = Cookies.get('authToken');
    const isLoggedIn = token ? true : false;
    const { id } = useParams();
    const [reformas, setReformas] = useState([]);
    const columns = 
        [{
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
            header: "Tipo Reforma",
            accessorKey: "tipo_reforma",
            footer: "Tipo Reforma",
        },
        ];
    useEffect(() => {

        if (!isLoggedIn) {
            return <Navigate to="/" />;
        }

        obtenerReformas();
    }, [id, isLoggedIn]);


    const obtenerReformas = async () => {
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtener_reformas_autorizadas/${id}`);
            setReformas(response.data);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };

    return (
        <div>
            <Header />
            <Menu />
            <body style={body}>
                <div>
                    <Resolu_Form />
                </div> <br/><br/>
                <div style={encabezaGrupoForm}>
                        <table width="100%">
                            <tr>
                                <td style={{ width: '70%' }}><label style={etiqueta}>Reformas Autorizadas</label></td>
                            </tr>
                        </table>
                    </div>
                    <div id="tablaFiltrada" className="form-group" style={grupoForm}>
                        {reformas.length > 0 ? (
                            <TablaFiltrada data={reformas} columns={columns}  verCambios={true} />
                        ) : (
                            <p>No hay procesos disponibles.</p>
                        )}
                    </div>
            
            </body>
        </div>
    );
};

export default Edicion_Resolucion;