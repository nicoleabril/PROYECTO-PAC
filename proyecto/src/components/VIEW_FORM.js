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
  import { Modal } from 'antd'; 
  import { RiArrowGoBackFill } from "react-icons/ri";
  import { FiPlus } from "react-icons/fi";
  import { ExclamationCircleFilled} from "@ant-design/icons";
  import { FaFileCircleMinus } from "react-icons/fa6";
  const { confirm } = Modal;

  const regresar_Inicio = () => {
    window.history.back();
  };

  const View_Form = ({ onSubmit })=> {
    const token = Cookies.get('authToken');
    const isLoggedIn = token ? true : false;
    const id = localStorage.getItem('id');
    const tabla = localStorage.getItem('tabla');
    const [mensaje, setMensaje] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [proceso, setProceso] = useState([]);
    const [documentosHabilitantes, setDocumentosHabilitantes] = useState([]);
    const [documentosGenerales, setDocumentosGenerales] = useState([]);
    const normalizeString = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    useEffect(() => {
      const obtenerProceso = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_proceso/${id}`);
            const proceso = response.data[0];
            setProceso(proceso);
            // Obtener documentos
              const documentosResponse = await Axios.get(`http://localhost:5000/obtener_doc_habilitantes/`);
              const documentosData = documentosResponse.data;

              // Obtener tipos de compra
              const tipoCompraResponse = await Axios.get(`http://localhost:5000/obtener_doc_tipo_compra/`);
              const tipoCompraData = tipoCompraResponse.data;

              const documentosGeneralesResponse = await Axios.get(`http://localhost:5000/obtener_doc_generales/`);
              const documentosGeneralesData = documentosGeneralesResponse.data;

              if(proceso.catalogo_electronico === 'NO'){
                const defaultV = tipoCompraData.find(doc => 
                  normalizeString(doc.nombre_tipo_compra.toLowerCase()) === 
                  normalizeString(proceso.tipo_compra.toLowerCase()));
  
                const documentosFiltradosData = documentosData.filter(doc => doc.tipo_compra === defaultV.id_tipo_compra);
                setDocumentosHabilitantes(documentosFiltradosData.sort((a, b) => a.id_doc - b.id_doc));

                const documentosFiltradosGeneralesData = documentosGeneralesData.filter(doc => doc.tipo_proceso === 1);
                setDocumentosGenerales(documentosFiltradosGeneralesData.sort((a, b) => a.id_doc - b.id_doc));
              }else{
                const documentosFiltradosData = documentosData.filter(doc => doc.tipo_proceso === 2);
                setDocumentosHabilitantes(documentosFiltradosData.sort((a, b) => a.id_doc - b.id_doc));

                const documentosFiltradosGeneralesData = documentosGeneralesData.filter(doc => doc.tipo_proceso === 2);
                setDocumentosGenerales(documentosFiltradosGeneralesData.sort((a, b) => a.id_doc - b.id_doc));
              }
  
          } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
      };

      obtenerProceso();
  }, []);

    useEffect(() => {
        const obtenerProceso = async () => {
          if(tabla==='procesos'){
            try {
              const response = await Axios.get(`http://localhost:5000/obtener_proceso/${id}`);
              setProceso(response.data[0]);
            } catch (error) {
              console.error('Error al obtener procesos:', error);
            }
          } 
          if(tabla==='reformas'){
            try {
              const response = await Axios.get(`http://localhost:5000/obtener_reforma/${id}`);
              setProceso(response.data[0]);
            } catch (error) {
              console.error('Error al obtener procesos:', error);
            }
          }
        };
      
      if (!isLoggedIn) {
        return <NavLink to="/" />;
      }
  
      obtenerProceso();
    }, [id, isLoggedIn]);


    const handleDesierto = async () => {
      try {
        await Axios.post('http://localhost:5000/cambiar_fase_preparatoria/',{
        estadoNuevo: 'PUBLICADO - DESIERTO', 
        pac_fase_preparatoria_pk:proceso.pac_fase_preparatoria_pk });
        setMensaje('Se ha colocado proceso desierto correctamente.')
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 3000);
      } catch (error) {
        setMensaje('Ocurrió un fallo al colocar desierto.')
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
        console.error('Error al requerir reforma:', error);
      }
    };

    const showDesiertoConfirm = () => {
      confirm({
        title: '¿Está seguro de colocar proceso desierto?',
        icon: <ExclamationCircleFilled />,
        okText: 'Sí',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          handleDesierto();
          //handleSubmitGuardar();
        },
        onCancel() {
          console.log('No guardar');
        },
      });
    };


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
                  {proceso.estado_fase_preparatoria === 'PUBLICADO' &&  tabla === 'procesos' &&(
                        <>
                            <Button className="btnCrearProceso" type="primary" title="Colocar Desierto" onClick={showDesiertoConfirm}>
                            <span className="iconWrapper">
                                <FaFileCircleMinus />
                            </span>
                            </Button>
                        </>
                    )}
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
                  defaultValue={tabla === "reformas" ? proceso.area_requirente : proceso.direccion}
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
                  defaultValue={tabla === "reformas" ? proceso.anio : proceso.año}
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
                    htmlFor="input-address"
                    >
                    Código Proceso
                    </label>
                    <Input
                    className="form-control-alternative"
                    id="input-username"
                    defaultValue={tabla === "reformas" ? ' ' : proceso.codigo_proceso}
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
                  Tipo Régimen
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={proceso.tipo_regimen}
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
         
            <Col md="6">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Procedimiento Sugerido
                </label>
                <Input
                    className="form-control-alternative"
                    id="input-username"
                    defaultValue={proceso.procedimiento_sugerido}
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
                  htmlFor="input-country"
                >
                  Tipo Producto
                </label>
                <Input
                    className="form-control-alternative"
                    id="input-username"
                    defaultValue={proceso.tipo_producto}
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
                  defaultValue={tabla === "reformas" ? proceso.descripcion : proceso.detalle_producto}
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
                  Cantidad
                </label>
                <Input type="number" defaultValue={tabla === "reformas" ? proceso.cantidad : proceso.cantidad_anual} disabled />
              </FormGroup>
            </Col>
            <Col md="4">
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
                  defaultValue={tabla === "reformas" ? proceso.usr_creacion : proceso.funcionario_responsable}
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
            <Col md="4">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Revisor Jurídico
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-postal-code"
                  type="text"
                  defaultValue={proceso.revisor_juridico}
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
            <Col md="12">
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
                  Cuatrimestre&nbsp;
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-postal-code"
                  type="text"
                  defaultValue={proceso.cuatrimestre}
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
                  Fecha de Entrega de Documentos Habilitantes
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={(proceso.fecha_eedh ? new Date(proceso.fecha_eedh).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' }) : "") ?? ""}
                  type="text"
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
                  Fecha Estimada de Publicación
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={(proceso.fecha_est_public ? new Date(proceso.fecha_est_public).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' }) : "") ?? ""}
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

export default View_Form;
