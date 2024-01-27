import React, { useEffect } from "react";
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import Footer from '../components/FOOTER';
import Edit_Form from '../components/EDIT_FORM';
import Detalle_reforma from './Pantalla_Detalle_Reforma';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Tab, Table } from "react-bootstrap";
import View_Form from "../components/VIEW_FORM";

const body = {
    position: `absolute`,
    top: '20%',
    left: '20%',
    width: '60%'
};

const grupoForm = {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: '0px 2px 2px 2px',
    borderRadius: '0px 0px 5px 5px',
    padding: '10px',
    width: '140%',
}

const Edicion_Reformas = () => {
    const token = Cookies.get('authToken');
    const isLoggedIn = token ? true : false;
    const { id, tabla, posicionAbsoluta } = useParams();
    

    useEffect(() => {

        if (!isLoggedIn) {
            return <Navigate to="/" />;
        }


    }, [id, isLoggedIn]);

    return (
        <div>
            <Header />
            <Menu />
            <body style={body}>
            <div>
                <div>
                    <View_Form />
                </div> 
            </div>
            <div>
                <Edit_Form/>
            </div>
            </body>
        </div>
    );
};

export default Edicion_Reformas;