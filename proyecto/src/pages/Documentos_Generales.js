import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Button,
  Input,
  Space 
} from "antd"; 

import { NavLink, useHistory } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import Axios from 'axios';
import Cookies from 'js-cookie';
import { Typography, Modal, Alert } from 'antd'; 
import { Container } from 'reactstrap';
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import { RiArrowGoBackFill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";


const { confirm } = Modal;
const { Title } = Typography; // Usa Typography de antd para el título

function Documentos_Generales() {
  const history = useHistory();
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [direcciones, setDirecciones] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleScroll = (e) => {
    const container = e.target;
    const maxScrollLeft = container.scrollWidth - container.clientWidth - 30; // 30px de margen derecho
    if (container.scrollLeft > maxScrollLeft) {
      container.scrollLeft = maxScrollLeft;
    }
  };

  const eliminarDepartamento = async (id) => {
      try {
        const response = await Axios.post(`http://localhost:5000/eliminarDocGen/`, 
        {id_doc: id,});
          setSuccessVisible(true);
          setTimeout(() => {
              setSuccessVisible(false);
              window.location.reload();
          }, 1000);          
          console.log('Respuesta del servidor:', response.data);
      } catch (error) {
          setErrorVisible(true);
          setTimeout(() => setErrorVisible(false), 3000);
          console.error('Error al eliminar Documento', error);
      }
  };

  const showDeleteConfirm = (id) => {
      confirm({
        title: '¿Está seguro de borrar este documento?',
        icon: <ExclamationCircleFilled />,
        okText: 'Sí',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          eliminarDepartamento(id);
        },
        onCancel() {
          console.log('No borrar departamento');
        },
      });
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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Buscar...`}
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

  useEffect(() => {

      const obtenerDepartamentos = async () => {
          try {
              const response = await Axios.get(`http://localhost:5000/obtener_doc_generales/`);
              setDocumentos(response.data);
          } catch (error) {
              console.error('Error al obtener departamentos:', error);
          }
      };

      obtenerDepartamentos();
  }, []);

  const editar_reforma = (id) => {
    localStorage.setItem('id_doc', id);
    history.push('/editar-departamentos');
  };
  
  const columnas = [
    {
      title: '',
      key: 'editar',
      fixed: 'left',
      render: (_, registro) => (
        <Typography.Link onClick={() => editar_reforma(registro.id_doc)} >
          <a><EditOutlined title="Editar Documento" /></a>
        </Typography.Link>
      ),
      width:10,
    },
    {
      title: '',
      key: 'eliminar',
      fixed: 'left',
      render: (_, registro) => (
        <Typography.Link onClick={() => showDeleteConfirm(registro.id_doc)} >
        <a><DeleteOutlined title="Borrar Documento" /></a>
        </Typography.Link>
      ),
      width:10,
    },
    {
        title: "Nombre del Documento",
        key: "nombre_doc",
        dataIndex: "nombre_doc",
        sorter: (a, b) => {
          const lengthA = a.nombre_doc ? a.nombre_doc.length : 0;
          const lengthB = b.nombre_doc ? b.nombre_doc.length : 0;
          return lengthA - lengthB;
        },
        ...getColumnSearchProps('nombre_doc'),
    },
    {
      title: "Obligatorio",
      key: "obligatorio",
      dataIndex: "obligatorio",
      render: (obligatorio) => obligatorio ? 'Sí' : 'No'
  }, 
  {
    title: "Mensaje de Correo",
    key: "email_doc",
    dataIndex: "email_doc",
    sorter: (a, b) => {
      const lengthA = a.email_doc ? a.email_doc.length : 0;
      const lengthB = b.email_doc ? b.email_doc.length : 0;
      return lengthA - lengthB;
    },
    ...getColumnSearchProps('email_doc'),
  },  
  ];

  return (
    <div>
      <Container className="contenedorTitleTable" fluid>
          {/* Alerta de error */}
          {errorVisible && (
              <Alert
              message="Error al eliminar documento."
              type="error"
              showIcon
              closable
              onClose={() => setErrorVisible(false)}
              />
          )}

          {/* Alerta de éxito */}
          {successVisible && (
              <Alert
              message="El documento se eliminó correctamente"
              type="success"
              showIcon
              closable
              onClose={() => setSuccessVisible(false)}
              />
          )}
          <Row gutter={[24, 0]}>
              <Col xs={24} xl={24}>
              <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: 'fit-content' }}>
                  <div className="titleTable">
                  <Title level={4} className="titleTable2" >Documentos Generales</Title>
                  <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                      <NavLink to="/panel">
                      <Button className="btnCrearProceso" type="primary" title="Regresar">
                          <span className="iconWrapper">
                          <RiArrowGoBackFill />
                          </span>
                      </Button>
                      </NavLink>
                      <NavLink to="/incluir-departamentos">
                      <Button className="btnCrearProceso" type="primary" title="Agregar Documento Habilitante">
                          <span className="iconWrapper">
                          <FiPlus />
                          </span>
                      </Button>
                      </NavLink>
                  </div>
                  </div>
              </Card>
              </Col>
          </Row>
          </Container>
          <div
          className="contenedorTabla2"
          onScroll={handleScroll}
          >
          <Container className="mt--90" fluid>
              <Row gutter={[24, 0]}>
              <Col xs={24} xl={24}>
                  <Card bordered={false} className="criclebox tablespace mb-24">
                  <div className="table-responsive">
                      <Table
                      columns={columnas}
                      dataSource={documentos}
                      className="ant-border-space"
                      style={{ whiteSpace: 'nowrap' }}
                      rowKey="id_doc"
                      pagination={{ pageSize: 5 }}
                      />
                  </div>
                  </Card>
              </Col>
              </Row>
          </Container>
          </div>
    </div>
  );
  
  
}

export default Documentos_Generales;