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
  import Add_Doc_Hab_Form from '../components/ADD_DOC_HAB_FORM';

  const Inclusion_Doc_Hab = () => {
    const history = useHistory();
    localStorage.setItem('id_doc', 'null');
    const handleFormSubmit = async (formData) => {
      try {
        const response = await Axios.post(`http://localhost:5000/registrarDocHab/`, 
        {nombre_doc: formData.getFieldValue('nombre_doc'), 
        tipo_compra:formData.getFieldValue('tipo_compra'), 
        obligatorio:formData.getFieldValue('obligatorio'),
        email_doc:formData.getFieldValue('email_doc'),
        tipo_proceso:formData.getFieldValue('tipo_proceso')});
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
          console.error('Error al guardar información de documento', error);
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
                        <h3 className="mb-0">Agregar Documento Habilitante por Tipo de Compra</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Add_Doc_Hab_Form onSubmit={handleFormSubmit}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </Container>
      </>
    );
  };
  
  export default Inclusion_Doc_Hab;