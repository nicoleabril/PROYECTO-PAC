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

  import { HiDocumentPlus,HiDocumentMinus,HiDocumentCheck,HiDocumentMagnifyingGlass, HiDocumentArrowUp   } from "react-icons/hi2";
import zIndex from "@mui/material/styles/zIndex";
  
  const { confirm } = Modal;
  const { Title } = Typography; // Usa Typography de antd para el título
  
  function Subir_Infima_Cuantia() {
    const [mensaje, setMensaje] = useState('');
    const [comentario, setComentario] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [subidaCompletada, setSubidaCompletada] = useState(false);
    const [archivos, setArchivos] = useState({});
    const [seleccionadoUnidad, setSeleccionadoUnidad] = useState('');
    const [proceso, setProceso] = useState([]);
    const [destinatario, setDestinatario] = useState([]);
    const [presupuesto, setPresupuesto] = useState([]);
    const [fases, setFases] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [archivosEncontrados, setArchivosEncontrados] = useState([]);
    const [documentosHabilitantes, setDocumentosHabilitantes] = useState([]);
    const [documentosCargados, setDocumentosCargados] = useState([]);
    const [form] = Form.useForm();
    const history = useHistory();
    const id_infima = localStorage.getItem('idInfima');
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
            const response = await Axios.get(`http://localhost:5000/obtener_infima_cuantia/${id_infima}`);
            const proceso = response.data[0];
            setProceso(proceso);
            let tipo_compra = 0;
            if(proceso.tipo_compra === 'SERVICIO' || proceso.tipo_compra === 'OBRA'){
              tipo_compra = 7;
              setUsuarios([
                { id: 1, nombre: proceso.elaborador, fase_devolucion: "Elaboración de documentos" },
                { id: 2, nombre: proceso.revisor_compras, fase_devolucion: "Control Previo Compras" },
                { id: 3, nombre: proceso.elaborador, fase_devolucion: "Solicitud de Publicación de Necesidad de IFC" },
                { id: 4, nombre: proceso.revisor_compras, fase_devolucion: "Publicación de Necesidad de IFC" },
                { id: 5, nombre: proceso.revisor_compras, fase_devolucion: "Cuadro Comparativo" },
                { id: 6, nombre: proceso.elaborador, fase_devolucion: "Elaboración de Orden de Compra" },
                { id: 7, nombre: proceso.revisor_compras, fase_devolucion: "Ejecución de Orden de Compra" },
                // Agrega más usuarios y fases según sea necesario
              ]);
            }
            if(proceso.tipo_compra === 'BIEN'){
              tipo_compra = 6;
              setUsuarios([
                { id: 1, nombre: proceso.elaborador, fase_devolucion: "Elaboración de documentos" },
                { id: 2, nombre: proceso.revisor_compras, fase_devolucion: "Control Previo Compras" },
                { id: 3, nombre: proceso.elaborador, fase_devolucion: "Solicitud de Publicación de Necesidad de IFC" },
                { id: 4, nombre: proceso.revisor_compras, fase_devolucion: "Publicación de Necesidad de IFC" },
                { id: 5, nombre: proceso.elaborador, fase_devolucion: "Cuadro Comparativo" },
                { id: 6, nombre: proceso.revisor_compras, fase_devolucion: "Elaboración de Orden de Compra" },
              ]);
            }

            const fasesResponse = await Axios.get(`http://localhost:5000/obtener_fases/${tipo_compra}`);
            const fasesData = fasesResponse.data;
            if(tipo_compra=== 7){
              const indiceEjecucionOrdenCompra = fasesData.findIndex(fase => fase === 'Ejecución de Orden de Compra');
              const faseMovida = fasesData.splice(indiceEjecucionOrdenCompra, 1); // Remover la fase
              fasesData.push(faseMovida[0]); // Agregar la fase al final
            }
            const indiceControlPrevioCompras = fasesData.findIndex(fasep => fasep === fase);
            const fasesHastaControlPrevioCompras = fasesData.slice(0, indiceControlPrevioCompras + 1);

            setFases(fasesHastaControlPrevioCompras); // ['Elaboración de documentos', 'Control Previo Compras']
            // Obtener documentos
            if(fase === 'Elaboración de documentos' || fase === 'Solicitud de Publicación de Necesidad de IFC'){
              const documentosResponse = await Axios.get(`http://localhost:5000/obtener_doc_habilitantes/`);
              const documentosData = documentosResponse.data;

              // Obtener tipos de compra
              const tipoCompraResponse = await Axios.get(`http://localhost:5000/obtener_doc_tipo_compra/`);
              const tipoCompraData = tipoCompraResponse.data;

              const defaultV = tipoCompraData.find(doc => 
                normalizeString(doc.nombre_tipo_compra.toLowerCase()) === 
                normalizeString(proceso.tipo_compra.toLowerCase())
              );
              const documentosFiltradosData = documentosData.filter(doc => doc.tipo_compra === tipo_compra);
              setDocumentosHabilitantes(documentosFiltradosData.sort((a, b) => a.id_doc - b.id_doc));
            }else{
              const documentosResponse = await Axios.get(`http://localhost:5000/obtener_doc_generales/`);
              const documentosData = documentosResponse.data;
              const documentosFiltradosData = documentosData.filter(doc => doc.fase_preparatoria === fase  && doc.tipo_compra===tipo_compra);
              setDocumentosHabilitantes(documentosFiltradosData.sort((a, b) => a.id_doc - b.id_doc));
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
        // Obtener datos necesarios, como proceso y archivos
        const responseProceso = await Axios.get(`http://localhost:5000/obtener_infima_cuantia/${id_infima}`);
        const proceso = responseProceso.data[0];
        setProceso(proceso);
        const response = await Axios.get(`http://localhost:5000/infimas/${proceso.id_infima}`);
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
      const responseProceso = await Axios.get(`http://localhost:5000/obtener_infima_cuantia/${id_infima}`);
      const proceso = responseProceso.data[0];
      setProceso(proceso);
      
      // Obtener nombres normalizados de los archivos habilitantes
      const documentosFiltradosData = documentosHabilitantes.filter(doc => doc.obligatorio === true);
      const archivosHabilitantes = documentosFiltradosData.map(documento => normalizeString(documento.nombre_doc).toLowerCase());
  
      // Obtener nombres normalizados de los archivos encontrados
      const response = await Axios.get(`http://localhost:5000/infimas/${proceso.id_infima}`);
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
    localStorage.setItem('id_infima', id_infima);
    history.push('/revisar-bitacora-infima');
  };
  
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('id_infima', proceso.id_infima);
      for (const [nombreDoc, archivo] of Object.entries(archivos)) {
        formData.append('archivos', archivo, `${normalizeString(nombreDoc)}.pdf`);
      }
      await Axios.post('http://localhost:5000/uploadInfima', formData, {
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
      if(comentario.trim()==='' || seleccionadoUnidad.label === undefined || destinatario === undefined){
        setMensaje('Por favor, ingrese todos los datos.')
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
      }else{
        let estadoNuevo = null;
        if(seleccionadoUnidad.label === 'Elaboración de documentos') estadoNuevo = 'ELABORACIÓN DOCUMENTOS PREPARATORIOS';
        if(seleccionadoUnidad.label === 'Control Previo Compras') estadoNuevo = 'CONTROL PREVIO COMPRAS';
        if(seleccionadoUnidad.label === 'Solicitud de Publicación de Necesidad de IFC') estadoNuevo = 'SOLICITUD DE PUBLICACIÓN DE NECESIDAD DE IFC';
        if(seleccionadoUnidad.label === 'Publicación de Necesidad de IFC') estadoNuevo = 'PUBLICACIÓN DE NECESIDAD DE IFC';
        if(seleccionadoUnidad.label === 'Cuadro Comparativo') estadoNuevo = 'CUADRO COMPARATIVO';
        if(seleccionadoUnidad.label === 'Elaboración de Orden de Compra') estadoNuevo = 'ELABORACIÓN DE ORDEN DE COMPRA';
        if(seleccionadoUnidad.label === 'Ejecución de Orden de Compra') estadoNuevo = 'EJECUCIÓN DE ORDEN DE COMPRA';
        const response = await Axios.post(`http://localhost:5000/enviarBitacora/`, 
        { fecha: fechaActual, 
          remitente: username, 
          estado_inicial: proceso.estado, 
          destinatario:destinatario, 
          estado_final: estadoNuevo, 
          comentario: comentario, 
          id_infima: id_infima});
        devolverProceso();
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
        title: '¿Está seguro de devolver el Proceso?',
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
      await Axios.post('http://localhost:5000/cambiar_fase_preparatoria_infima/',{
      estadoNuevo: 'ELABORACIÓN DOCUMENTOS PREPARATORIOS', 
      id_infima:proceso.id_infima });
      setMensaje('Se ha cambiado de estado correctamente.')
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
    } catch (error) {
      setMensaje('Ocurrió un fallo al requerir reforma.')
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
      console.error('Error al requerir reforma:', error);
    }
  };

  const devolverProceso = async () => {
    let estadoNuevo = null;
    if(seleccionadoUnidad.label === 'Elaboración de documentos') estadoNuevo = 'ELABORACIÓN DOCUMENTOS PREPARATORIOS';
    if(seleccionadoUnidad.label === 'Control Previo Compras') estadoNuevo = 'CONTROL PREVIO COMPRAS';
    if(seleccionadoUnidad.label === 'Solicitud de Publicación de Necesidad de IFC') estadoNuevo = 'SOLICITUD DE PUBLICACIÓN DE NECESIDAD DE IFC';
    if(seleccionadoUnidad.label === 'Publicación de Necesidad de IFC') estadoNuevo = 'PUBLICACIÓN DE NECESIDAD DE IFC';
    if(seleccionadoUnidad.label === 'Cuadro Comparativo') estadoNuevo = 'CUADRO COMPARATIVO';
    if(seleccionadoUnidad.label === 'Elaboración de Orden de Compra') estadoNuevo = 'ELABORACIÓN DE ORDEN DE COMPRA';
    if(seleccionadoUnidad.label === 'Ejecución de Orden de Compra') estadoNuevo = 'EJECUCIÓN DE ORDEN DE COMPRA';
    try {
      await Axios.post('http://localhost:5000/cambiar_fase_preparatoria_infima/',{
      estadoNuevo, 
      id_infima:proceso.id_infima });
      setMensaje('Se ha devuelvo ínfima correctamente.')
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
    } catch (error) {
      setMensaje('Ocurrió un fallo al requerir reforma.')
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
      console.error('Error al requerir reforma:', error);
    }
  };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      overflow: 'visible',
    }),
    menuList: (provided) => ({
      ...provided,
      overflow: 'visible',
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: '#ffffff', // Aplica el color de fondo al control
    }),
  };

  const handleCambiarFase = async () => {
    try {
      let estadoNuevo = null;
      if(fase === 'Elaboración de documentos') estadoNuevo = 'CONTROL PREVIO COMPRAS';
      if(fase === 'Control Previo Compras') estadoNuevo = 'SOLICITUD DE PUBLICACIÓN DE NECESIDAD DE IFC';
      if(fase === 'Solicitud de Publicación de Necesidad de IFC') estadoNuevo = 'PUBLICACIÓN DE NECESIDAD DE IFC';
      if(fase === 'Publicación de Necesidad de IFC') estadoNuevo = 'CUADRO COMPARATIVO';
      if(fase === 'Cuadro Comparativo') estadoNuevo = 'ELABORACIÓN DE ORDEN DE COMPRA';
      if(fase === 'Elaboración de Orden de Compra') estadoNuevo = 'EJECUCIÓN DE ORDEN DE COMPRA';
      if(fase === 'Ejecución de Orden de Compra') estadoNuevo = 'PUBLICADO';
      await Axios.post('http://localhost:5000/cambiar_fase_preparatoria_infima/',{
      estadoNuevo: estadoNuevo, 
      id_infima:proceso.id_infima });
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

const handleInputChangeUnidad = (selectedOption) => {
  setSeleccionadoUnidad(selectedOption); // Actualizar la opción seleccionada
  const usuarioEncontrado = usuarios.find(usuario => usuario.fase_devolucion === selectedOption.label);
  setDestinatario(usuarioEncontrado.nombre);
  const inputValue = selectedOption ? selectedOption.value : null;
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
                    <Col md={11} style={{ marginLeft: '25px' }} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Partida Presupuestaria
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          value={proceso.partida_presupuestaria}
                          placeholder=""
                          type="text"
                          variant="borderless"
                          disabled
                        />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
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
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Fase Preparatoria
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          placeholder=""
                          value={proceso.estado}
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
                    
                    <Col md={11} style={{ marginLeft: '25px' }} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Unidad
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-username"
                          value={proceso.unidad}
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
            <Card bordered={false} className="criclebox tablespace mb-24" style={{ height:'100%', overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
              <Form>
                <div className="pl-lg-4">
                  <Row>
                    <Col md={6} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Devolver Ínfima
                        </label>
                        <textarea
                          placeholder="Comentario o Mensaje"
                          onChange={handleInputComentario}
                          className="form-control-alternative"
                          style={{ height: '150px', resize: 'vertical', width: '250px',marginBottom:'-30px'}}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6} className="botonesObservaciones" style={{ marginLeft: '110px', marginTop: '20px' }}>
                      <Button className="btnCrearProceso" style={{ marginBottom: '10px', width: '210px' }} onClick={showComentarioConfirm}>Devolver Ínfima</Button>
                      <Button className="btnCrearProceso" style={{ width: '210px' }} onClick={revisar_historial}>Revisar Bitácora</Button>
                    </Col>
                    <Col md={10} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Devolver a
                        </label>
                          <Select
                              value={seleccionadoUnidad}
                              onChange={handleInputChangeUnidad}
                              options={fases.map((elemento, index) => ({
                                  value: index, // Usamos el índice como valor
                                  label: elemento, // El valor del elemento es la etiqueta
                              }))}
                              placeholder="Selecciona una opción..."
                              styles={customStyles}
                          />
                      </FormGroup>
                    </Col>
                    <Col md={1} className="mb-3">
                    </Col>
                    <Col md={10} className="mb-3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="input-country">
                          Destinatario
                        </label>
                          <Select
                              isDisabled={true}
                              value={{ label: destinatario, value: 0 }}
                              options={[{ label: destinatario, value: 0 }]}
                          />
                      </FormGroup>
                    </Col>
                  </Row>
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
  
  export default Subir_Infima_Cuantia;