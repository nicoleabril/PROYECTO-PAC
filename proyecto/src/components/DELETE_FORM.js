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
    Label,
  } from "reactstrap";
  // core components
  import AsyncSelect from 'react-select/async';
  import Select from 'react-select';
  import Axios from 'axios';
  import Cookies from 'js-cookie';
  import Echart from "../components/chart/EChart";
import LineChart from "../components/chart/LineChart";
  import { RiArrowGoBackFill } from "react-icons/ri";

const Delete_Form = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [form] = Form.useForm();
  const user = Cookies.get('usr');
  const [area, setArea] = useState('');
  const [justificacionTecnica, setJustificacionTecnica] = useState('');
  const [justificacionEconomica, setJusificacionEconomica] = useState('');
  const [justificacionFortuita, setJustificacionFortuita] = useState('');
  const [procesoActual, setProcesoActual] = useState([]);
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const idParaEditar = localStorage.getItem('id');

  useEffect(() => {
    const obtenerDatos = async () => {
        try {
            const userResponse = await Axios.get(`http://localhost:5000/obtener_info_user/${user}`);
            const idDepartamento = userResponse.data[0].depar_usuario;

            const departamentoResponse = await Axios.get(`http://localhost:5000/obtener_departamento_user/${idDepartamento}`);
            const idDireccion = departamentoResponse.data[0].id_direccion;
            const funcionarioRevisorID = departamentoResponse.data[0].id_superior;

            const direccionResponse = await Axios.get(`http://localhost:5000/obtener_direccion_departamento/${idDireccion}`);
            const directorResponsableID = direccionResponse.data[0].id_superior;
            const area = direccionResponse.data[0].nombre_direccion;
            // Usar los datos obtenidos
            setArea(area);
            // ... establecer otros estados según sea necesario
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };
    obtenerDatos();
}, []);

useEffect(() => {
    
  const obtenerProcesoActual = async () => {
    try {
        const response = await Axios.get(`http://localhost:5000/obtener_proceso/${idParaEditar}`);
        setProcesoActual(response.data[0]);
        console.log(response.data[0]);
    } catch (error) {
        console.error('Error al obtener unidades:', error);
    }
  };

  obtenerProcesoActual();
}, []);

const handleInputChangeJE = (e) => {
  setJusificacionEconomica(e.target.value);
};

const handleInputChangeJT = (e) => {
  setJustificacionTecnica(e.target.value);
};

const handleInputChangeJF = (e) => {
  setJustificacionFortuita(e.target.value);
};

const limpiarCampos = () => {
  setJustificacionTecnica('');
  setJusificacionEconomica('');
  setJustificacionFortuita('');
  // Limpia los otros campos del formulario...
};
const regresar_Inicio = () => {
  window.history.back();
};
const handleSubmit = (e) => {
  e.preventDefault();
  if (justificacionTecnica.trim() === '' || 
    justificacionEconomica.trim() === '' || 
    justificacionFortuita.trim() === '' ) {
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
  }else{
    form.setFieldsValue({
      id_proceso: procesoActual.id_proceso, 
      version_proceso: procesoActual.version_proceso,
      just_tecnica: justificacionTecnica, 
      just_econom: justificacionEconomica, 
      just_caso_fort_fmayor: justificacionFortuita,
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
              Justificación
            </h6>
          </Col>
          <Col xs="4" className="text-right">
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              <Button className="btnRegresar" type="primary" title="Regresar" onClick={regresar_Inicio}>
                <span className="iconWrapper">
                  <RiArrowGoBackFill />
                </span>
              </Button>
              <Button
                className="btnRegresar"
                color="primary"
                onClick={handleSubmit}
                size="sm"
                type="submit"
              >
                Enviar
              </Button>
            </div>
          </Col>
        </Row>
      </CardHeader>
        <div className="pl-lg-4">
          <Row>
            <Col lg="6">
              <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-username"
                name="area_requirente"
                label="Área Requirente"
              >Área Requirente</label>
                <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={area}
                  placeholder="Username"
                  type="text"
                  disabled
                  value={area}
                />
              </FormGroup>
            </Col>
            <Col lg="6">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-email"
                >
                  Año
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-email"
                  placeholder="jesse@example.com"
                  defaultValue={anioActual}
                  disabled
                  type="email"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-first-name"
                >
                  Justificación Técnica
                </label>
                <Input 
                  className="form-control-alternative"
                  id="input-first-name"
                  type="textarea"
                  value={justificacionTecnica}
                  onChange={handleInputChangeJT}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12" >
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-first-name"
                >
                  Justificación Económica
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-first-name"
                  type="textarea"
                  value={justificacionEconomica}
                  onChange={handleInputChangeJE}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-first-name"
                >
                  Justificación Caso Fortuito / Fuerza mayor
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-first-name"
                  type="textarea"
                  required
                  value={justificacionFortuita}
                  onChange={handleInputChangeJF}
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

export default Delete_Form;