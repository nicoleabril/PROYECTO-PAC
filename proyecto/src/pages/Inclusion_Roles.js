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
  import Add_Rol_Form from '../components/ADD_ROL_FORM';

  const Inclusion_Rol = () => {
    const history = useHistory();
    const fechaActual = new Date();

    const handleFormSubmit = async (formData) => {
      console.log('Respuesta del servidor:', formData.getFieldValue('accesos_rol'));
      try {
        const response = await Axios.post(`http://localhost:5000/registrarRol`, 
        {nombre_rol:formData.getFieldValue('nombre_rol'),
        accesos:formData.getFieldValue('accesos_rol')
      });
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
                        <h3 className="mb-0">Agregar Rol</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Add_Rol_Form onSubmit={handleFormSubmit}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </Container>
      </>
    );
  };
  
  export default Inclusion_Rol;