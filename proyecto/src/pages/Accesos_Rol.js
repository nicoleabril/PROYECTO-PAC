import React, { Component, useState, useEffect } from "react";
import { Form, Alert } from 'antd';
import { useHistory } from 'react-router-dom';
import {
    TextArea,
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Input,
    Container,
    Row,
    Col,
  } from "reactstrap";
  // core components
  import AsyncSelect from 'react-select/async';
  import Select from 'react-select';
  import Axios from 'axios';
  import Cookies from 'js-cookie';
  import Access_Form from '../components/ACCESS_FORM';

  const Acceso_Rol = () => {
    const history = useHistory();
    const fechaActual = new Date();
    const idParaEditar = localStorage.getItem('id');

    const handleFormSubmit = async (formData) => {
      try {
        const response = await Axios.post(`http://localhost:5000/registrarRol`, 
        {nombre_rol:formData.getFieldValue('nombre_rol'),
        codigo_rol: formData.getFieldValue('codigo_rol')});
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
          console.error('Error al guardar rol', error);
      }
    };

    return (
      <>
        <Container className="mt--90 mb-4" fluid>
            <Row>
              <Col className="order-xl-15" xl="15">
                <Card className="bg-secondary shadow">
                  <CardHeader className="headerReforma">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h3 className="mb-0">Accesos del Rol</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Access_Form onSubmit={handleFormSubmit}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </Container>
      </>
    );
  };
  
  export default Acceso_Rol;