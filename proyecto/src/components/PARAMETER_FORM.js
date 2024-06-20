import React, { Component, useState, useEffect } from "react";
import { Alert, Checkbox, Form, Image, InputNumber, Radio} from 'antd';
import { BiSolidBusiness } from "react-icons/bi";//Empresa
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

const Parameter_Form = ({ onSubmit })=> {
    const [validarPresupuesto, setValidarPresupuesto] = useState(true);
    const [numDiasPrevios, setNumDiasPrevios] = useState('');
    const [mensajeCorreo, setMensajeCorreo] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [form] = Form.useForm();
    const user = Cookies.get('usr');
    const [empresa, setEmpresa] = useState([]);
    const regresar_Inicio = () => {
        window.history.back();
    };


    useEffect(() => {
      const obtenerEmpresa = async () => {
        const username = Cookies.get('usr');
        try {
            const response = await Axios.get(`http://localhost:5000/obtenerEmpresa/`);
            setEmpresa(response.data[0]);
            if(response.data[0]){
              setMensajeCorreo(response.data[0].mensaje_correo);
              setNumDiasPrevios(response.data[0].dias_previos_de_publicacion);
              if(response.data[0].validar_presupuesto !== null){
                setValidarPresupuesto(response.data[0].validar_presupuesto);
              }
            }
        } catch (error) {
            console.error('Error al obtener información de empresa', error);
        }
      };
      obtenerEmpresa();
    }, []);

    const handleSubmitGuardar = async (e) => {
      e.preventDefault();
      if(mensajeCorreo.trim() === '' || toString(numDiasPrevios).trim() === '' ||  validarPresupuesto === null){
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
      }else{
        if(empresa){
          try {
            const response = await Axios.post(`http://localhost:5000/actualizarParametrosEmpresa/`, {mensaje_correo: mensajeCorreo, dias_previos_de_publicacion:numDiasPrevios, validar_presupuesto:validarPresupuesto});
            console.log('Respuesta del servidor:', response.data);
          } catch (error) {
              console.error('Error al guardar información de empresa', error);
          }
        }
        setSuccessVisible(true);
        setTimeout(() => {
          setSuccessVisible(false);
          window.location.reload();
        }, 1000);
      }
    }

    const onChange = (e) => {
      console.log('radio checked', e.target.value);
      setValidarPresupuesto(e.target.value);
      console.log(validarPresupuesto);
    };

    const handleInputChangeNumDiasPrevios = (e) => {
      // Obtén el valor del input
      let inputValue = e.target.value;
      setNumDiasPrevios(inputValue);
      // Si el valor no es un número, no actualices el estado
      if (!/^\d*$/.test(inputValue)) {
        return;
      }
    };

    const handleInputChangeMensajeCorreo = (e) => {
      setMensajeCorreo(e.target.value);
      console.log(e.target.value);
    }


    

    const handleInputBlurCantidad = (e) => {
      let inputValue = e.target.value;
      // Convierte el valor a un número entero
      inputValue = parseInt(inputValue, 10);
      setNumDiasPrevios(inputValue);
      //form.setFieldsValue({cantidad: inputValue});
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
          message="Los datos de la empresa se han guardado correctamente"
          type="success"
          showIcon
          closable
          onClose={() => setSuccessVisible(false)}
        />
      )}
      
      <div className="contenedorEmpresa">
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
            <div className="form-container">
              <Form form={form}>
                <Card bordered={false}>
                  <CardHeader className="headerReformaTitle">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h6 className="titulosReforma sinMargenDerecho">
                            Parámetros Generales
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
                            size="sm"
                            type="submit"
                            onClick={handleSubmitGuardar}
                          >
                            Guardar
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
                        >Validar Presupuesto</label><br/>
                        <Radio.Group onChange={onChange} value={validarPresupuesto}>
                          <Radio 
                            className="form-control-alternative"
                            value={true}>
                            Sí
                        </Radio>
                          <Radio className="form-control-alternative" value={false}>No</Radio>
                        </Radio.Group>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Días Previos para Fecha de Publicación
                          </label><br/>
                          <Input type="number" value={numDiasPrevios}
                            className="form-control-alternative"
                            id="input-first-name"
                            defaultValue={empresa ? empresa.dias_previos_de_publicacion : null}
                            onChange={handleInputChangeNumDiasPrevios} onBlur={handleInputBlurCantidad}
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
                            Mensaje para Correo
                          </label>
                          <Input 
                            className="form-control-alternative"
                            id="input-first-name"
                            type="textarea"
                            placeholder="Ingrese el mensaje para los correos"
                            defaultValue={empresa ? empresa.mensaje_correo : null}
                            onChange={handleInputChangeMensajeCorreo}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="hr" />
                </Card>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
  
  
  
}

export default Parameter_Form;