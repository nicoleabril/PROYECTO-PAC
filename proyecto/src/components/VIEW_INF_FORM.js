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
    NavLink,
  } from "reactstrap";
  // core components
  import AsyncSelect from 'react-select/async';
  import Select from 'react-select';
  import Axios from 'axios';
  import Cookies from 'js-cookie';
  import { RiArrowGoBackFill } from "react-icons/ri";
  import { FiPlus } from "react-icons/fi";

  const regresar_Inicio = () => {
    window.history.back();
  };

  const View_Inf_Form = ({ onSubmit })=> {
    const token = Cookies.get('authToken');
    const isLoggedIn = token ? true : false;
    const id_infima = localStorage.getItem('idInfima');
    const [errorVisible, setErrorVisible] = useState(false);
    const [proceso, setProceso] = useState([]);
    const [documentosHabilitantes, setDocumentosHabilitantes] = useState([]);
    const [documentosGenerales, setDocumentosGenerales] = useState([]);
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    useEffect(() => {
      const obtenerProceso = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_infima_cuantia/${id_infima}`);
            const proceso = response.data[0];
            setProceso(proceso);

            let tipo_compra = 0;
            if(proceso.tipo_compra === 'SERVICIO' || proceso.tipo_compra === 'OBRA'){
              tipo_compra = 7;
            }
            if(proceso.tipo_compra === 'BIEN'){
              tipo_compra = 6;
            }
            // Obtener documentos
              const documentosResponse = await Axios.get(`http://localhost:5000/obtener_doc_habilitantes/`);
              const documentosData = documentosResponse.data;

              const documentosGeneralesResponse = await Axios.get(`http://localhost:5000/obtener_doc_generales/`);
              const documentosGeneralesData = documentosGeneralesResponse.data;

              const documentosFiltradosData = documentosData.filter(doc => doc.tipo_compra === tipo_compra);
              setDocumentosHabilitantes(documentosFiltradosData.sort((a, b) => a.id_doc - b.id_doc));

              const documentosFiltradosGeneralesData = documentosGeneralesData.filter(doc => doc.tipo_compra === tipo_compra);
              setDocumentosGenerales(documentosFiltradosGeneralesData.sort((a, b) => a.id_doc - b.id_doc));
              
  
          } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
      };

      obtenerProceso();
  }, []);

  return (
      <>
       <Form  >
        <CardHeader className="headerReforma">
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
                  defaultValue={proceso.nombre_direccion}
                  placeholder="Username"
                  type="text"
                  variant="borderless"
                  disabled
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
            <Col md="12">
                <FormGroup>
                    <label
                    className="form-control-label"
                    htmlFor="input-address"
                    >
                    Partida Presupuestaria
                    </label>
                    <Input
                    className="form-control-alternative"
                    id="input-username"
                    defaultValue={proceso.partida_presupuestaria}
                    placeholder="Username"
                    type="text"
                    variant="borderless"
                    disabled
                    />
                </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-city"
                >
                  CPC
                </label>
                <Input
                    className="form-control-alternative"
                    id="input-username"
                    defaultValue={proceso.cpc}
                    placeholder="Username"
                    type="text"
                    variant="borderless"
                    disabled
                    />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <label className="form-control-label" htmlFor="input-country">
                  Tipo Compra
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={proceso.tipo_compra}
                  placeholder="Username"
                  type="text"
                  variant="borderless"
                  disabled
                />
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Objeto de Contratación
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-postal-code"
                  type="textarea"
                  defaultValue={proceso.detalle_producto}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Cantidad
                </label>
                <Input type="number" defaultValue={proceso.cantidad} disabled />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Unidad
                </label>
                <Input type="text" defaultValue={proceso.unidad} disabled />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Costo Unitario
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-postal-code"
                  type="text"
                  defaultValue={(proceso.costo_unitario ? parseFloat(proceso.costo_unitario).toFixed(2) : "") ?? ""}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Total
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-postal-code"
                  type="text"
                  defaultValue={(proceso.total ? parseFloat(proceso.total).toFixed(2) : "") ?? ""}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Responsable
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-postal-code"
                  type="text"
                  defaultValue={proceso.elaborador}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Aprobador
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-postal-code"
                  type="text"
                  defaultValue={proceso.aprobador}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Revisor Compras
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-postal-code"
                  type="text"
                  defaultValue={proceso.revisor_compras}
                  disabled
                />
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Fecha de Inicio de Estado
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={(proceso.fecha_inicio_estado ? new Date(proceso.fecha_inicio_estado).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' }) : "") ?? ""}
                  type="text"
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
        <hr className="hr" />
        <CardHeader className="headerReforma">
            <Row className="align-items-center">
            <Col xs="8">
                <h6 className="titulosReforma sinMargenDerecho">
                    Documentación
                </h6>
            </Col>
          </Row>
        </CardHeader>
        <div className="pl-lg-4">
          <Row>
          {documentosHabilitantes.map((documento, index) => (
            <>
            <Col lg="6">
              <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-username"
                name="area_requirente"
                label="Área Requirente"
              >{documento.nombre_doc}</label>
              </FormGroup>
            </Col>
            <Col lg="6">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-email"
                >
                  archivo
                </label>
              </FormGroup>
            </Col>
            </>
          ))}
          </Row>
          <Row>
            {documentosGenerales.filter((documento, index, self) =>
              index === self.findIndex((d) => (
                d.nombre_doc === documento.nombre_doc
              ))
            ).map((documento, index) => (
              <>
                <Col lg="6" key={index}>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                      name="area_requirente"
                      label="Área Requirente"
                    >
                      {documento.nombre_doc}
                    </label>
                  </FormGroup>
                </Col>
                <Col lg="6" key={index}>
                  <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="input-email"
                    >
                      archivo
                    </label>
                  </FormGroup>
                </Col>
              </>
            ))}
          </Row>
        </div>
        <hr className="hr" />
      </Form>
      </>
    );
}

export default View_Inf_Form;
