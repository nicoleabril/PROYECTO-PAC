import React, { Component } from 'react';
import Menu from '../components/PAC_MENU';
import Header from '../components/HEADER';
import Footer from '../components/FOOTER';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { Navigate } from 'react-router-dom';

const body = {
        position:'absolute',
        top: '20%',
        left:'20%',
        width:'60%',
    
};

const enlace={
    cursor:'pointer',
}



class CPC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: Cookies.get('authToken'),
            isLoggedIn: Cookies.get('authToken') ? true : false,
            cpcs: []
        };
    }

    componentDidMount() {
        if (this.state.isLoggedIn) {
            this.obtenerProcesos();
        }
    }

    obtenerProcesos = async () => {
        const username = Cookies.get('usr');
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtener_cpc`);
            this.setState({ cpcs: response.data });
            console.log(response.data);
        } catch (error) {
            console.error('Error al obtener cpc:', error);
        }
    };

    render() {
        if (!this.state.isLoggedIn) {
            return <Navigate to="/"></Navigate>;
        }
        return (
            <div>
                <Header />
                <Menu />
                <body style={body}>
                    <div>
                        <h1>Reporte de CPCs</h1>
                        {this.state.cpcs.length > 0 ? (
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Codigo</th>
                                        <th>Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.cpcs.map(cpc => (
                                        <tr key={cpc.cp_codigo} >
                                            <td>{cpc.cp_codigo}</td>
                                            <td>{cpc.cp_descripcion}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay CPC cargados en la base de datos.</p>
                        )}
                    </div>
                </body>
                <Footer />
            </div>
        );
    }
}

export default CPC;