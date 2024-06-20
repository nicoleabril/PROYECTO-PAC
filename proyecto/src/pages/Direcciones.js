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
  
  function Direcciones() {
    const history = useHistory();
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [direcciones, setDirecciones] = useState([]);
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

    const eliminarDireccion = async (id) => {
        try {
          const response = await Axios.post(`http://localhost:5000/borrarDireccion/`, 
          {id_direccion: id,});
            setSuccessVisible(true);
            setTimeout(() => {
                setSuccessVisible(false);
                window.location.reload();
            }, 1000);          
            console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 3000);
            console.error('Error al guardar información de empresa', error);
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
          title: '¿Está seguro de borrar esta dirección?',
          icon: <ExclamationCircleFilled />,
          okText: 'Sí',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            eliminarDireccion(id);
          },
          onCancel() {
            console.log('No borrar dirección');
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
  
    useEffect(() => {
      const obtenerDirecciones = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_direcciones/`);
            setDirecciones(response.data);
        } catch (error) {
            console.error('Error al obtener direcciones:', error);
        }
      };

      const obtenerUsuarios = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_usuarios/`);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener direcciones:', error);
        }
      };
      
      obtenerDirecciones();
      obtenerUsuarios();
    }, []);
  
    const editar_reforma = (id) => {
      localStorage.setItem('id', id);
      history.push('/editar-direcciones');
    };
  
    const usuariosMap = usuarios.reduce((map, usuario) => {
        map[usuario.id_usuario] = usuario.nombres_usuario+' '+usuario.apellidos_usuario;
        return map;
      }, {});
    
    const columnas = [
      {
        title: '',
        key: 'editar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => editar_reforma(registro.id_direccion)} >
          <a><EditOutlined  title="Editar Dirección" /></a>
        </Typography.Link>
        ),
        width:10,
      },
      {
        title: '',
        key: 'eliminar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => showDeleteConfirm(registro.id_direccion)} >
            <a><DeleteOutlined  title="Eliminar Dirección" /></a>
          </Typography.Link>
        ),
        width:10,
      },
      {
          title: "Nombre de la Dirección",
          key: "nombre_direccion",
          dataIndex: "nombre_direccion",
          sorter: (a, b) => {
            const lengthA = a.nombre_direccion ? a.nombre_direccion.length : 0;
            const lengthB = b.nombre_direccion ? b.nombre_direccion.length : 0;
            return lengthA - lengthB;
          },
          ...getColumnSearchProps('nombre_direccion'),
      },
      {
        title: "Siglas de la Dirección",
        key: "siglas_direccion",
        dataIndex: "siglas_direccion",
        sorter: (a, b) => {
          const lengthA = a.siglas_direccion ? a.siglas_direccion.length : 0;
          const lengthB = b.siglas_direccion ? b.siglas_direccion.length : 0;
          return lengthA - lengthB;
        },
        ...getColumnSearchProps('siglas_direccion'),
    },
      {
          title: "Fecha de Creación",
          key: "fecha_creacion",
          dataIndex: "fecha_creacion",
          sorter: (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion),
          ...getColumnSearchProps('fecha_creacion'),
      },
      {
          title: "Fecha de Actualización",
          key: "fecha_actualizacion",
          dataIndex: "fecha_actualizacion",
          sorter: (a, b) => new Date(a.fecha_actualizacion) - new Date(b.fecha_actualizacion),
      },
      {
          title: "Director",
          key: "id_superior",
          dataIndex: "id_superior",
          sorter: (a, b) => a.id_superior.length - b.id_superior.length,
          render: (id_superior) => usuariosMap[id_superior],
      },
    ];
  
    return (
      <div>
        <Container className="contenedorTitleTable" fluid>
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
                message="La dirección se eliminó correctamente"
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
                    <Title level={4} className="titleTable2" >Direcciones</Title>
                    <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                        <NavLink to="/panel">
                        <Button className="btnCrearProceso" type="primary" title="Regresar">
                            <span className="iconWrapper">
                            <RiArrowGoBackFill />
                            </span>
                        </Button>
                        </NavLink>
                        <NavLink to="/incluir-direcciones">
                        <Button className="btnCrearProceso" type="primary" title="Crear Dirección">
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
             className="ant-border-space"
              columns={columnas}
              dataSource={direcciones}
              pagination={true}
              rowKey="id_direccion"
              style={{ whiteSpace: 'nowrap' }}
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
  
  export default Direcciones;