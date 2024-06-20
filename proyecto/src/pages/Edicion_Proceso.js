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
  import Edit_Form from '../components/EDIT_FORM';

  const Edicion_Proceso = () => {
    const idParaEditar = localStorage.getItem('id');
    const tabla = localStorage.getItem('tabla');
    const handleFormSubmit = async (formData) => {
      try {
        if(tabla === 'procesos'){
            const response = await Axios.post('http://localhost:5000/registrarReforma/', {
                area_requirente: formData.getFieldValue('area_requirente'), 
                anio: formData.getFieldValue('anio'), 
                just_tecnica: formData.getFieldValue('just_tecnica'), 
                just_econom: formData.getFieldValue('just_econom'), 
                just_caso_fort_fmayor: formData.getFieldValue('just_caso_fort_fmayor'), 
                id_partida_presupuestaria: formData.getFieldValue('id_partida_presupuestaria'), 
                partida_presupuestaria: formData.getFieldValue('partida_presupuestaria'), 
                cpc: formData.getFieldValue('cpc'), 
                tipo_compra:formData.getFieldValue('tipo_compra'), 
                tipo_regimen: formData.getFieldValue('tipo_regimen'), 
                tipo_presupuesto: formData.getFieldValue('tipo_presupuesto'), 
                tipo_producto: formData.getFieldValue('tipo_producto'), 
                procedimiento_sugerido: formData.getFieldValue('procedimiento_sugerido'), 
                descripcion: formData.getFieldValue('descripcion'), 
                cantidad: formData.getFieldValue('cantidad'), 
                unidad: formData.getFieldValue('unidad'), 
                costo_unitario: formData.getFieldValue('costo_unitario'), 
                total: formData.getFieldValue('total'), 
                cuatrimestre: formData.getFieldValue('cuatrimestre'), 
                fecha_eedh: formData.getFieldValue('fecha_eedh'), 
                fecha_est_public: formData.getFieldValue('fecha_est_public'), 
                tipo_reforma: 'Modificacion', 
                observaciones: null, 
                usr_creacion: formData.getFieldValue('usr_creacion'), 
                fecha_creacion: formData.getFieldValue('fecha_creacion'), 
                id_proceso: formData.getFieldValue('id_proceso'), 
                estado_elaborador: null, 
                usr_revisor: formData.getFieldValue('usr_revisor'), 
                usr_aprobador: formData.getFieldValue('usr_aprobador'), 
                usr_consolidador: null, 
                usr_autorizador: null, 
                id_departamento: formData.getFieldValue('id_departamento'), 
                version_proceso: formData.getFieldValue('version_proceso'), 
                comentario: null, 
                secuencial_resolucion: null
            });
            console.log('Respuesta del servidor:', response.data);
        }
        if(tabla === 'reformas'){
            const response = await Axios.post('http://localhost:5000/editarReforma/', {
                just_tecnica: formData.getFieldValue('just_tecnica'), 
                just_econom: formData.getFieldValue('just_econom'), 
                just_caso_fort_fmayor: formData.getFieldValue('just_caso_fort_fmayor'), 
                id_partida_presupuestaria: formData.getFieldValue('id_partida_presupuestaria'), 
                partida_presupuestaria: formData.getFieldValue('partida_presupuestaria'), 
                cpc: formData.getFieldValue('cpc'), 
                tipo_compra: formData.getFieldValue('tipo_compra'), 
                tipo_regimen: formData.getFieldValue('tipo_regimen'), 
                tipo_presupuesto: formData.getFieldValue('tipo_presupuesto'), 
                tipo_producto: formData.getFieldValue('tipo_producto'), 
                procedimiento_sugerido:formData.getFieldValue('procedimiento_sugerido'), 
                descripcion: formData.getFieldValue('descripcion'), 
                cantidad: formData.getFieldValue('cantidad'), 
                unidad: formData.getFieldValue('unidad'), 
                costo_unitario: formData.getFieldValue('costo_unitario'), 
                total: formData.getFieldValue('total'), 
                cuatrimestre: formData.getFieldValue('cuatrimestre'), 
                fecha_eedh: formData.getFieldValue('fecha_eedh'), 
                fecha_est_public: formData.getFieldValue('fecha_est_public'), 
                observaciones: null, 
                comentario: null, 
                secuencial_reforma: idParaEditar
            });
            console.log('Respuesta del servidor:', response.data);
        }
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
                        <h3 className="mb-0">Editar Reforma</h3>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Edit_Form onSubmit={handleFormSubmit}/>
                  </CardBody>
                </Card>
              </Col>
            </Row>
      </Container>
      </>
    );
  };
  
  export default Edicion_Proceso;
  