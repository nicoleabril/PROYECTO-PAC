import React, { Component, useState, useEffect } from "react";
import { Alert, Form, Modal } from 'antd';
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
  import { RiArrowGoBackFill } from "react-icons/ri";
  import { ExclamationCircleFilled } from "@ant-design/icons";
  import { isEqual } from 'lodash';
  import { HiDocumentPlus,HiDocumentMinus,HiDocumentCheck,HiDocumentMagnifyingGlass, HiDocumentArrowUp  } from "react-icons/hi2";
  const { confirm } = Modal;

  const View_Reform = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [form] = Form.useForm();
  const user = Cookies.get('usr');
  const [procesoActual, setProcesoActual] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [reformaActual, setReformaActual] = useState([]);
  const fechaActual = new Date();
  const idParaEditar = localStorage.getItem('id');
  const tabla = localStorage.getItem('tabla');
  const proceso = localStorage.getItem('proceso');

  const [reformaClase, setReformaClase] = useState("");

  const obtenerReforma = async () => {
    try {
      const response = await Axios.get(`http://localhost:5000/obtener_reforma/${idParaEditar}`);
      const reforma_temp = response.data[0];
      let version_proceso = reforma_temp.version_proceso;
      if(reforma_temp.tipo_reforma === 'Modificacion'){
        version_proceso = version_proceso - 1;
      }
      const id_Proceso = reforma_temp.id_proceso+'-'+(version_proceso);
      setReformaActual(reforma_temp);
      return id_Proceso;
    } catch (error) {
      console.error('Error al obtener procesos:', error);
    }
  };

  const obtenerProceso = async (id_Proceso) => {
    try {
      const  response_P = await Axios.get(`http://localhost:5000/obtener_proceso/${id_Proceso}`);
      setProcesoActual(response_P.data[0]);
    } catch (error) {
      console.error('Error al obtener procesos:', error);
    }
  };

  const regresar_Inicio = () => {
    window.history.back();
  };



const handleSubmit = (e) => {
  e.preventDefault();
  // Llamada a obtenerReforma() y manejo de la promesa
  obtenerReforma().then(id_Proceso => {
    console.log(id_Proceso); // Imprime el valor obtenido de la promesa
    obtenerProceso(id_Proceso); // Llamada a obtenerProceso() con el valor obtenido
  });
};

const consolidarReforma = async () => {
    try {
      const response = await Axios.post(`http://localhost:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_consolidador', estadoNuevo:'Finalizado', secuencial_reforma:idParaEditar});
      const response2 = await Axios.post(`http://localhost:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_autorizador', estadoNuevo:'Iniciado', secuencial_reforma:idParaEditar});
      console.log('Respuesta del servidor:', response.data);
      setMensaje("Reforma consolidada correctamente")
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
    } catch (error) {
      setMensaje("Ocurrió un problema al consolidar la reforma")
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
      console.error('Error al cambiar estado de Reforma:', error);
    }
}

const mandarReformaAAprobar = async () => {
    try {
      const response = await Axios.post(`http://localhost:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_consolidador', estadoNuevo:'Pendiente', secuencial_reforma:idParaEditar});
      const response2 = await Axios.post(`http://localhost:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_aprobador', estadoNuevo:'Iniciado', secuencial_reforma:idParaEditar});
      console.log('Respuesta del servidor:', response.data);
      setMensaje("Reforma colocada en aprobación correctamente")
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
    } catch (error) {
      setMensaje("Ocurrió un problema al colocar la reforma en aprobación")
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
      console.error('Error al cambiar estado de Reforma:', error);
    } 
}


const showAprobacionConfirm = () => {
    confirm({
      title: '¿Está seguro de mandar esta reforma a aprobación?',
      icon: <ExclamationCircleFilled />,
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        mandarReformaAAprobar();
      },
      onCancel() {
        console.log('No borrar usuario');
      },
    });
};

const showConsolidarConfirm = () => {
    confirm({
      title: '¿Está seguro de consolidar esta reforma?',
      icon: <ExclamationCircleFilled />,
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        consolidarReforma();
      },
      onCancel() {
        console.log('No borrar usuario');
      },
    });
};

