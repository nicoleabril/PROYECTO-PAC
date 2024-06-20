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
  import Add_Dir_Form from '../components/ADD_DIR_FORM';

  const Inclusion_Direccion = () => {
    const history = useHistory();
    const fechaActual = new Date();
    localStorage.setItem('id', 'null');
    const handleFormSubmit = async (formData) => {
      try {
        const response = await Axios.post(`http://localhost:5000/registrarDireccion/`, 
        {nombre_direccion: formData.getFieldValue('nombre_direccion'), 
        fecha_creacion:fechaActual, 
        fecha_actualizacion:fechaActual,
        id_superior:formData.getFieldValue('id_superior'),
        siglas_direccion:formData.getFieldValue('siglas_direccion')});
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
          console.error('Error al guardar información de empresa', error);
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
                        <h3 className="mb-0">Agregar Dirección</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Add_Dir_Form onSubmit={handleFormSubmit}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </Container>
      </>
    );
  };
  
  export default Inclusion_Direccion;