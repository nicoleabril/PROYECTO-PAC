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
  import { Typography, Modal, Alert  } from 'antd'; 
  import { Container } from 'reactstrap';
  import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleFilled} from "@ant-design/icons";
  import Highlighter from 'react-highlight-words';
  import { RiArrowGoBackFill } from "react-icons/ri";
  import { FiPlus } from "react-icons/fi";
  const { confirm } = Modal;
  const { Title } = Typography; // Usa Typography de antd para el título
  
  function Reporte_Replanificacion_Procesos() {
    const history = useHistory();
    const [mensaje, setMensaje] = useState('');
    const [procesos, setProcesos] = useState([]);
    const [procesosPreparatorios, setProcesosPreparatorios] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const searchInput = useRef(null);
    const rol = Cookies.get('rol');

    useEffect(() => {
        const obtenerProcesos = async () => {
          try {
              const response = await Axios.get(`http://localhost:5000/obtener_procesos_a_replanificar/PENDIENTE`);
              setProcesos(response.data);
          } catch (error) {
              console.error('Error al obtener procesos:', error);
          }
        };

        const obtenerProcesosAprobados = async () => {
            try {
                const response = await Axios.get(`http://localhost:5000/obtener_procesos_a_replanificar/APROBADO`);
                const response2 = await Axios.get(`http://localhost:5000/obtener_procesos_a_replanificar/DESAPROBADO`);
                const concatenatedData = response.data.concat(response2.data);
                setProcesosPreparatorios(concatenatedData);
            } catch (error) {
                console.error('Error al obtener procesos:', error);
            }
          };
    
        obtenerProcesosAprobados();
        obtenerProcesos();
      }, []);


    const handleScroll = (e) => {
      const container = e.target;
      const maxScrollLeft = container.scrollWidth - container.clientWidth - 30; // 30px de margen derecho
      if (container.scrollLeft > maxScrollLeft) {
        container.scrollLeft = maxScrollLeft;
      }
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

    const detalle_reforma = (id) => {
        localStorage.setItem('idReplanificacion', id);
        localStorage.setItem('verBotones', 'falso');
        history.push('/formulario-replanificacion-proceso');
      };
  
    const editar_reforma = (id) => {
      localStorage.setItem('idReplanificacion', id);
      localStorage.setItem('verBotones', 'verdadero');
      history.push('/formulario-replanificacion-proceso');
    };

    
  
    const columnas = [
        {
            title: '',
            key: 'editar',
            fixed: 'left',
            render: (_, registro) => (
              <Typography.Link onClick={() => editar_reforma(registro.id_replanificacion)} >
                <a><EditOutlined  title="Editar Proceso" /></a>
              </Typography.Link>
            ),
            width:100,
          },  
      {
          title: "Nro.",
          key: "id_replanificacion",
          dataIndex: "id_replanificacion",
          sorter: (a, b) => {
            const lengthA = a.id_replanificacion ? a.id_replanificacion.length : 0;
            const lengthB = b.id_replanificacion ? b.id_replanificacion.length : 0;
            return lengthA - lengthB;
          },
          ...getColumnSearchProps('id_replanificacion'),
      },
      {
          title: "Procedimiento Sugerido",
          key: "procedimiento_sugerido",
          dataIndex: "procedimiento_sugerido",
          sorter: (a, b) => a.procedimiento_sugerido.length - b.procedimiento_sugerido.length,
          ...getColumnSearchProps('procedimiento_sugerido'),
      },
      {
        title: "Tipo Compra",
        key: "tipo_compra",
        dataIndex: "tipo_compra",
        sorter: (a, b) => a.tipo_compra.length - b.tipo_compra.length,
        ...getColumnSearchProps('tipo_compra'),
    },
    {
        title: "Objeto Contratación",
        key: "detalle_producto",
        dataIndex: "detalle_producto",
        sorter: (a, b) => a.detalle_producto.length - b.detalle_producto.length,
        ...getColumnSearchProps('detalle_producto'),
    },
      {
          title: "Fecha Entrega Documentos Actual",
          key: "fecha_eedhA",
          dataIndex: "fecha_eedhA",
          sorter: (a, b) => a.fecha_eedhA.length - b.fecha_eedhA.length,
      },
      {
          title: "Cuatrimestre Actual",
          key: "cuatrimestreA",
          dataIndex: "cuatrimestreA",
          sorter: (a, b) => a.cuatrimestreA.length - b.cuatrimestreA.length,
      },
      {
          title: "Fecha Publicación Actual",
          key: "fecha_publiA",
          dataIndex: "fecha_publiA",
          sorter: (a, b) => a.fecha_publiA.length - b.fecha_publiA.length,
      },
      {
          title: "Fecha Entrega Documentos Nuevo",
          key: "fecha_eedhN",
          dataIndex: "fecha_eedhN",
          sorter: (a, b) => a.fecha_eedhN.length - b.fecha_eedhN.length,
      },
      {
        title: "Cuatrimestre Nuevo",
        key: "cuatrimestreN",
        dataIndex: "cuatrimestreN",
        sorter: (a, b) => a.cuatrimestreN.length - b.cuatrimestreN.length,
        },
        {
            title: "Fecha Publicación Nuevo",
            key: "fecha_publiN",
            dataIndex: "fecha_publiN",
            sorter: (a, b) => a.fecha_publiN - b.fecha_publiN,
        },
        {
            title: "Justificación",
            key: "justificacion",
            dataIndex: "justificacion",
            sorter: (a, b) => a.justificacion.length - b.justificacion.length,
        },
        {
            title: "Estado",
            key: "estado_solicitud",
            dataIndex: "estado_solicitud",
            sorter: (a, b) => a.estado_solicitud.length - b.estado_solicitud.length,
        },
        {
            title: "Usuario Solicitante",
            key: "usuario_solicitante",
            dataIndex: "usuario_solicitante",
            sorter: (a, b) => a.usuario_solicitante.length - b.usuario_solicitante.length,
        }
    ];

    const columnasFasePreparatoria = [  
        {
            title: '',
            key: 'visualizar',
            fixed: 'left',
            render: (_, registro) => (
              <Typography.Link onClick={() => detalle_reforma(registro.id_replanificacion)} >
                  <a><EyeOutlined title="Visualizar Replanificación" /></a>
              </Typography.Link>
            ),
            width:100,
          },
        {
            title: "Nro.",
            key: "id_replanificacion",
            dataIndex: "id_replanificacion",
            sorter: (a, b) => {
              const lengthA = a.id_replanificacion ? a.id_replanificacion.length : 0;
              const lengthB = b.id_replanificacion ? b.id_replanificacion.length : 0;
              return lengthA - lengthB;
            },
            ...getColumnSearchProps('id_replanificacion'),
        },
        {
            title: "Procedimiento Sugerido",
            key: "procedimiento_sugerido",
            dataIndex: "procedimiento_sugerido",
            sorter: (a, b) => a.procedimiento_sugerido.length - b.procedimiento_sugerido.length,
            ...getColumnSearchProps('procedimiento_sugerido'),
        },
        {
          title: "Tipo Compra",
          key: "tipo_compra",
          dataIndex: "tipo_compra",
          sorter: (a, b) => a.tipo_compra.length - b.tipo_compra.length,
          ...getColumnSearchProps('tipo_compra'),
      },
      {
          title: "Objeto Contratación",
          key: "detalle_producto",
          dataIndex: "detalle_producto",
          sorter: (a, b) => a.detalle_producto.length - b.detalle_producto.length,
          ...getColumnSearchProps('detalle_producto'),
      },
        {
            title: "Fecha Entrega Documentos Actual",
            key: "fecha_eedhA",
            dataIndex: "fecha_eedhA",
            sorter: (a, b) => a.fecha_eedhA.length - b.fecha_eedhA.length,
        },
        {
            title: "Cuatrimestre Actual",
            key: "cuatrimestreA",
            dataIndex: "cuatrimestreA",
            sorter: (a, b) => a.cuatrimestreA.length - b.cuatrimestreA.length,
        },
        {
            title: "Fecha Publicación Actual",
            key: "fecha_publiA",
            dataIndex: "fecha_publiA",
            sorter: (a, b) => a.fecha_publiA.length - b.fecha_publiA.length,
        },
        {
            title: "Fecha Entrega Documentos Nuevo",
            key: "fecha_eedhN",
            dataIndex: "fecha_eedhN",
            sorter: (a, b) => a.fecha_eedhN.length - b.fecha_eedhN.length,
        },
        {
          title: "Cuatrimestre Nuevo",
          key: "cuatrimestreN",
          dataIndex: "cuatrimestreN",
          sorter: (a, b) => a.cuatrimestreN.length - b.cuatrimestreN.length,
          },
          {
              title: "Fecha Publicación Nuevo",
              key: "fecha_publiN",
              dataIndex: "fecha_publiN",
              sorter: (a, b) => a.fecha_publiN - b.fecha_publiN,
          },
          {
              title: "Justificación",
              key: "justificacion",
              dataIndex: "justificacion",
              sorter: (a, b) => a.justificacion.length - b.justificacion.length,
          },
          {
              title: "Estado",
              key: "estado_solicitud",
              dataIndex: "estado_solicitud",
              sorter: (a, b) => a.estado_solicitud.length - b.estado_solicitud.length,
          },
          {
              title: "Usuario Solicitante",
              key: "usuario_solicitante",
              dataIndex: "usuario_solicitante",
              sorter: (a, b) => a.usuario_solicitante.length - b.usuario_solicitante.length,
          }
    ];
  
    const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  
  
    return (
      <div>
        <Container className="contenedorTitleTable" fluid>
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: 'fit-content' }}>
              <div className="titleTable">
                <Title level={4} className="titleTable2" >Reporte Solicitudes Pendientes</Title>
                <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                  <NavLink to="/panel">
                    <Button className="btnCrearProceso" type="primary" title="Regresar">
                      <span className="iconWrapper">
                        <RiArrowGoBackFill />
                      </span>
                    </Button>
                  </NavLink>
                  <NavLink to="/incluir-ínfimas-cuantías">
                    <Button className="btnCrearProceso" type="primary" title="Iniciar Ínfima Cuantía">
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
          className="contenedorTabla"
          style={{ overflowX: 'auto' }}
          onScroll={handleScroll}
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
                  <div className="table-responsive">
                    <Table
                      columns={columnas}
                      dataSource={procesos}
                      pagination={{ pageSize: 5 }}
                      className="ant-border-space"
                      style={{ whiteSpace: 'nowrap' }}
                      rowKey="row_number"
                    />
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
                <Title level={4} className="titleTable2" >Reporte Histórico</Title>
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
        {rol === 'Administrador' && (
          <Container className="mt--90" fluid>
            <Row gutter={[24, 0]}>
              <Col xs={24} xl={24}>
                <Card bordered={false} className="criclebox tablespace mb-24">
                  <div className="table-responsive">
                    <Table
                      columns={columnasFasePreparatoria}
                      dataSource={procesosPreparatorios}
                      pagination={{ pageSize: 5 }}
                      className="ant-border-space"
                      style={{ whiteSpace: 'nowrap' }}
                      rowKey="id_infima"
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
        </div>
      </div>
    );
    
    
  }
  
  export default Reporte_Replanificacion_Procesos;
  