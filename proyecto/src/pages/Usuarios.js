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
  
  function Usuarios() {
    const history = useHistory();
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [accesosUsuarios, setAccesosUsuarios] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [direcciones, setDirecciones] = useState([]);
  
    const handleScroll = (e) => {
      const container = e.target;
      const maxScrollLeft = container.scrollWidth - container.clientWidth - 30; // 30px de margen derecho
      if (container.scrollLeft > maxScrollLeft) {
        container.scrollLeft = maxScrollLeft;
      }
    };

    const eliminarUsuario = async (id) => {
        try {
          const response = await Axios.post(`http://localhost:5000/borrar`, 
          {id: id,});
            setSuccessVisible(true);
            setTimeout(() => {
                setSuccessVisible(false);
                window.location.reload();
            }, 1000);          
            console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 3000);
            console.error('Error al eliminar usuario', error);
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
          title: '¿Está seguro de borrar este usuario?',
          icon: <ExclamationCircleFilled />,
          okText: 'Sí',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            eliminarUsuario(id);
          },
          onCancel() {
            console.log('No borrar usuario');
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

        const obtenerDepartamentos = async () => {
            try {
                const response = await Axios.get(`http://localhost:5000/obtener_departamentos/`);
                setDepartamentos(response.data);
            } catch (error) {
                console.error('Error al obtener departamentos:', error);
            }
        };

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
                console.error('Error al obtener usuarios:', error);
            }
        };

        const obtenerRoles = async () => {
          try {
              const response = await Axios.get(`http://localhost:5000/obtener_roles/`);
              setRoles(response.data);
          } catch (error) {
              console.error('Error al obtener roles:', error);
          }
        };

        const obtenerAccesos = async () => {
          try {
              const response = await Axios.get(`http://localhost:5000/obtener_roles_usuarios/`);
              setAccesosUsuarios(response.data);
              console.log(response.data);
          } catch (error) {
              console.error('Error al obtener usuarios:', error);
          }
      };
        obtenerDirecciones();
        obtenerRoles();
        obtenerAccesos();
        obtenerDepartamentos();
        obtenerUsuarios();
    }, []);
  
    const editar_reforma = (id) => {
      localStorage.setItem('id', id);
      history.push('/editar-usuarios');
    };

    const departamentosMap = departamentos.reduce((map, departamento) => {
        map[departamento.id_departamento] = departamento.nombre_departamento;
        return map;
    }, {});

    // Creamos un mapa para mapear id_direccion con nombre_direccion
    const mapDirecciones = {};
    direcciones.forEach(direccion => {
      mapDirecciones[direccion.id_direccion] = direccion.nombre_direccion;
    });


    const columnas = [
        {
            title: '',
            key: 'editar',
            fixed: 'left',
            render: (_, registro) => (
              <Typography.Link onClick={() => editar_reforma(registro.id_usuario)} >
                <a><EditOutlined title="Editar Usuario" /></a>
              </Typography.Link>
            ),
            width:10,
        },
        {
            title: '',
            key: 'eliminar',
            fixed: 'left',
            render: (_, registro) => (
            <Typography.Link onClick={() => showDeleteConfirm(registro.id_usuario)} >
              <a><DeleteOutlined title="Borrar Usuario" /></a>
            </Typography.Link>
            ),
            width:10,
        },
        {
            title: "Nombres",
            key: "nombres_usuario",
            dataIndex: "nombres_usuario",
            sorter: (a, b) => {
                const lengthA = a.nombres_usuario ? a.nombres_usuario.length : 0;
                const lengthB = b.nombres_usuario ? b.nombres_usuario.length : 0;
                return lengthA - lengthB;
            },
            ...getColumnSearchProps('nombres_usuario'),
        },
        {
            title: "Apellidos",
            key: "apellidos_usuario",
            dataIndex: "apellidos_usuario",
            sorter: (a, b) => {
                const lengthA = a.apellidos_usuario ? a.apellidos_usuario.length : 0;
                const lengthB = b.apellidos_usuario ? b.apellidos_usuario.length : 0;
                return lengthA - lengthB;
            },
            ...getColumnSearchProps('apellidos_usuario'),
        },
        {
            title: "Correo Electrónico",
            key: "correo_usuario",
            dataIndex: "correo_usuario",
            sorter: (a, b) => {
                const lengthA = a.correo_usuario ? a.correo_usuario.length : 0;
                const lengthB = b.correo_usuario ? b.correo_usuario.length : 0;
                return lengthA - lengthB;
            },
            ...getColumnSearchProps('correo_usuario'),
        },
        {
        title: "Departamento",
        key: "depar_usuario",
        dataIndex: "depar_usuario",
        sorter: (a, b) => {
          const lengthA = a.depar_usuario ? a.depar_usuario.length : 0;
          const lengthB = b.depar_usuario ? b.depar_usuario.length : 0;
          return lengthA - lengthB;
        },
        render: (depar_usuario) => departamentosMap[depar_usuario],
        },
        // Luego, en tu renderizador de la columna, puedes usar este mapa para mostrar el nombre de la dirección:
        {
          title: "Dirección",
          key: "depar_usuario",
          dataIndex: "depar_usuario",
          sorter: (a, b) => {
            const lengthA = a.depar_usuario ? a.depar_usuario.length : 0;
            const lengthB = b.depar_usuario ? b.depar_usuario.length : 0;
            return lengthA - lengthB;
          },
          render: (depar_usuario) => mapDirecciones[depar_usuario] || "Dirección no encontrada",
        },
        {
          title: "Rol",
          key: "id_usuario",
          dataIndex: "id_usuario",
          sorter: (a, b) => {
            const lengthA = a.id_usuario ? a.id_usuario.length : 0;
            const lengthB = b.id_usuario ? b.id_usuario.length : 0;
            return lengthA - lengthB;
          },
          render: (id_usuario) => {
            const rolUsuario = accesosUsuarios.find(rolUsuario => rolUsuario.usuario === id_usuario);
            const rol = rolUsuario ? roles.find(rol => rol.id_rol === rolUsuario.rol) : null;
            return rol ? rol.nombre_rol : 'Rol no encontrado';
          },
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
                message="El usuario se eliminó correctamente"
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
                    <Title level={4} className="titleTable2" >Mis Usuarios</Title>
                    <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                        <NavLink to="/panel">
                        <Button className="btnCrearProceso" type="primary" title="Regresar">
                            <span className="iconWrapper">
                            <RiArrowGoBackFill />
                            </span>
                        </Button>
                        </NavLink>
                        <NavLink to="/incluir-usuarios">
                        <Button className="btnCrearProceso" type="primary" title="Crear Usuario">
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
                        dataSource={usuarios}
                        pagination={true}
                        className="ant-border-space"
                        style={{ whiteSpace: 'nowrap' }}
                        rowKey="id_usuario"
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
  
  export default Usuarios;