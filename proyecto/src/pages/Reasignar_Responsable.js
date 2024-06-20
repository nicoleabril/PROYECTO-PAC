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
  import Reasign_Form from "../components/REASIGN_RESPON";
  const Reasignar_Responsable = () => {
    const history = useHistory();
    const handleFormSubmit = async (formData) => {
      try {
            const response = await Axios.post('http://localhost:5000/actualizar_responsables/', {
                id_infima: formData.getFieldValue('id_infima'), 
                elaborador: formData.getFieldValue('elaborador'), 
                aprobador: formData.getFieldValue('aprobador'), 
                oferente_adjudicado: formData.getFieldValue('oferente_adjudicado'), 
                revisor_compras: formData.getFieldValue('revisor_compras'), 
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
                        <h3 className="mb-0">Reasignación de Responsables</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Reasign_Form onSubmit={handleFormSubmit}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </Container>
      </>
    );
  };
  
  export default Reasignar_Responsable;