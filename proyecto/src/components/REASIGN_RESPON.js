import React, { Component, useState, useEffect } from "react";
import { Alert, Form } from 'antd';
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
  import { RiArrowGoBackFill } from "react-icons/ri";

const Reasign_Form = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [form] = Form.useForm();
  const user = Cookies.get('usr');
  const id_infima = localStorage.getItem('idInfima');
  const [infima, setInfima] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [elaboradorSeleccionado, setElaboradorSeleccionado] = useState(null);
  const [aprobadorSeleccionado, setAprobadorSeleccionado] = useState(null);
  const [revisorSeleccionado, setRevisorSeleccionado] = useState(null);
  const [oferenteSeleccionado, setOferenteSeleccionado] = useState(null);
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();

  const regresar_Inicio = () => {
    window.history.back();
  };
  

  useEffect(() => {
    const obtenerInfima = async () => {
        try {
          const response = await Axios.get(`http://localhost:5000/obtener_infima_cuantia/${id_infima}`);
          const infima = response.data[0];
          setInfima(response.data[0]);

          const usuariosResponse = await Axios.get(`http://localhost:5000/obtener_usuarios/`);
          const usuariosData = usuariosResponse.data;
          setUsuarios(usuariosData);

          if(infima.elaborador !== null){
            setElaboradorSeleccionado(usuariosData.find(usuario => usuario.correo_usuario === infima.elaborador));
          }
          if(infima.aprobador !== null){
            setAprobadorSeleccionado(usuariosData.find(usuario => usuario.correo_usuario === infima.aprobador));
          }
          if(infima.revisor_compras !== null){
            setRevisorSeleccionado(usuariosData.find(usuario => usuario.correo_usuario === infima.revisor_compras));
          }
          if(infima.oferente_adjudicado !== null){
            setOferenteSeleccionado(usuariosData.find(usuario => usuario.correo_usuario === infima.oferente_adjudicado));
          }

        } catch (error) {
            console.error('Error al obtener infima:', error);
        }
    };

    obtenerInfima();

  }, []);


  const handleInputChangeOferente = (selectedOption) => {
    setOferenteSeleccionado(usuarios.find(usuario => usuario.id_usuario === selectedOption.value));
  };

  const handleInputChangeAprobador = (selectedOption) => {
    setAprobadorSeleccionado(usuarios.find(usuario => usuario.id_usuario === selectedOption.value));
  };

  const handleInputChangeElaborador = (selectedOption) => {
    setElaboradorSeleccionado(usuarios.find(usuario => usuario.id_usuario === selectedOption.value));
  };

  const handleInputChangeRevisor = (selectedOption) => {
    setRevisorSeleccionado(usuarios.find(usuario => usuario.id_usuario === selectedOption.value));
  };

const limpiarCampos = () => {
  
  setInfima(null);
  // Limpia los otros campos del formulario...
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (
    elaboradorSeleccionado === null || 
    aprobadorSeleccionado === null || 
    oferenteSeleccionado === null ||
    revisorSeleccionado === null) {
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
  }else{
    form.setFieldsValue({
      id_infima: id_infima,
      elaborador: elaboradorSeleccionado.correo_usuario, 
      aprobador: aprobadorSeleccionado.correo_usuario, 
      oferente_adjudicado: oferenteSeleccionado.correo_usuario, 
      revisor_compras: revisorSeleccionado.correo_usuario, 
    });
    setSuccessVisible(true);
    setTimeout(() => setSuccessVisible(false), 3000);
    limpiarCampos();
    onSubmit(form);
  }
};

  return (
      <>
      {/* Alerta de error */}
      {errorVisible && (
        <Alert
          message="Por favor complete todos los campos del formulario."
          type="error"
          showIcon
          closable
          onClose={() => setErrorVisible(false)}
        />
      )}
      {/* Alerta de éxito */}
      {successVisible && (
        <Alert
          message="Se agregó la reforma correctamente"
          type="success"
          showIcon
          closable
          onClose={() => setSuccessVisible(false)}
        />
      )}
     
       <Form form={form} >
        <CardHeader className="headerReformaTitle">
        <Row className="align-items-center">
          <Col xs="8">
            <h6 className="titulosReforma sinMargenDerecho">
                Datos Generales
            </h6>
          </Col>
          <Col xs="4" className="text-right">
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              <Button className="btnRegresar" type="button" color="primary" title="Regresar" onClick={regresar_Inicio}>
                <span className="iconWrapper">
                  <RiArrowGoBackFill />
                </span>
              </Button>
              <Button className="btnRegresar" color="primary" size="sm" type="submit" onClick={handleSubmit}>
                Enviar
              </Button>
            </div>
          </Col>
        </Row>
      </CardHeader>
        <div className="pl-lg-4">
            <Row>
            <Col md="12">
                <FormGroup>
                <label>Dirección</label>
                <Input
                    defaultValue={infima ? infima.nombre_direccion : null}
                    disabled
                />
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup>
                <label>Elaborador</label>
                <Select
                    value={elaboradorSeleccionado ?
                      { label: elaboradorSeleccionado.nombres_usuario + ' ' + elaboradorSeleccionado.apellidos_usuario, 
                        value: elaboradorSeleccionado
                      } : null
                    }
                    onChange={handleInputChangeElaborador}
                    options={usuarios.map((elemento) => ({
                      value: elemento.id_usuario,
                      label: elemento.nombres_usuario + ' ' + elemento.apellidos_usuario,
                    }))}
                    placeholder="Selecciona una opción..."
                />
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup>
                <label>Aprobador</label>
                <Select
                    value={aprobadorSeleccionado ?
                      { label: aprobadorSeleccionado.nombres_usuario + ' ' + aprobadorSeleccionado.apellidos_usuario, 
                        value: aprobadorSeleccionado
                      } : null
                    }
                    onChange={handleInputChangeAprobador}
                    options={usuarios.map((elemento) => ({
                      value: elemento.id_usuario,
                      label: elemento.nombres_usuario + ' ' + elemento.apellidos_usuario,
                    }))}
                    placeholder="Selecciona una opción..."
                />
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup>
                <label>Objeto de Contratación</label>
                <Input
                    type="textarea"
                    defaultValue={infima ? infima.detalle_producto:null}
                    disabled
                />
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup>
                <label>Revisor de Compras</label>
                <Select
                    value={revisorSeleccionado ?
                      { label: revisorSeleccionado.nombres_usuario + ' ' + revisorSeleccionado.apellidos_usuario, 
                        value: revisorSeleccionado
                      } : null
                    }
                    onChange={handleInputChangeRevisor}
                    options={usuarios.map((elemento) => ({
                      value: elemento.id_usuario,
                      label: elemento.nombres_usuario + ' ' + elemento.apellidos_usuario,
                    }))}
                    placeholder="Selecciona una opción..."
                />
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup>
                <label>Administrador Orden de Compras</label>
                <Select
                    value={oferenteSeleccionado ?
                      { label: oferenteSeleccionado.nombres_usuario + ' ' + oferenteSeleccionado.apellidos_usuario, 
                        value: oferenteSeleccionado
                      } : null
                    }
                    onChange={handleInputChangeOferente}
                    options={usuarios.map((elemento) => ({
                      value: elemento.id_usuario,
                      label: elemento.nombres_usuario + ' ' + elemento.apellidos_usuario,
                    }))}
                    placeholder="Selecciona una opción..."
                />
                </FormGroup>
            </Col>
            </Row>
        </div>
        <hr className="hr" />
    </Form>

      </>
    );
}

export default Reasign_Form;
