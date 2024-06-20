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
  import Add_Dep_Form from '../components/ADD_DEP_FORM';

  const Edicion_Departamento = () => {
    const history = useHistory();
    const fechaActual = new Date();
    const idParaEditar = localStorage.getItem('id');

    const handleFormSubmit = async (formData) => {
      try {
        const response = await Axios.post(`http://localhost:5000/actualizarDepartamento/`, 
        {
        id_departamento: idParaEditar,
        id_direccion: formData.getFieldValue('id_direccion'),
        nombre_departamento: formData.getFieldValue('nombre_departamento'), 
        fecha_modificacion:fechaActual,
        id_superior:formData.getFieldValue('id_superior')});
      } catch (error) {
          console.error('Error al guardar información de departamento', error);
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
                        <h3 className="mb-0">Editar Departamento</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Add_Dep_Form onSubmit={handleFormSubmit}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </Container>
      </>
    );
  };
  
  export default Edicion_Departamento;