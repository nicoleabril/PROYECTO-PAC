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
  import { Typography, Modal } from 'antd'; 
  import { Container } from 'reactstrap';
  import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleFilled} from "@ant-design/icons";
  import Highlighter from 'react-highlight-words';
  import { RiArrowGoBackFill } from "react-icons/ri";
  import { FiPlus, FiMinus } from "react-icons/fi";
  
  const { confirm } = Modal;
  const { Title } = Typography; // Usa Typography de antd para el título
  
  function Resoluciones_Reformas() {
    const history = useHistory();
    const [idDireccion, setIdDireccion] = useState([]);
    const [idDepartamento, setIdDepartamento] = useState([]);
    const [procesosSinRevision, setProcesosSinRevision] = useState([]);
    const [procesosConRevision, setProcesosConRevision] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
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
    const regresar_Inicio = () => {
      window.history.back();
    };

    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };
  
    const recargar_ventana = () => {
        window.location.reload();
      };


      const obtenerResolucionesPendientes = async () => {
        const username = Cookies.get('usr');
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_resoluciones/Pendiente`);
            const response2 = await Axios.get(`http://localhost:5000/obtener_resoluciones/Firmada`);
            const response3 = await Axios.get(`http://localhost:5000/obtener_resoluciones/Iniciado`);
            // Verificar si los responses no están vacíos antes de concatenar
            const procesosConcatenados = [];
            if (response.data.length > 0) {
                procesosConcatenados.push(...response.data);
            }
            if (response2.data.length > 0) {
                procesosConcatenados.push(...response2.data);
            }
            if (response3.data.length > 0) {
              procesosConcatenados.push(...response3.data);
          }
            
            setProcesosSinRevision(procesosConcatenados);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };
    

    const obtenerResolucionesAplicadas = async () => {
        const username = Cookies.get('usr');
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_resoluciones/Aplicada`);
            if (response.data.length > 0) {
              setProcesosConRevision(response.data);
            }
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };
  
      useEffect(() => {
        obtenerResolucionesPendientes();
        obtenerResolucionesAplicadas();
    }, []);
      
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
  
    
    const editar_reforma = (id) => {
      localStorage.setItem('idResolucion', id);
      history.push('/editar-resolucion');
    };

    const detalle_reforma = (id) => {
      localStorage.setItem('idResolucion', id);
      history.push('/visualizar-resoluciones');
    };
  
    const columnas = [
      {
        title: '',
        key: 'editar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => editar_reforma(registro.secuencial_resolucion)} >
            <a><EditOutlined  title="Modificar Resolucion" /></a>
          </Typography.Link>
        ),
        width:50,
      },
      {
          title: "Resolución",
          key: "secuencial_resolucion",
          dataIndex: "secuencial_resolucion",
          sorter: (a, b) => {
            const lengthA = a.secuencial_resolucion ? a.secuencial_resolucion : 0;
            const lengthB = b.secuencial_resolucion ? b.secuencial_resolucion : 0;
            return lengthA - lengthB;
          },
          ...getColumnSearchProps('secuencial_resolucion'),
      },
      {
          title: "Código Resolución",
          key: "nro_sol_resol",
          dataIndex: "nro_sol_resol",
          sorter: (a, b) => a.nro_sol_resol.length - b.nro_sol_resol.length,
          ...getColumnSearchProps('nro_sol_resol'),
      },
      {
        title: "Fecha Solicitada",
        key: "fch_solicitada",
        dataIndex: "fch_solicitada",
        sorter: (a, b) => a.fch_solicitada.length - b.fch_solicitada.length,
    },
      {
          title: "Usuario Solicitante",
          key: "usr_solicita",
          dataIndex: "usr_solicita",
          sorter: (a, b) => a.usr_solicita.length - b.usr_solicita.length,
      },
      {
          title: "Fecha Carga Documento",
          key: "fch_carga_documento",
          dataIndex: "fch_carga_documento",
          sorter: (a, b) => a.fch_carga_documento.length - b.fch_carga_documento.length,
      },
      {
        title: "Resolución",
        key: "url_resolucion",
        dataIndex: "url_resolucion",
        render: (_, registro) => (
          <>
            {registro.url_resolucion !== null && (
              <Typography.Link>
                <a
                  href={URL.createObjectURL(new Blob([new Uint8Array(registro.url_resolucion.data)], { type: 'application/pdf' }))}
                  download="Resolucion.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver/Descargar
                </a>
              </Typography.Link>
            )}
          </>
        ),        
        },
      {
          title: "Detalle Reforma",
          key: "url_detalle_resol",
          dataIndex: "url_detalle_resol",
          render: (_, registro) => (
            <Typography.Link >
                <a
                    href={URL.createObjectURL(new Blob([new Uint8Array(registro.url_detalle_resol.data)], { type: 'application/pdf' }))}
                    download="DetalleReforma.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Ver/Descargar
                </a>
            </Typography.Link>
          ),
      },
    ];

    const columnasAplicadas = [
      {
        title: '',
        key: 'visualizar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => detalle_reforma(registro.secuencial_resolucion)} >
            <a><EyeOutlined  title="Ver Detalle Reforma" /></a>
          </Typography.Link>
        ),
        width:50,
      },
      {
          title: "Resolución",
          key: "secuencial_resolucion",
          dataIndex: "secuencial_resolucion",
          sorter: (a, b) => {
            const lengthA = a.secuencial_resolucion ? a.secuencial_resolucion : 0;
            const lengthB = b.secuencial_resolucion ? b.secuencial_resolucion : 0;
            return lengthA - lengthB;
          },
          ...getColumnSearchProps('secuencial_resolucion'),
      },
      {
          title: "Código Resolución",
          key: "nro_sol_resol",
          dataIndex: "nro_sol_resol",
          sorter: (a, b) => a.nro_sol_resol.length - b.nro_sol_resol.length,
          ...getColumnSearchProps('nro_sol_resol'),
      },
      {
        title: "Fecha Solicitada",
        key: "fch_solicitada",
        dataIndex: "fch_solicitada",
        sorter: (a, b) => a.fch_solicitada.length - b.fch_solicitada.length,
    },
      {
          title: "Usuario Solicitante",
          key: "usr_solicita",
          dataIndex: "usr_solicita",
          sorter: (a, b) => a.usr_solicita.length - b.usr_solicita.length,
      },
      {
          title: "Fecha Carga Documento",
          key: "fch_carga_documento",
          dataIndex: "fch_carga_documento",
          sorter: (a, b) => a.fch_carga_documento.length - b.fch_carga_documento.length,
      },
      {
        title: "Resolución",
        key: "url_resolucion",
        dataIndex: "url_resolucion",
        render: (_, registro) => (
          <>
            {registro.url_resolucion !== null && (
              <Typography.Link>
                <a
                  href={URL.createObjectURL(new Blob([new Uint8Array(registro.url_resolucion.data)], { type: 'application/pdf' }))}
                  download="Resolucion.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver/Descargar
                </a>
              </Typography.Link>
            )}
          </>
        ),        
        },
      {
          title: "Detalle Reforma",
          key: "url_detalle_resol",
          dataIndex: "url_detalle_resol",
          render: (_, registro) => (
            <Typography.Link >
                <a
                    href={URL.createObjectURL(new Blob([new Uint8Array(registro.url_detalle_resol.data)], { type: 'application/pdf' }))}
                    download="DetalleReforma.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Ver/Descargar
                </a>
            </Typography.Link>
          ),
      },
    ];
  
    return (
        <div>
        <Container className="contenedorTitleTable" fluid>
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: 'fit-content' }}>
              <div className="titleTable">
                <Title level={4} className="titleTable2" >Resolución Pendiente</Title>
                <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                  <NavLink to="/panel">
                    <Button className="btnCrearProceso" type="primary" title="Regresar">
                      <span className="iconWrapper">
                        <RiArrowGoBackFill />
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
                      dataSource={procesosSinRevision}
                      pagination={true}
                      className="ant-border-space"
                      style={{ whiteSpace: 'nowrap' }}
                      rowKey="secuencial_resolucion"
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
                <Title level={4} className="titleTable2" >Resoluciones Aplicadas</Title>
              </div>
              </Card>
            </Col>
          </Row>
        </Container>
        <div
          className="contenedorTabla">
          <Container className="mt--90" fluid>
            <Row gutter={[24, 0]}>
              <Col xs={24} xl={24}>
                <Card bordered={false} className="criclebox tablespace mb-24">
                  <div className="table-responsive">
                    <Table
                      columns={columnasAplicadas}
                      dataSource={procesosConRevision}
                      pagination={true}
                      className="ant-border-space"
                      style={{ whiteSpace: 'nowrap' }}
                      rowKey="secuencial_resolucion"
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
  
  export default Resoluciones_Reformas;