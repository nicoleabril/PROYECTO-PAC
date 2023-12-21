import React, { useEffect } from "react";
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import Footer from '../components/FOOTER';
import Edit_Form from '../components/EDIT_FORM';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Edicion_Reformas = () => {
    const token = Cookies.get('authToken');
    const isLoggedIn = token ? true : false;
    const { id } = useParams();


    useEffect(() => {

        if (!isLoggedIn) {
            return <Navigate to="/" />;
        }


    }, [id, isLoggedIn]);

    return (
        <div>
            <Header />
            <Menu />
            <Edit_Form idProceso={id} />
            
        </div>
    );
};

export default Edicion_Reformas;