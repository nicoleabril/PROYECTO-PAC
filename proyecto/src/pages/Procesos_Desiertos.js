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
  
  function Procesos_Desiertos() {
    const history = useHistory();
    const [mensaje, setMensaje] = useState('');
    const [procesos, setProcesos] = useState([]);
    const [procesosPreparatorios, setProcesosPreparatorios] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
      const [successVisible, setSuccessVisible] = useState(false);
    const searchInput = useRef(null);
  
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
  
    const handleIniciarFasePreparatoria = async (id) => {
      try {
        await Axios.post('http://localhost:5000/cambiar_fase_preparatoria/',{
        estadoNuevo: 'ELABORACIÓN DOCUMENTOS PREPARATORIOS', 
        pac_fase_preparatoria_pk:id });
        setProcesos(procesos.filter(proceso => proceso.pac_fase_preparatoria_pk !== id));
        setMensaje('Fase Preparatoria iniciada correctamente.')
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 3000);
      } catch (error) {
        setMensaje('Ocurrió un fallo al colocar desierto el proceso.')
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
        console.error('Error al enviar archivos:', error);
      }
    };
  
    const showFaseConfirm = (id) => {
      confirm({
        title: '¿Está seguro de iniciar fase preparatoria?',
        icon: <ExclamationCircleFilled />,
        okText: 'Sí',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          handleIniciarFasePreparatoria(id);
          //handleSubmitGuardar();
        },
        onCancel() {
          console.log('No guardar');
        },
      });
  };
  
    useEffect(() => {
      const obtenerProcesos = async () => {
        const username = Cookies.get('usr');
        const rol = Cookies.get('rol');
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_procesos/${username}/${rol}`);
            setProcesos(response.data);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
      };
  
      const obtenerProcesosPreparatorios = async () => {
        const valor = 'PUBLICADO - DESIERTO';
        const valorCodificado = encodeURIComponent(valor);
        const username = Cookies.get('usr');
        const rol = Cookies.get('rol');
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_procesos_desiertos`);
            setProcesosPreparatorios(response.data);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
      };
      obtenerProcesosPreparatorios();
      obtenerProcesos();
    }, []);
  
  
    const detalle_reforma = (id) => {
      localStorage.setItem('id', id);
      localStorage.setItem('tabla', 'procesos')
      history.push('/visualizar-procesos');
    };
    
  
    const columnas = [
      {
        title: '',
        key: 'visualizar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => detalle_reforma(registro.pac_fase_preparatoria_pk)} >
              <a><EyeOutlined title="Visualizar Proceso" /></a>
          </Typography.Link>
        ),
        width:100,
      },  
      {
          title: "Código Proceso",
          key: "codigo_proceso",
          dataIndex: "codigo_proceso",
          sorter: (a, b) => {
            const lengthA = a.codigo_proceso ? a.codigo_proceso.length : 0;
            const lengthB = b.codigo_proceso ? b.codigo_proceso.length : 0;
            return lengthA - lengthB;
          },
          ...getColumnSearchProps('codigo_proceso'),
      },
      {
          title: "Objeto Contratación",
          key: "detalle_producto",
          dataIndex: "detalle_producto",
          sorter: (a, b) => a.detalle_producto.length - b.detalle_producto.length,
          ...getColumnSearchProps('detalle_producto'),
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
          title: "Partida Presupuestaria",
          key: "partida_presupuestaria",
          dataIndex: "partida_presupuestaria",
          sorter: (a, b) => a.partida_presupuestaria.length - b.partida_presupuestaria.length,
      },
      {
          title: "Dirección",
          key: "direccion",
          dataIndex: "direccion",
          sorter: (a, b) => a.direccion.length - b.direccion.length,
      },
      {
          title: "Departamento",
          key: "id_departamento",
          dataIndex: "id_departamento",
          sorter: (a, b) => a.id_departamento.length - b.id_departamento.length,
      },
      {
          title: "Año",
          key: "año",
          dataIndex: "año",
          sorter: (a, b) => a.año - b.año,
      },
    ];
  
    const columnasFasePreparatoria = [
      {
        title: '',
        key: 'visualizar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => detalle_reforma(registro.pac_fase_preparatoria_pk)} >
              <a><EyeOutlined title="Visualizar Proceso" /></a>
          </Typography.Link>
        ),
        width:100,
      }, 
      {
          title: "Código Proceso",
          key: "codigo_proceso",
          dataIndex: "codigo_proceso",
          sorter: (a, b) => {
            const lengthA = a.codigo_proceso ? a.codigo_proceso.length : 0;
            const lengthB = b.codigo_proceso ? b.codigo_proceso.length : 0;
            return lengthA - lengthB;
          },
          ...getColumnSearchProps('codigo_proceso'),
      },
      {
          title: "Objeto Contratación",
          key: "detalle_producto",
          dataIndex: "detalle_producto",
          sorter: (a, b) => a.detalle_producto.length - b.detalle_producto.length,
          ...getColumnSearchProps('detalle_producto'),
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
          title: "Partida Presupuestaria",
          key: "partida_presupuestaria",
          dataIndex: "partida_presupuestaria",
          sorter: (a, b) => a.partida_presupuestaria.length - b.partida_presupuestaria.length,
      },
      {
          title: "Dirección",
          key: "direccion",
          dataIndex: "direccion",
          sorter: (a, b) => a.direccion.length - b.direccion.length,
      },
      {
          title: "Departamento",
          key: "id_departamento",
          dataIndex: "id_departamento",
          sorter: (a, b) => a.id_departamento.length - b.id_departamento.length,
      },
      {
          title: "Año",
          key: "año",
          dataIndex: "año",
          sorter: (a, b) => a.año - b.año,
      },
    ];
  
    const onChange = (e) => console.log(`radio checked:${e.target.value}`);
  
  
    return (
      <div>
        <Container className="contenedorTitleTable" fluid>
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: 'fit-content' }}>
              <div className="titleTable">
                <Title level={4} className="titleTable2" >Procesos Desiertos SERCOP</Title>
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
                      dataSource={procesos}
                      pagination={{ pageSize: 5 }}
                      className="ant-border-space"
                      style={{ whiteSpace: 'nowrap' }}
                      rowKey="pac_fase_preparatoria_pk"
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
                <Title level={4} className="titleTable2" >Procesos Declarados Desiertos</Title>
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
                      columns={columnasFasePreparatoria}
                      dataSource={procesosPreparatorios}
                      pagination={{ pageSize: 5 }}
                      className="ant-border-space"
                      style={{ whiteSpace: 'nowrap' }}
                      rowKey="pac_fase_preparatoria_pk"
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
  
  export default Procesos_Desiertos;
  