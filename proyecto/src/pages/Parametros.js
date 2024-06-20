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
  import Parameter_Form from "../components/PARAMETER_FORM";

  const Parametros = () => {
    const history = useHistory();
    
    const handleFormSubmit = (formData) => {
      // Puedes hacer lo que necesites con los datos del formulario, por ejemplo, enviarlos a través de una solicitud HTTP
      console.log('Datos del formulario:', formData.getFieldValue('cuatrimestre'));
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
                        <h3 className="mb-0">Empresa</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Parameter_Form onSubmit={handleFormSubmit}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </Container>
      </>
    );
  };
  
  export default Parametros;