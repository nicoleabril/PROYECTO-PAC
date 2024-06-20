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

import { NavLink, useHistory } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import Axios from 'axios';
import Cookies from 'js-cookie';
import { Typography, Modal, Form } from 'antd'; 
import { Container, FormGroup } from 'reactstrap';
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import { RiArrowGoBackFill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";

const { confirm } = Modal;
const { Title } = Typography; // Usa Typography de antd para el título

function Edicion_Resolucion() {
  const inputArchivoResoRef = useRef(null);
  const inputArchivoDetaRef = useRef(null);
  const history = useHistory();
  const fechaActual = new Date().toISOString();
  const user = Cookies.get('usr');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [reformas, setReformas] = useState([]);
  const [resolucion, setResolucion] = useState([]);
  const [archivoResolucion, setArchivoResolucion] = useState([]);
  const [archivoDetalle, setArchivoDetalle] = useState([]);
  const [form] = Form.useForm();
  const [numResol, setNumResol] = useState('');
  const [checkboxes, setCheckboxes] = useState({});
  const idParaEditar = localStorage.getItem('idResolucion');

  const handleScroll = (e) => {
    const container = e.target;
    const maxScrollLeft = container.scrollWidth - container.clientWidth - 30; // 30px de margen derecho
    if (container.scrollLeft > maxScrollLeft) {
      container.scrollLeft = maxScrollLeft;
    }
  };

  const handleInputChangeNumeroResol = (e) => {
    setNumResol(e.target.value);
};

const limpiarCampos = () => {
  setNumResol('');
  // Limpia los otros campos del formulario...
};

const regresar_Inicio = () => {
  window.history.back();
};


const obtenerResolucion = async () => {
  try {
      const response = await Axios.get(`http://localhost:5000/obtener_resolucion/${idParaEditar}`);
      setResolucion(response.data[0]);
      if(response.data[0].nro_sol_resol){
        setNumResol(String(response.data[0].nro_sol_resol))
      }
      if(response.data[0].url_resolucion){
        const blob = new Blob([new Uint8Array(response.data[0].url_resolucion.data)], { type: 'application/pdf' });
        setArchivoResolucion(blob);
        const archivoRecuperado = new File([blob], 'resolucion.pdf', { type: 'application/pdf' });
        const archivoInput = inputArchivoResoRef.current;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(archivoRecuperado);
        archivoInput.files = dataTransfer.files;
        archivoInput.dispatchEvent(new Event('change'));
      }
      if(response.data[0].url_resolucion_firmada){
        const blob = new Blob([new Uint8Array(response.data[0].url_resolucion_firmada.data)], { type: 'application/pdf' });
        setArchivoResolucion(blob);
        const archivoRecuperado = new File([blob], 'resolucion_firmada.pdf', { type: 'application/pdf' });
        const archivoInput = inputArchivoResoRef.current;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(archivoRecuperado);
        archivoInput.files = dataTransfer.files;
        archivoInput.dispatchEvent(new Event('change'));
      }
      if(response.data[0].url_detalle_resol){
        const blob = new Blob([new Uint8Array(response.data[0].url_detalle_resol.data)], { type: 'application/pdf' });
        setArchivoDetalle(blob);
        const archivoRecuperado = new File([blob], 'detalle_resolucion.pdf', { type: 'application/pdf' });
        const archivoInput = inputArchivoDetaRef.current;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(archivoRecuperado);
        archivoInput.files = dataTransfer.files;
        archivoInput.dispatchEvent(new Event('change'));
      }
      return response.data[0];
  } catch (error) {
      console.error('Error al obtener resolucion:', error);
      return null;
  }
};

useEffect(() => {

    const obtenerReformas = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_reformas_autorizadas/${idParaEditar}`);
            setReformas(response.data);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };

    obtenerResolucion();
    obtenerReformas();
}, []);

const handleSubmitGuardar = async () => {
  const resolucion = await obtenerResolucion();
  console.log(resolucion);
  if(resolucion.estado === 'Pendiente'){
    guardarResolucion();
  }
  if(resolucion.estado === 'Iniciado'){
    guardarResolucionFirmada();
  }
};

const handleSubmitActualizarPAC = async () => {
  const resolucion = await obtenerResolucion();
  if(resolucion.estado === 'Firmada'){
    try {
      const response = await Axios.post('http://localhost:5000/actualizarPAC', {
        secuencial_resolucion:idParaEditar,
        reformasAutorizadas:JSON.stringify(reformas),
      });
      setMensaje('El PAC se actualizó correctamente.')
      setSuccessVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al actualizar PAC.', error);
    }
  }else{
    setMensaje('Por favor, ingrese la resolución firmada antes de actualizar el PAC.')
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
  }
};

const guardarResolucion = async (e) => {
  if(numResol.trim() === '' ||  archivoResolucion === null ||  archivoDetalle === null){
    setMensaje('Por favor complete todos los campos del formulario.')
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
  } else {
    try {
      const formData = new FormData();
      formData.append('fch_carga_documento', fechaActual);
      formData.append('usr_carga', user);
      formData.append('nro_sol_resol', numResol);
      formData.append('secuencial_resolucion', idParaEditar);
      formData.append('url_resolucion', archivoResolucion);
      formData.append('url_detalle_resol', archivoDetalle);

      const response = await Axios.post('http://localhost:5000/actualizarResolucionCargada', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMensaje('Información de la resolución guardada correctamente.')
      setSuccessVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al actualizar resolucion', error);
    }
  }
};

const guardarResolucionFirmada = async () => {
  if(numResol.trim() === '' ||  archivoResolucion === null ||  archivoDetalle === null){
    setMensaje('Por favor complete todos los campos del formulario.')
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
  } else {
    try {
      const formData = new FormData();
      formData.append('fch_carga_firmada', fechaActual);
      formData.append('usr_carga_firmada', user);
      formData.append('nro_sol_resol', numResol);
      formData.append('secuencial_resolucion', idParaEditar);
      formData.append('url_resolucion_firmada', archivoResolucion);
      formData.append('url_detalle_resol', archivoDetalle);

      const response = await Axios.post('http://localhost:5000/actualizarResolucionFirmada', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMensaje('Información de la resolución guardada correctamente.')
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al actualizar resolucion', error);
    }
  }
};

const handleChangeArchivoResolucion = (event) => {
  const archivoSeleccionado = event.target.files[0];

  if (archivoSeleccionado) {
    setArchivoResolucion(archivoSeleccionado);
  }
  console.log('Resolucion cargado');
};


const handleChangeArchivoDetalle = (event) => {
  const archivoSeleccionado = event.target.files[0];

  if (archivoSeleccionado) {
    setArchivoDetalle(archivoSeleccionado);
  }
  console.log('Detalle cargado');
};

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

const detalle_reforma = (id) => {
  localStorage.setItem('idResolucion', idParaEditar);
  localStorage.setItem('proceso', 'null');
  localStorage.setItem('id', id);
  history.push('/visualizar-reformas');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reiniciar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

const columnas = [
    {
      title: '',
      key: 'visualizar',
      fixed: 'left',
      render: (_, registro) => (
        <Typography.Link onClick={() => detalle_reforma(registro.secuencial_reforma)} >
            <a><EyeOutlined title="Visualizar Reforma" /></a>
        </Typography.Link>
      ),
      width:100,
    },
    {
        title: "ID Proceso",
        key: "id_proceso",
        dataIndex: "id_proceso",
        sorter: (a, b) => {
          const lengthA = a.id_proceso ? a.id_proceso.length : 0;
          const lengthB = b.id_proceso ? b.id_proceso.length : 0;
          return lengthA - lengthB;
        },
        ...getColumnSearchProps('id_proceso'),
    },
    {
        title: "Objeto Contratación",
        key: "descripcion",
        dataIndex: "descripcion",
        sorter: (a, b) => a.descripcion.length - b.descripcion.length,
        ...getColumnSearchProps('descripcion'),
    },
    {
      title: "Versión",
      key: "version_proceso",
      dataIndex: "version_proceso",
      sorter: (a, b) => a.version_proceso.length - b.version_proceso.length,
  },
    {
        title: "Tipo Compra",
        key: "tipo_compra",
        dataIndex: "tipo_compra",
        sorter: (a, b) => a.tipo_compra.length - b.tipo_compra.length,
    },
    {
        title: "Tipo Regimen",
        key: "tipo_regimen",
        dataIndex: "tipo_regimen",
        sorter: (a, b) => a.tipo_regimen.length - b.tipo_regimen.length,
    },
    {
      title: "Tipo Reforma",
      key: "tipo_reforma",
      dataIndex: "tipo_reforma",
      sorter: (a, b) => a.tipo_reforma.length - b.tipo_reforma.length,
      },
    {
        title: "Partida Presupuestaria",
        key: "partida_presupuestaria",
        dataIndex: "partida_presupuestaria",
        sorter: (a, b) => a.partida_presupuestaria.length - b.partida_presupuestaria.length,
    },
    {
        title: "Dirección",
        key: "area_requirente",
        dataIndex: "area_requirente",
        sorter: (a, b) => a.area_requirente.length - b.area_requirente.length,
    },
    {
        title: "Departamento",
        key: "id_departamento",
        dataIndex: "id_departamento",
        sorter: (a, b) => a.id_departamento.length - b.id_departamento.length,
    },
    {
        title: "Año",
        key: "anio",
        dataIndex: "anio",
        sorter: (a, b) => a.anio - b.anio,
    },
  ];

  const showGuardarConfirm = () => {
      confirm({
        title: '¿Está seguro de guardar la Resolución?',
        icon: <ExclamationCircleFilled />,
        okText: 'Sí',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          handleSubmitGuardar();
        },
        onCancel() {
          console.log('No guardar');
        },
      });
  };

  const showActualizarPAConfirm = () => {
    confirm({
      title: '¿Está seguro de actualizar el PAC?',
      icon: <ExclamationCircleFilled />,
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleSubmitActualizarPAC();
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
              <Title level={4} className="titleTable2" >Editar Resolución Reforma</Title>
              <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                  <Button className="btnCrearProceso" type="primary" title="Regresar" onClick={regresar_Inicio}>
                    <span className="iconWrapper">
                      <RiArrowGoBackFill />
                    </span>
                  </Button>
                <Button
                  className="btnCrearProceso"
                  color="primary"
                  onClick={showGuardarConfirm}
                  size="sm"
                  type="primary"
                >
                  Guardar
                </Button>
              <Button
                className="btnCrearProceso"
                onClick={showActualizarPAConfirm}
                size="sm"
                type="primary"
              >
                Actualizar PAC
              </Button>
              </div>
            </div>
            </Card>
          </Col>
        </Row>
      </Container>
      <div
        className="contenedorTabla3"
      >
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
        
        <Container className="mt--90" fluid>
  <Row gutter={[24, 0]}>
    <Col xs={24} xl={24}>
      <Card bordered={false} className="criclebox tablespace mb-24">
        <div className="mt--90 contenedorReformas">
          <div className="pl-lg-4">
            <Row>
              <Col md="4" className="mb-3">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-username">
                    Número de Resolución
                  </label>
                  <Input
                    defaultValue={numResol}
                    className="form-control-alternative"
                    id="input-first-name"
                    placeholder="Ingrese número de resolución"
                    type="text"
                    onChange={handleInputChangeNumeroResol}
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mb-3">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-username">
                    Cargar Detalle de Reforma
                  </label>
                  <input
                    type="file"
                    ref={inputArchivoDetaRef}
                    onChange={handleChangeArchivoDetalle}
                    accept="application/pdf"
                    className="form-control"
                  />
                </FormGroup>
              </Col>
              <Col md="4" className="mb-3">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-username">
                    Cargar Resolución
                  </label>
                  <input
                    type="file"
                    ref={inputArchivoResoRef}
                    onChange={handleChangeArchivoResolucion}
                    accept="application/pdf"
                    className="form-control"
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
      <Container className="contenedorTitleTable" fluid>
        <Row gutter={[24, 0]}>
          <Col xs={24} xl={24}>
          <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: 'fit-content' }}>
            <div className="titleTable">
              <Title level={4} className="titleTable2" >Reformas Autorizadas</Title>
            </div>
            </Card>
          </Col>
        </Row>
      </Container>
      <div
        className="contenedorTabla"
        style={{ overflowX: 'auto' }}
        onScroll={handleScroll}
      >
        <Container className="mt--90" fluid>
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
              <Card bordered={false} className="criclebox tablespace mb-24">
                <div className="table-responsive">
                  <Table
                    columns={columnas}
                    dataSource={reformas}
                    pagination={true}
                    className="ant-border-space"
                    style={{ whiteSpace: 'nowrap' }}
                    rowKey="secuencial_reforma"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
  
  
}

export default Edicion_Resolucion;
