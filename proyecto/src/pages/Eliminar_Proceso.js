import React, { Component, useState, useEffect } from "react";
import { Form } from 'antd';
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
  import Delete_Form from '../components/DELETE_FORM';

  const Eliminacion_Proceso = () => {

    const handleFormSubmit = async (formData) => {
      try {
            const response = await Axios.post('http://localhost:5000/eliminarReforma/', {
                id_proceso: formData.getFieldValue('id_proceso'), 
                version_proceso: formData.getFieldValue('version_proceso'),
                just_tec: formData.getFieldValue('just_tecnica'), 
                just_econom: formData.getFieldValue('just_econom'), 
                just_caso_fort: formData.getFieldValue('just_caso_fort_fmayor')
            });
            console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        console.error('Error al enviar datos:', error);
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
                        <h3 className="mb-0">Eliminar Reforma</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Delete_Form onSubmit={handleFormSubmit}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
      </Container>
      </>
    );
  };
  
  export default Eliminacion_Proceso;