import React, { Component, useState, useEffect } from "react";
import { Alert, Form, Image} from 'antd';
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

const Company_Form = ({ onSubmit })=> {
    const [cargarImagen, setCargarImagen] = useState([]);
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [form] = Form.useForm();
    const user = Cookies.get('usr');
    const [imagen, setImagen] = useState([]);
    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const [rucEmpresa, setRucEmpresa] = useState('');
    const [empresa, setEmpresa] = useState([]);
    const regresar_Inicio = () => {
        window.history.back();
    };

    const handleImagenChange = (event) => {
        const imagenSeleccionada = event.target.files[0];
        // Aquí podrías guardar la imagen en el estado o en una variable antes de subirla al servidor
        setCargarImagen(imagenSeleccionada);
        setImagen(URL.createObjectURL(imagenSeleccionada));
    };

    function separarNombreYExtension(nombreImagen) {
      const partesNombreImagen = nombreImagen.split('.');
      const nombre = partesNombreImagen.slice(0, -1).join('.'); // Unir las partes del nombre (por si el nombre contiene puntos)
      const extension = partesNombreImagen[partesNombreImagen.length - 1]; // Obtener la última parte como extensión
  
      return extension;
  }

    useEffect(() => {
      const obtenerEmpresa = async () => {
        const username = Cookies.get('usr');
        try {
            const response = await Axios.get(`http://localhost:5000/obtenerEmpresa/`);
            setEmpresa(response.data[0]);
            if(response.data[0]){
              console.log(response.data[0]);
              setNombreEmpresa(response.data[0].nombre_empresa);
              setRucEmpresa(response.data[0].ruc_empresa);
              const extension = separarNombreYExtension(response.data[0].logo_empresa);
              const blob = new Blob([new Uint8Array(response.data[0].imagen_empresa.data)], { type: 'image/'+extension });
              const url = URL.createObjectURL(blob);
              setCargarImagen(blob);
              setImagen(url);
            }
        } catch (error) {
            console.error('Error al obtener información de empresa', error);
        }
      };
      obtenerEmpresa();
    }, []);


    const definirRutaImagen = () => {
      if(cargarImagen.name){
        return cargarImagen.name;
      }else{
        return empresa.logo_empresa;
      }
    }

    const handleSubmitGuardar = async (e) => {
      e.preventDefault();
      if(nombreEmpresa.trim() === '' || rucEmpresa.trim() === '' ||  imagen === null){
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
      }else{
        const logo_empresa = definirRutaImagen();
        if(empresa){
          try {
            const response = await Axios.post(`http://localhost:5000/actualizarEmpresa/`, {nombre_empresa: nombreEmpresa, ruc_empresa:rucEmpresa, logo_empresa, imagen_empresa: cargarImagen}, 
             {headers: {
                'Content-Type': 'multipart/form-data'
              }});
            console.log('Respuesta del servidor:', response.data);
          } catch (error) {
              console.error('Error al guardar información de empresa', error);
          }
        }else{
          try {
            const response = await Axios.post(`http://localhost:5000/guardarEmpresa/`, {nombre_empresa: nombreEmpresa, ruc_empresa:rucEmpresa, logo_empresa, imagen_empresa: cargarImagen}, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }});
            console.log('Respuesta del servidor:', response.data);
          } catch (error) {
              console.error('Error al guardar información de empresa', error);
          }
        }
        //copiarImagen();
        setSuccessVisible(true);
        setTimeout(() => {
          setSuccessVisible(false);
          window.location.reload();
        }, 1000);
      }
    }

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
                            Datos Generales
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
                        >Logo de la Empresa</label><br/><br/>
                          {imagen ? (
                              <Image
                                  src={(imagen)}
                                  alt="Imagen de la empresa"
                                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                              />
                          ) : (
                                  <div className="imagen-placeholder">
                                      <BiSolidBusiness className="icon" />
                                  </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Elegir logo
                          </label>
                          <Input type="file" id="imagen" onChange={handleImagenChange} accept="image/*"/>
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
                            Nombre de la Empresa
                          </label>
                          <Input 
                            className="form-control-alternative"
                            id="input-first-name"
                            type="text"
                            placeholder="Ingrese el nombre de su empresa"
                            defaultValue={empresa ? empresa.nombre_empresa : null}
                            onChange={(e) => setNombreEmpresa(e.target.value)}
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
                            RUC de la Empresa
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            type="text"
                            placeholder="Ingrese el RUC de su empresa"
                            onChange={(e) => setRucEmpresa(e.target.value)}
                            defaultValue={empresa ? empresa.ruc_empresa : null}
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

export default Company_Form;