const autorizarTodo = async () => {
  try {
    const response_data = await Axios.post(`http://localhost:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_autorizador', estadoNuevo:'Autorizado', secuencial_reforma:idParaEditar});
    setMensaje("Reforma autorizada correctamente")
    setSuccessVisible(true);
    setTimeout(() => setSuccessVisible(false), 3000);
  } catch (error) {
    setMensaje("Ocurrió un problema al autorizar las reformas")
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
    console.error('Error al cambiar estado de Reforma:', error);
  } 
}

const showAutorizarConfirm = () => {
    confirm({
      title: '¿Está seguro de autorizar la reforma?',
      icon: <ExclamationCircleFilled />,
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        autorizarTodo();
      },
      onCancel() {
        console.log('No borrar usuario');
      },
    });
};




useEffect(() => {
  if (reformaActual) {
    switch (reformaActual.tipo_reforma) {
      case 'Inclusion':
        setReformaClase("bordeVerde");
        break;
      case 'Modificacion':
        const cambios = {};
        Object.keys(reformaActual).forEach(key => {
          if (!isEqual(reformaActual[key], procesoActual[key])) {
            cambios[key] = true;
          }
        });
        setReformaClase(cambios);
        break;
      case 'Eliminacion':
        setReformaClase("textoTachado");
        break;
      default:
        setReformaClase("");
        break;
    }
  }
}, [reformaActual, procesoActual]);


  return (
      <>
      {/* Alerta de error */}
      {errorVisible && (
        <Alert
          message={mensaje}
          type="error"
          showIcon
          closable
          onClose={() => setErrorVisible(false)}
        />
      )}

      {/* Alerta de éxito */}
      {successVisible && (
        <Alert
          message={mensaje}
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
                Ver Cambios
              </Button>
              {proceso === 'consolidar' && (
                <>
                  <Button className="btnRegresar" type="primary" title="Solicitar Aprobación" onClick={showAprobacionConfirm}>
                      <span className="iconWrapper">
                        <HiDocumentMagnifyingGlass />
                      </span>
                  </Button>
                  <Button className="btnRegresar" type="primary" title="Consolidar Reforma" onClick={showConsolidarConfirm}>
                      <span className="iconWrapper">
                        <HiDocumentCheck />
                      </span>
                  </Button>
                </>
              )}
              {proceso === 'autorizar' && (
                <Button className="btnRegresar" type="primary" title="Autorizar Reforma" onClick={showAutorizarConfirm}>
                  <span className="iconWrapper">
                    <HiDocumentArrowUp />
                  </span>
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </CardHeader>
      </Form>
        {/* Address */}
        <Row >
        <Col lg={6}>
            <h6 className="titulosReforma sinMargenDerecho">
              Datos Actuales
            </h6>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-address"
                >
                  Partida Presupuestaria
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.partida_presupuestaria : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-city"
                >
                  CPC
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.cpc : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Régimen
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.tipo_regimen : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Compra
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.tipo_compra : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Procedimiento Sugerido
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.procedimiento_sugerido : null}
                    disabled
                    
                    
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Producto
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.tipo_producto : null}
                    disabled
                >
                </Input>
            </FormGroup>
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
                  defaultValue={
                    tabla === "reformas" && procesoActual ? procesoActual.descripcion :
                    tabla === "procesos" && procesoActual ? procesoActual.detalle_producto :
                    null
                  }
                  disabled
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Cantidad
                </label>
                <Input 
                    defaultValue={
                      tabla === "reformas" && procesoActual ? procesoActual.cantidad :
                      tabla === "procesos" && procesoActual ? procesoActual.cantidad_anual :
                      null
                    }
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Unidad
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.unidad : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Costo Unitario
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.costo_unitario : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Total
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.total : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Cuatrimestre&nbsp;
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.cuatrimestre : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Fecha de Entrega de Documentos Habilitantes
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.fecha_eedh : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Fecha Estimada de Publicación
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.fecha_est_public : null}
                    disabled
                >
                </Input>
            </FormGroup>
          </Col>
          <Col lg={6}>
            <h6 className="titulosReforma sinMargenDerecho">
              Cambios Realizados
            </h6>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-address"
                >
                  Partida Presupuestaria
                </label>
                <Input   className={`${reformaClase} ${reformaClase.partida_presupuestaria ? "bordeRojo" : ""}`}
                   defaultValue={reformaActual ? reformaActual.partida_presupuestaria : null}
                   disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-city"
                >
                  CPC
                </label>
                <Input className={`${reformaClase} ${reformaClase.cpc ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.cpc : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Régimen
                </label>
                <Input  className={`${reformaClase} ${reformaClase.tipo_regimen ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.tipo_regimen : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Compra
                </label>
                <Input  className={`${reformaClase} ${reformaClase.tipo_compra ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.tipo_compra : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup >
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Procedimiento Sugerido
                </label>
                <Input  className={`${reformaClase} ${reformaClase.procedimiento_sugerido ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.procedimiento_sugerido : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Producto
                </label>
                <Input  className={`${reformaClase} ${reformaClase.tipo_producto ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.tipo_producto : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Objeto de Contratación
                </label>
                <Input    className={`form-control-label ${reformaClase} ${reformaClase.descripcion ? "bordeRojo" : ""}`}
                  id="input-postal-code"
                  type="textarea"
                  defaultValue={
                    reformaActual ? reformaActual.descripcion : null
                  }
                  disabled
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Cantidad
                </label>
                <Input  className={`${reformaClase} ${reformaClase.cantidad ? "bordeRojo" : ""}`}
                    defaultValue={
                        reformaActual ? reformaActual.cantidad :null
                    }
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Unidad
                </label>
                <Input  className={`${reformaClase} ${reformaClase.unidad ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.unidad : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Costo Unitario
                </label>
                <Input  className={`${reformaClase} ${reformaClase.costo_unitario ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.costo_unitario : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Total
                </label>
                <Input  className={`${reformaClase} ${reformaClase.total ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.total : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Cuatrimestre&nbsp;
                </label>
                <Input  className={`${reformaClase} ${reformaClase.cuatrimestre ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.cuatrimestre : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Fecha de Entrega de Documentos Habilitantes
                </label>
                <Input className={`${reformaClase} ${reformaClase.fecha_eedh ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.fecha_eedh : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Fecha Estimada de Publicación
                </label>
                <Input  className={`${reformaClase} ${reformaClase.fecha_est_public ? "bordeRojo" : ""}`}
                    defaultValue={reformaActual ? reformaActual.fecha_est_public : null}
                    disabled
                >
                </Input>
            </FormGroup>
          </Col>
        </Row>
      </>
    );
}

export default View_Reform;