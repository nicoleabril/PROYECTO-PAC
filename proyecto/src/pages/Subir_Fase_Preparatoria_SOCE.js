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
  import React, { useRef, useEffect, useState } from "react";
  import Axios from 'axios';
  import Cookies from 'js-cookie';
  import { Typography, Modal, Form } from 'antd'; 
  import { Container, FormGroup } from 'reactstrap';
  import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleFilled} from "@ant-design/icons";
  import Highlighter from 'react-highlight-words';
  import { RiArrowGoBackFill } from "react-icons/ri";
  import { FaFileImport,FaFileArrowUp } from "react-icons/fa6";

  import { HiDocumentPlus,HiDocumentMinus,HiDocumentCheck,HiDocumentMagnifyingGlass, HiDocumentArrowUp   } from "react-icons/hi2";
  
  const { confirm } = Modal;
  const { Title } = Typography; // Usa Typography de antd para el título
  
  function Subir_SOCE() {
    const [mensaje, setMensaje] = useState('');
    const [comentario, setComentario] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [subidaCompletada, setSubidaCompletada] = useState(false);
    const [archivos, setArchivos] = useState({});
    const [proceso, setProceso] = useState([]);
    const [presupuesto, setPresupuesto] = useState([]);
    const [archivosEncontrados, setArchivosEncontrados] = useState([]);
    const [documentosHabilitantes, setDocumentosHabilitantes] = useState([]);
    const [documentosCargados, setDocumentosCargados] = useState([]);
    const [form] = Form.useForm();
    const history = useHistory();
    const idSoce = localStorage.getItem('idSoce');
    const fase = localStorage.getItem('fase');
    const username = Cookies.get('usr');
    const fileInputs = useRef([]);
    const [estudioDeMercadoPresente, setEstudioMercado] = useState(false);
  const regresar_Inicio = () => {
    window.history.back();
  };

  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleFileChange = (nombreDoc, event) => {
    const nuevoArchivo = event.target.files[0];
    setArchivos(prevState => ({
      ...prevState,
      [nombreDoc]: nuevoArchivo
    }));

    // Actualiza la lista de documentos cargados
    if (!documentosCargados.includes(nombreDoc)) {
      setDocumentosCargados(prevState => [...prevState, nombreDoc]);
    }
  };
  
  useEffect(() => {
      const obtenerProceso = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_proceso/${idSoce}`);
            const proceso = response.data[0];
            setProceso(proceso);
            // Obtener documentos
            if(fase === 'Documentos Preparatorios' || fase === 'Expediente Preparatorio'){
              const documentosResponse = await Axios.get(`http://localhost:5000/obtener_doc_habilitantes/`);
              const documentosData = documentosResponse.data;

              // Obtener tipos de compra
              const tipoCompraResponse = await Axios.get(`http://localhost:5000/obtener_doc_tipo_compra/`);
              const tipoCompraData = tipoCompraResponse.data;

              const defaultV = tipoCompraData.find(doc => 
                normalizeString(doc.nombre_tipo_compra.toLowerCase()) === 
                normalizeString(proceso.tipo_compra.toLowerCase())
              );
              const documentosFiltradosData = documentosData.filter(doc => doc.tipo_compra === defaultV.id_tipo_compra);
              setDocumentosHabilitantes(documentosFiltradosData.sort((a, b) => a.id_doc - b.id_doc));
            }else{
              const documentosResponse = await Axios.get(`http://localhost:5000/obtener_doc_generales/`);
              const documentosData = documentosResponse.data;
              if(fase === 'Resolución de Inicio'){
                const documentosFiltradosData = documentosData.filter(doc => doc.fase_preparatoria === fase && doc.tipo_proceso === 1 && doc.tipo_compra===null);
                setDocumentosHabilitantes(documentosFiltradosData.sort((a, b) => a.id_doc - b.id_doc));
              }else{
                const documentosFiltradosData = documentosData.filter(doc => doc.fase_preparatoria === fase  && doc.tipo_compra===null);
                setDocumentosHabilitantes(documentosFiltradosData.sort((a, b) => a.id_doc - b.id_doc));
              }
            }
          } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
      };

      obtenerProceso();
  }, []);


  useEffect(() => {
    const obtenerArchivos = async () => {
      try {
        const idSoce = localStorage.getItem('idSoce');
        const responseProceso = await Axios.get(`http://localhost:5000/obtener_proceso/${idSoce}`);
        const proceso = responseProceso.data[0];
        setProceso(proceso);
        const response = await Axios.get(`http://localhost:5000/procesos/${proceso.pac_fase_preparatoria_pk}`);
        const archivos = response.data;
        setArchivosEncontrados(archivos);
        // Verificar que hay archivos
        if (archivos.length !== 0) {
          for (let i = 0; i < archivos.length; i++) {
            const archivo = archivos[i];
            const nombreArchivoSinExtension = archivo.replace('.pdf', ''); // Eliminar la extensión ".pdf"
            const nombreArchivoNormalizado = nombreArchivoSinExtension.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalizar la cadena
            const blob = new Blob([], { type: 'application/pdf' });
            const archivoRecuperado = new File([blob], archivo, { type: 'application/pdf' });
  
            // Buscar el índice del documento habilitante con el mismo nombre (sin extensión y normalizado) que el archivo
            const indexDocumento = documentosHabilitantes.findIndex(documento => normalizeString(documento.nombre_doc).toLowerCase() === nombreArchivoNormalizado.toLowerCase());
            if (indexDocumento !== -1) {
              // Obtener el input de archivo correspondiente usando el índice del documento habilitante
              const archivoInput = fileInputs.current[indexDocumento];
  
              if (archivoInput) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(archivoRecuperado);
                archivoInput.files = dataTransfer.files;
                archivoInput.dispatchEvent(new Event('change'));
              }
            }
          }
        }
      } catch (error) {
        
      }
    };
  
    obtenerArchivos();
  
  }, [documentosHabilitantes]);

  const todosArchivosEncontrados = async () => {
    try {
      // Obtener datos necesarios, como proceso y archivos
      const responseProceso = await Axios.get(`http://localhost:5000/obtener_proceso/${idSoce}`);
      const proceso = responseProceso.data[0];
      setProceso(proceso);
      
      // Obtener nombres normalizados de los archivos habilitantes
      const documentosFiltradosData = documentosHabilitantes.filter(doc => doc.obligatorio === true);
      const archivosHabilitantes = documentosFiltradosData.map(documento => normalizeString(documento.nombre_doc).toLowerCase());
  
      // Obtener nombres normalizados de los archivos encontrados
      const response = await Axios.get(`http://localhost:5000/procesos/${proceso.pac_fase_preparatoria_pk}`);
      const archivosEncontrados = response.data.map(archivo => {
        const nombreArchivoSinExtension = archivo.replace('.pdf', '');
        return normalizeString(nombreArchivoSinExtension).toLowerCase();
      });
      setEstudioMercado(archivosEncontrados.includes('estudio de mercado'));
  
      // Verificar si todos los archivos habilitantes están presentes en los archivos encontrados
      for (const archivo of archivosHabilitantes) {
        if (!archivosEncontrados.includes(archivo)) {
          setSubidaCompletada(false);
          return;
        }
      }
      setSubidaCompletada(true);
    } catch (error) {
      
    }
  };  

  useEffect(() => {
    todosArchivosEncontrados();
  }, [documentosHabilitantes, mensaje]);

  useEffect(() => {
    const obtenerPresupuesto = async (regimen) => {
      try {
          const response = await Axios.get(`http://localhost:5000/obtener_presupuesto_total/`);
          const numero = parseFloat(response.data.sum);
          setPresupuesto(numero);
      } catch (error) {
          console.error('Error al obtener presupuesto', error);
      }
    };

    obtenerPresupuesto();
  }, []);

  const revisar_historial = () => {
    localStorage.setItem('idSoce', idSoce);
    history.push('/historial-comentarios');
  };
  
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('pac_fase_preparatoria_pk', proceso.pac_fase_preparatoria_pk);
      for (const [nombreDoc, archivo] of Object.entries(archivos)) {
        formData.append('archivos', archivo, `${normalizeString(nombreDoc)}.pdf`);
      }
      await Axios.post('http://localhost:5000/uploadProceso', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMensaje('Archivo guardado correctamente.')
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
    } catch (error) {
      setMensaje('Ocurrió un fallo al guardar el archivo.')
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
      console.error('Error al enviar archivos:', error);
    }
  };

  const handleFormCommentSubmit = async (formData) => {
    const fechaActual = new Date();
    try {
      if(comentario.trim()===''){
        setMensaje('Por favor, ingrese un comentario.')
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
      }else{
        const response = await Axios.post(`http://localhost:5000/registrarComentario/`, 
        { comentario, 
          correo_usuario:username, 
          proceso:idSoce, 
          fecha:fechaActual});
        console.log('Respuesta del servidor:', response.data);
        setMensaje('Comentario enviado correctamente.')
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 3000);
      }
    } catch (error) {
        setMensaje('Ocurrió un error al enviar el comentario.')
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
        console.error('Error al enviar comentario', error);
    }
  };

    const showComentarioConfirm = () => {
      confirm({
        title: '¿Está seguro de enviar el comentario?',
        icon: <ExclamationCircleFilled />,
        okText: 'Sí',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          handleFormCommentSubmit();
          //handleSubmitGuardar();
        },
        onCancel() {
          console.log('No guardar');
        },
      });
};
  
  const showGuardarConfirm = () => {
        confirm({
          title: '¿Está seguro de guardar el archivo?',
          icon: <ExclamationCircleFilled />,
          okText: 'Sí',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            handleUpload();
            //handleSubmitGuardar();
          },
          onCancel() {
            console.log('No guardar');
          },
        });
  };


  const handleDesierto = async () => {
    try {
      await Axios.post('http://localhost:5000/cambiar_fase_preparatoria/',{
      estadoNuevo: 'NO INICIADO', 
      pac_fase_preparatoria_pk:proceso.pac_fase_preparatoria_pk });
      setMensaje('Se ha requerido reforma correctamente.')
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
    } catch (error) {
      setMensaje('Ocurrió un fallo al requerir reforma.')
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
      console.error('Error al requerir reforma:', error);
    }
  };

  const handleCambiarFase = async () => {
    console.log(fase);
    try {
      let estadoNuevo = null;
      if(fase === 'Documentos Preparatorios') estadoNuevo = 'CONTROL PREVIO COMPRAS';
      if(fase === 'Control Previo Compras') estadoNuevo = 'REVISIÓN JURÍDICO';
      if(fase === 'Revisión Jurídico') estadoNuevo = 'SOLICITUD INFORME DE PERTINENCIA';
      if(fase === 'Informe de Pertinencia') estadoNuevo = 'EXPEDIENTE PREPARATORIO';
      if(fase === 'Expediente Preparatorio') estadoNuevo = 'ELABORACIÓN DE PLIEGOS';
      if(fase === 'Pliegos') estadoNuevo = 'SOLICITUD DE INICIO';
      if(fase === 'Solicitud de Inicio') estadoNuevo = 'RESOLUCIÓN DE INICIO';
      if(fase === 'Resolución de Inicio') estadoNuevo = 'PUBLICADO';
      await Axios.post('http://localhost:5000/cambiar_fase_preparatoria/',{
      estadoNuevo: estadoNuevo, 
      pac_fase_preparatoria_pk:proceso.pac_fase_preparatoria_pk });
      setMensaje('Archivo enviado a la siguiente fase correctamente.')
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
    } catch (error) {
      setMensaje('Ocurrió un fallo al colocar el proceso en la siguiente fase.')
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
      console.error('Error al enviar archivos:', error);
    }
  };

  const showDesiertoConfirm = () => {
    confirm({
      title: '¿Está seguro de requerir reforma?',
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

const handleInputComentario = (e) => {
  setComentario(e.target.value);
};

const showFaseConfirm = () => {
  confirm({
    title: '¿Está seguro de mandar el proceso a la siguiente fase?',
    icon: <ExclamationCircleFilled />,
    okText: 'Sí',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      handleCambiarFase();
      //handleSubmitGuardar();
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
                <Title level={4} className="titleTable2" >Descripción</Title>
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
        <div className="contenedorTabla3">
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
      <Container className="mt--90" fluid>
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={12}>
            <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: '100%' }}>
              <Form>
                <div className="pl-lg-4">
                <Row>
                    <Col md={10} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-city">
                          Proceso
                        </label>
                        <textarea
                          value={proceso.detalle_producto}
                          disabled
                          className="form-control-alternative"
                          style={{ height: '150px', resize: 'vertical', width: '250px', marginBottom: '-30px' }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={10} style={{ marginLeft: '25px' }} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Tipo Régimen
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          value={proceso.tipo_regimen}
                          placeholder=""
                          type="text"
                          variant="borderless"
                          disabled
                        />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Tipo Compra
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          placeholder=""
                          value={proceso.tipo_compra}
                          type="text"
                          variant="borderless"
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={10} className="mb-4">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-city">
                          CPC
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          placeholder=""
                          value={proceso.cpc}
                          type="text"
                          variant="borderless"
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    
                    <Col md={10} style={{ marginLeft: '25px' }} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Procedimiento Sugerido
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          value={proceso.procedimiento_sugerido}
                          placeholder=""
                          type="text"
                          variant="borderless"
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={10} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Presupuesto Planificado
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          placeholder=""
                          value={proceso.total}
                          type="text"
                          variant="borderless"
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col md={10} style={{ marginLeft: '25px' }} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Presupuesto Final
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          value={presupuesto-proceso.total}
                          placeholder=""
                          type="text"
                          variant="borderless"
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: '100%' }}>
              <Form>
                <div className="pl-lg-4">
                  <Row>
                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Observaciones
                        </label>
                        <textarea
                          onChange={handleInputComentario}
                          className="form-control-alternative"
                          style={{ height: '150px', resize: 'vertical', width: '250px',marginBottom:'-30px'}}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6} className="botonesObservaciones" style={{ marginLeft: '110px', marginTop: '20px' }}>
                      <Button className="btnCrearProceso" style={{ marginBottom: '10px', width: '210px' }} onClick={showComentarioConfirm}>Enviar Comentario</Button>
                      <Button className="btnCrearProceso" style={{ width: '210px' }} onClick={revisar_historial}>Revisar Historial Comentarios</Button>
                    </Col>
                  </Row>
                  {estudioDeMercadoPresente ? (
                    <Row>
                      <Col md={10} className="mb-3">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-country">
                            Estudio de Mercado
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder=""
                            value={proceso.total}
                            type="text"
                            variant="borderless"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    null
                  )}
                </div>
              </Form>
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
                <Title level={4} className="titleTable2" >Formulario {fase}</Title>
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
                  {fase !== 'Resolución de Inicio' && (
                  <Button className="btnCrearProceso" type="primary" title="Requiere Reforma" onClick={showDesiertoConfirm}>
                      <span className="iconWrapper">
                        <FaFileArrowUp />
                      </span>
                  </Button>
                  )}
                  {subidaCompletada && (
                    <Button className="btnCrearProceso" type="primary" title="Enviar a siguiente fase" onClick={showFaseConfirm}>
                      <span className="iconWrapper">
                       <FaFileImport />
                      </span>
                    </Button>
                  )}
                </div>
              </div>
              </Card>
            </Col>
          </Row>
        </Container>
        <div></div>
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
                  {documentosHabilitantes.map((documento, index) => (
                    <Col md="4" key={documento.id_doc}>
                      <FormGroup>
                        <label>{documento.nombre_doc}</label>
                        <input
                          type="file"
                          ref={el => fileInputs.current[index] = el}
                          onChange={(e) => handleFileChange(documento.nombre_doc, e)}
                          accept="application/pdf"
                          className="form-control"
                        />
                      </FormGroup>
                    </Col>
                  ))}
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
  
  export default Subir_SOCE;