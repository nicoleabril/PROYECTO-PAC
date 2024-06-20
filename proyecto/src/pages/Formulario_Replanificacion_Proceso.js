import {
    Row,
    Col,
    Card,
    Radio,
    Table,
    Button,
    Input,
    Space,
    Alert 
  } from "antd"; 
  import {
    TextArea,
    CardHeader,
    CardBody,
  } from "reactstrap";
  import { NavLink, useHistory } from "react-router-dom";
  import Select from 'react-select';
  import React, { useRef, useEffect, useState } from "react";
  import Axios from 'axios';
  import Cookies from 'js-cookie';
  import { Typography, Modal, Form } from 'antd'; 
  import { Container, FormGroup } from 'reactstrap';
  import { ExclamationCircleFilled} from "@ant-design/icons";
  import { RiArrowGoBackFill } from "react-icons/ri";
  import { FaFileCircleCheck ,FaFileCircleXmark  } from "react-icons/fa6";
  const { confirm } = Modal;
  const { Title } = Typography; // Usa Typography de antd para el título

  function Formulario_Replanificacion_Proceso() {
    const [mensaje, setMensaje] = useState('');
    const [proceso, setProceso] = useState([]);
    const [proceso2, setProceso2] = useState([]);
    const history = useHistory();
    const id = localStorage.getItem('idReplanificacion');
    const verBotones = localStorage.getItem('verBotones');
    const user = Cookies.get('usr');
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);

    useEffect(() => {
        const obtenerProceso = async () => {
          try {
              const response = await Axios.get(`http://localhost:5000/obtener_replanificacion/${id}`);
              const proceso = response.data[0];
              const responseProceso = await Axios.get(`http://localhost:5000/obtener_proceso/${proceso.pac_fase_preparatoria_pk}`);
              const proceso2 = responseProceso.data[0];
              setProceso(proceso);
              setProceso2(proceso2);
            } catch (error) {
              console.error('Error al obtener procesos:', error);
          }
        };

        obtenerProceso();
    }, []);

    const regresar_Inicio = () => {
        window.history.back();
    };

    const handleReplanificacion = async (estado) => {

        try {
            await Axios.post('http://localhost:5000/actualizarEstadoReplanificacion/',{
                id_replanificacion: id, 
                estado,
            });
                if(estado === 'APROBADO'){
                    setMensaje('Se ha aprobado la replanificación correctamente.')
                    
                }else{
                    setMensaje('Se ha desaprobado la replanificación correctamente.')
                }
            setSuccessVisible(true);
            setTimeout(() => setSuccessVisible(false), 3000);
            } catch (error) {
            setMensaje('Ocurrió un fallo al cambiar estado de replanificación.')
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 3000);
        }
    };

    const showAprobarConfirm = () => {
        confirm({
          title: '¿Está seguro de aprobar la replanificación?',
          icon: <ExclamationCircleFilled />,
          okText: 'Sí',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            handleReplanificacion('APROBADO');
          },
          onCancel() {
            console.log('No guardar');
          },
        });
    };

    const showDesaprobarConfirm = () => {
        confirm({
          title: '¿Está seguro de no aprobar la replanificación?',
          icon: <ExclamationCircleFilled />,
          okText: 'Sí',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            console.log('que');
            handleReplanificacion('DESAPROBADO');
          },
          onCancel() {
            console.log('No guardar');
          },
        });
    };

    return (
        <>
        <Container className="contenedorTitleTable" fluid>
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: 'fit-content' }}>
              <div className="titleTable">
                <Title level={4} className="titleTable2" >Datos Generales</Title>
                <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                    <Button className="btnCrearProceso" type="primary" title="Regresar" onClick={regresar_Inicio}>
                      <span className="iconWrapper">
                        <RiArrowGoBackFill />
                      </span>
                    </Button>
                    {verBotones === 'verdadero' && (
                        <>
                            <Button className="btnCrearProceso" type="primary" title="Aprobar" onClick={showAprobarConfirm}>
                            <span className="iconWrapper">
                                <FaFileCircleCheck />
                            </span>
                            </Button>
                            <Button className="btnCrearProceso" type="primary" title="No Aprobar" onClick={showDesaprobarConfirm}>
                            <span className="iconWrapper">
                                <FaFileCircleXmark />
                            </span>
                            </Button>
                        </>
                    )}
                </div>
              </div>
              </Card>
            </Col>
          </Row>
        </Container>
        <div  className="contenedorTabla3">
            <Container className="mt--90" fluid>
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
            </Container>
        </div>
        <div className="contenedorTabla3">
            <Container className="mt--90" fluid>
                <Row gutter={[24, 0]}>
                <Col xs={24} xl={24}>
                    <Card bordered={false} className="criclebox tablespace mb-24">
                    <div className="mt--90 contenedorReformas">
                    <Form>
                    <div className="pl-lg-4">
                        <Row>
                            <Col md={24}>
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
                                value={proceso.detalle_producto}
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={12}>
                            <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-username"
                                name="area_requirente"
                                label="Área Requirente"
                            >Procedimiento Sugerido</label>
                                <Input
                                className="form-control-alternative"
                                id="input-username"
                                value={proceso.procedimiento_sugerido}
                                placeholder="Username"
                                type="text"
                                variant="borderless"
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={12}>
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-email"
                                >
                                Total
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-email"
                                placeholder="jesse@example.com"
                                value={'$'+proceso2.total}
                                disabled
                                type="email"
                                />
                            </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                    >
                                    Fecha Entrega Documentos Actual
                                    </label>
                                    <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    value={proceso.fecha_eedhA}
                                    placeholder="Username"
                                    type="text"
                                    variant="borderless"
                                    disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <label
                                    className="form-control-label"
                                    htmlFor="input-address"
                                    >
                                    Fecha Entrega Documentos Nuevo
                                    </label>
                                    <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    value={ proceso.fecha_eedhN}
                                    type="text"
                                    variant="borderless"
                                    disabled
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-city"
                                >
                                Cuatrimestre Actual
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    value={proceso.cuatrimestreA}
                                    placeholder="Username"
                                    type="text"
                                    variant="borderless"
                                    disabled
                                    />
                            </FormGroup>
                            </Col>
                            
                            <Col md={12}>
                            <FormGroup>
                                <label className="form-control-label" htmlFor="input-country">
                                Cuatrimestre Nuevo
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-username"
                                value={proceso.cuatrimestreN}
                                placeholder="Username"
                                type="text"
                                variant="borderless"
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={12}>
                            <FormGroup>
                                <label className="form-control-label" htmlFor="input-country">
                                Fecha Publicación Actual
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-username"
                                value={proceso.fecha_publiA}
                                placeholder="Username"
                                type="text"
                                variant="borderless"
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={12}>
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-country"
                                >
                                Fecha Publicación Nueva
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    value={proceso.fecha_publiN}
                                    placeholder="Username"
                                    type="text"
                                    variant="borderless"
                                    disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={12}>
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-country"
                                >
                                Estado Solicitud
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    value={proceso.estado_solicitud}
                                    placeholder="Username"
                                    type="text"
                                    variant="borderless"
                                    disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={12}>
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-country"
                                >
                                Usuario Solicitante
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    value={proceso.usuario_solicitante}
                                    placeholder="Username"
                                    type="text"
                                    variant="borderless"
                                    disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={24}>
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-country"
                                >
                                Justificación
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-postal-code"
                                type="textarea"
                                value={proceso.justificacion}
                                disabled
                                />
                            </FormGroup>
                            </Col>
                        </Row>
                    </div>
                    </Form>
                    </div>
                    </Card>
                </Col>
                </Row>
            </Container>
        </div>
    </>
    );
    
    
  }
  
  export default Formulario_Replanificacion_Proceso;