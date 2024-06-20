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
  import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleFilled} from "@ant-design/icons";
  import Highlighter from 'react-highlight-words';
  import { RiArrowGoBackFill } from "react-icons/ri";
  import { FaFileImport,FaFileArrowUp } from "react-icons/fa6";
  const { confirm } = Modal;
  const { Title } = Typography; // Usa Typography de antd para el título

  function Replanificar_Procesos() {
    const [mensaje, setMensaje] = useState('');
    const [justificacion, setJustificacion] = useState('');
    const [proceso, setProceso] = useState([]);
    const history = useHistory();
    const id = localStorage.getItem('id');
    const user = Cookies.get('usr');
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [cuatrimestre, setCuatrimestre] = useState('');
    const [fechaPublicacion, setFechaPublicacion] = useState('');
    const [fechaDocumentos, setFechaDocumentos] = useState('');
    const [empresa, setEmpresa] = useState([]);

    useEffect(() => {
        const obtenerProceso = async () => {
          try {
              const response = await Axios.get(`http://localhost:5000/obtener_proceso/${id}`);
              const proceso = response.data[0];
              setProceso(proceso);
            } catch (error) {
              console.error('Error al obtener procesos:', error);
          }
        };

        const obtenerEmpresa = async () => {
            const username = Cookies.get('usr');
            try {
                const response = await Axios.get(`http://localhost:5000/obtenerEmpresa/`);
                setEmpresa(response.data[0]);
            } catch (error) {
                console.error('Error al obtener información de empresa', error);
            }
          };

        obtenerEmpresa();
        obtenerProceso();
    }, []);

    const regresar_Inicio = () => {
        window.history.back();
    };

    const handleInputChangJusti = (e) => {
        setJustificacion(e.target.value);
      };

    const handleReplanificacion = async () => {
        if(justificacion.trim()==='' || fechaPublicacion==='' ){
            setMensaje('Por favor, ingrese todos los datos.')
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 3000);
        }else{
          if(proceso.cuatrimestre === cuatrimestre){
            try {
              await Axios.post('http://localhost:5000/registrarReplanificacion/',{
                procedimiento_sugerido: proceso.procedimiento_sugerido,
                tipo_compra: proceso.tipo_compra,
                detalle_producto: proceso.detalle_producto,
                fecha_eedhA: proceso.fecha_eedh,
                cuatrimestreA: proceso.cuatrimestre,
                fecha_publiA: proceso.fecha_est_public,
                fecha_eedhN: fechaDocumentos,
                cuatrimestreN: cuatrimestre,
                fecha_publiN: fechaPublicacion,
                justificacion,
                estado_solicitud: 'PENDIENTE',
                usuario_solicitante: user,
                pac_fase_preparatoria_pk: id,
            });
              setMensaje('Se ha registrado la replanificación correctamente.')
              setSuccessVisible(true);
              setTimeout(() => setSuccessVisible(false), 3000);
            } catch (error) {
              setMensaje('Ocurrió un fallo al registrar la replanificación.')
              setErrorVisible(true);
              setTimeout(() => setErrorVisible(false), 3000);
            }
          }else{
            setMensaje('La nueva fecha de publicación debe pertenecer al cuatrimestre actual.')
              setErrorVisible(true);
              setTimeout(() => setErrorVisible(false), 3000);
          }
        }
      };

    const showGuardarConfirm = () => {
        confirm({
          title: '¿Está seguro de replanificar el proceso?',
          icon: <ExclamationCircleFilled />,
          okText: 'Sí',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            console.log('que');
            handleReplanificacion();
          },
          onCancel() {
            console.log('No guardar');
          },
        });
    };

    const handleChangeFechaPublicacion = (event) => {
        setFechaPublicacion(event.target.value);
      
        const cuatrimestre = determinarCuatrimestre(event.target.value);
        setCuatrimestre(cuatrimestre);
      
        const fecha = obtenerFechaDocumentosHabilitantes(event.target.value);
        setFechaDocumentos(fecha);
      
      };
      
      const determinarCuatrimestre = (selectedDate) => {
        const month = new Date(selectedDate).getMonth() + 1;
        const cuatrimestreActual = Math.ceil(month / 3);
      
        switch (cuatrimestreActual) {
          case 1:
            return 'C1';
          case 2:
            return 'C2';
          case 3:
            return 'C3';
          case 4:
            return 'C4';
          default:
            return '';
        }
      };
      
      const obtenerFechaDocumentosHabilitantes = (selectedDate) => {
        const fechaSeleccionada = new Date(selectedDate);
        const anioOriginal = fechaSeleccionada.getFullYear();
        const mesOriginal = fechaSeleccionada.getMonth();
        fechaSeleccionada.setDate(fechaSeleccionada.getDate() - empresa.dias_previos_de_publicacion);
        const anioModificado = fechaSeleccionada.getFullYear();
      
        // Verificar si la fecha resultante está en el mismo año
        if (anioModificado !== anioOriginal && mesOriginal===0) {
            // Establecer la fecha al 1 de enero del mismo año
            fechaSeleccionada.setFullYear(anioOriginal);
            fechaSeleccionada.setMonth(mesOriginal); // 0 representa enero
            fechaSeleccionada.setDate(0);
        }
      
        // Formatear la fecha restada como YYYY-MM-DD
        const fechaRestada = fechaSeleccionada.toISOString().split('T')[0];
        return fechaRestada;
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
                </div>
              </div>
              </Card>
            </Col>
          </Row>
        </Container>
        <div></div>
        <div className="contenedorTabla3">
            <Container className="mt--90" fluid>
                <Row gutter={[24, 0]}>
                <Col xs={24} xl={24}>
                    <Card bordered={false} className="criclebox tablespace mb-24">
                    <div className="mt--90 contenedorReformas">
                    <Form>
                    <div className="pl-lg-4">
                        <Row>
                            <Col md={12}>
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
                                value={proceso.direccion}
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
                                Año
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-email"
                                placeholder="jesse@example.com"
                                value={proceso.año}
                                disabled
                                type="email"
                                />
                            </FormGroup>
                            </Col>
                            <Col md={24}>
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
                                    value={proceso.partida_presupuestaria}
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
                                    Código Proceso
                                    </label>
                                    <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    value={ proceso.codigo_proceso}
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
                                CPC
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    value={proceso.cpc}
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
                                Tipo Régimen
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-username"
                                value={proceso.tipo_regimen}
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
                                Tipo Compra
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-username"
                                value={proceso.tipo_compra}
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
                                Procedimiento Sugerido
                                </label>
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
                                htmlFor="input-country"
                                >
                                Tipo Producto
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    value={proceso.tipo_producto}
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
                            <Col md={8}>
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-country"
                                >
                                Cantidad
                                </label>
                                <Input className="form-control-alternative"
                                id="input-postal-code" type="number" value={proceso.cantidad_anual} disabled  variant="borderless"/>
                            </FormGroup>
                            </Col>
                            <Col md={8}>
                            <FormGroup>
                                <label
                                className="form-control-label"
                                htmlFor="input-country"
                                >
                                Unidad
                                </label>
                                <Input className="form-control-alternative"
                                id="input-postal-code" type="text" value={proceso.unidad} disabled variant="borderless"/>
                            </FormGroup>
                            </Col>
                            <Col md={8}>
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
                                value={proceso.funcionario_responsable}
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={8}>
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
                                value={proceso.revisor_compras}
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={8}>
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
                                value={proceso.revisor_juridico}
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={8}>
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
                                value={(proceso.costo_unitario ? parseFloat(proceso.costo_unitario).toFixed(2) : "") ?? ""}
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
                                Total
                                </label>
                                <Input
                                className="form-control-alternative"
                                id="input-postal-code"
                                type="text"
                                value={(proceso.total ? parseFloat(proceso.total).toFixed(2) : "") ?? ""}
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={8}>
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
                                value={proceso.cuatrimestre}
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={8}>
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
                                value={(proceso.fecha_eedh ? new Date(proceso.fecha_eedh).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' }) : "") ?? ""}
                                type="text"
                                disabled
                                />
                            </FormGroup>
                            </Col>
                            <Col md={8}>
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
                                value={(proceso.fecha_est_public ? new Date(proceso.fecha_est_public).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' }) : "") ?? ""}
                                type="text"
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
        <Container className="contenedorTitleTable" fluid>
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: 'fit-content' }}>
              <div className="titleTable">
                <Title level={4} className="titleTable2" >Formulario Solicitud Cambio Fecha</Title>
                <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                  <Button
                    className="btnCrearProceso"
                    color="primary"
                    onClick={showGuardarConfirm}
                    size="sm"
                    type="primary"
                  >
                    Guardar
                  </Button>
                </div>
              </div>
              </Card>
            </Col>
          </Row>
        </Container>
        <div  className="contenedorTabla3"><Container className="mt--90" fluid>
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
        </Container></div>
        <div
          className="contenedorTabla3"
        >
            <Container className="mt--90" fluid>
                <Row gutter={[24, 0]}>
                <Col xs={24} xl={24}>
                    <Card bordered={false} className="criclebox tablespace mb-24">
                    <div className="mt--90 contenedorReformas">
                    <div className="pl-lg-4">
                        <Row>
                        <Col md={12}>
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-username">Fecha Publicación Actual</label>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                disabled
                                type="text"
                                value={
                                    proceso.fecha_est_public
                                    ? new Date(proceso.fecha_est_public).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                        })
                                    : ''
                                }
                            />
                            </FormGroup>
                        </Col>
                        <Col md={12}>
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-username">Fecha Publicación Nuevo</label>
                            <Input type="date" value={fechaPublicacion} onChange={handleChangeFechaPublicacion}></Input>
                            </FormGroup>
                        </Col>
                        </Row>
                        <Row>
                        <Col md={12}>
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-username">Fecha Entrega Documentos Actual</label>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                disabled
                                type="text"
                                value={
                                    proceso.fecha_eedh
                                    ? new Date(proceso.fecha_eedh).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                        })
                                    : ''
                                }
                            />
                            </FormGroup>
                        </Col>
                        <Col md={12}>
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-username">Fecha Entrega Documentos Nuevo</label>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                value={fechaDocumentos}
                                disabled
                                type="date"
                            />
                            </FormGroup>
                        </Col>
                        </Row>
                        <Row>
                        <Col md={12}>
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-username">Cuatrimestre Actual</label>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                disabled
                                type="text"
                                value={proceso.cuatrimestre}
                            />
                            </FormGroup>
                        </Col>
                        <Col md={12}>
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-username">Cuatrimestre Nuevo</label>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                disabled
                                type="text"
                                value={cuatrimestre}
                            />
                            </FormGroup>
                        </Col>
                        </Row>
                        <Row>
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
                                placeholder="Ingrese justificación..."
                                type="textarea"
                                value={justificacion}
                                onChange={handleInputChangJusti}
                                style={{ height: '75px', resize: 'vertical' }}
                                />
                            </FormGroup>
                        </Col>
                        </Row>
                    </div>
                    </div>
                    </Card>
                </Col>
                </Row>
            </Container>
        </div>
       
    </>
    );
    
    
  }
  
  export default Replanificar_Procesos;