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
  import Add_Inf_Form from '../components/ADD_INF_FORM';
  const Inclusion_Infima = () => {
    const history = useHistory();
    const handleFormSubmit = async (formData) => {
      try {
            const response = await Axios.post('http://localhost:5000/registrarInfimaCuantia/', {
                id_direccion: formData.getFieldValue('id_direccion'), 
                id_partida: formData.getFieldValue('id_partida_presupuestaria'), 
                partida_presupuestaria: formData.getFieldValue('partida_presupuestaria'), 
                cpc: formData.getFieldValue('cpc'), 
                tipo_compra: formData.getFieldValue('tipo_compra'), 
                detalle_producto: formData.getFieldValue('detalle_producto'), 
                cantidad: formData.getFieldValue('cantidad'), 
                unidad: formData.getFieldValue('unidad'), 
                fecha_inicio_estado: formData.getFieldValue('fecha_inicio_estado'),
                estado: formData.getFieldValue('estado'), 
                elaborador: formData.getFieldValue('elaborador'), 
                aprobador: formData.getFieldValue('aprobador'), 
            });
            console.log('Partida Presupuestaria:', formData.getFieldValue('partida_presupuestaria'));
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
                        <h3 className="mb-0">Agregar Ínfima Cuantía</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Add_Inf_Form onSubmit={handleFormSubmit}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </Container>
      </>
    );
  };
  
  export default Inclusion_Infima;