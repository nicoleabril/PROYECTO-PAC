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
  import { FiPlus } from "react-icons/fi";
  import { HiDocumentPlus,HiDocumentMinus,HiDocumentCheck,HiDocumentMagnifyingGlass  } from "react-icons/hi2";
  const { confirm } = Modal;
  const { Title } = Typography; // Usa Typography de antd para el título
  
  function Revision_Reformas() {
    const history = useHistory();
    const [idDireccion, setIdDireccion] = useState([]);
    const [idDepartamento, setIdDepartamento] = useState([]);
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
  
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };
  
    const recargar_ventana = () => {
        window.location.reload();
      };

      const obtenerProcesosConRevision = async () => {
        const rol = Cookies.get('rol');
        const username = Cookies.get('usr');
        try {
            const userResponse = await Axios.get(`http://localhost:5000/obtener_info_user/${username}`);
            const idDepartamento = userResponse.data[0].depar_usuario;
            const departamentoResponse = await Axios.get(`http://localhost:5000/obtener_departamento_user/${idDepartamento}`);
            const idDireccion = departamentoResponse.data[0].id_direccion;
            const response = await Axios.get(`http://localhost:5000/obtener_reformas_a_revisar/${rol}/${idDepartamento}/${idDireccion}`);
            setIdDepartamento(idDepartamento);
            setIdDireccion(idDireccion);
            setProcesosConRevision(response.data);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };

      useEffect(() => {
        obtenerProcesosConRevision();
    }, []);
      
    const mandarReformaAAprobar = async () => {
        if(filaSeleccionada!=null){
          try {
            const response = await Axios.post(`http://localhost:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_revisor', estadoNuevo:'Finalizado', secuencial_reforma:filaSeleccionada.secuencial_reforma});
            const response2 = await Axios.post(`http://localhost:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_aprobador', estadoNuevo:'Iniciado', secuencial_reforma:filaSeleccionada.secuencial_reforma});
            console.log('Respuesta del servidor:', response.data);
            setProcesosConRevision(procesosConRevision.filter(proceso => proceso.secuencial_reforma !== filaSeleccionada.secuencial_reforma));
            setMensaje("Reforma colocada en aprobación correctamente")
            setSuccessVisible(true);
            setTimeout(() => setSuccessVisible(false), 3000);
            obtenerProcesosConRevision();
          } catch (error) {
            setMensaje("Ocurrió un problema al colocar la reforma en aprobación")
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 3000);
            console.error('Error al cambiar estado de Reforma:', error);
          }
        }else{
            setMensaje("Por favor, escoja una reforma")
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 3000);
        }  
      }

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
      localStorage.setItem('tabla', 'reformas')
      localStorage.setItem('id', id);
      history.push('/editar-procesos');
    };
  
    const detalle_reforma = (id) => {
      localStorage.setItem('id', id);
      localStorage.setItem('proceso', 'null');
      history.push('/visualizar-reformas');
    };

    const eliminarReforma = async (id) => {
        try {
          const response = await Axios.delete(`http://localhost:5000/eliminarFisicaReforma`, {secuencial_reforma: id});
          console.log('Respuesta del servidor:', response.data);
          setProcesosConRevision(procesosConRevision.filter(proceso => proceso.secuencial_reforma !== id));
          setMensaje("Reforma eliminada correctamente");
          setErrorVisible(true);
          setTimeout(() => setErrorVisible(false), 3000);
        } catch (error) {
            console.error('Error al eliminar Reforma:', error);
            setMensaje("Ocurrió un problema al eliminar la reforma");
            setSuccessVisible(true);
            setTimeout(() => setSuccessVisible(false), 3000);
        }
    }

    const showDeleteConfirm = (id) => {
        confirm({
            title: '¿Está seguro de borrar esta reforma?',
            icon: <ExclamationCircleFilled />,
            okText: 'Sí',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                eliminarReforma(id);
            },
            onCancel() {
                console.log('No borrar reforma');
            },
        });
    };
    
  
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
        title: '',
        key: 'editar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => editar_reforma(registro.secuencial_reforma)} >
            <a><EditOutlined  title="Modificar Reforma" /></a>
          </Typography.Link>
        ),
        width:100,
      },
      {
        title: '',
        key: 'eliminar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => showDeleteConfirm(registro.secuencial_reforma)} >
            <a><DeleteOutlined title="Borrar Reforma" /></a>
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

  
    const handleFilaClick = (fila) => {
        setFilaSeleccionada(fila);
    };

    const showAprobacionConfirm = () => {
      if(filaSeleccionada !== null){
        confirm({
          title: '¿Está seguro de mandar esta reforma a aprobación?',
          icon: <ExclamationCircleFilled />,
          okText: 'Sí',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            mandarReformaAAprobar();
          },
          onCancel() {
            console.log('No borrar usuario');
          },
        });
      }else{
        setMensaje("Por favor, escoja una reforma")
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
      }
    };

    return (
        <div>
        <Container className="contenedorTitleTable" fluid>
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: 'fit-content' }}>
              <div className="titleTable">
                <Title level={4} className="titleTable2" >Reformas por Revisar</Title>
                <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                  <NavLink to="/panel">
                    <Button className="btnCrearProceso" type="primary" title="Regresar">
                      <span className="iconWrapper">
                        <RiArrowGoBackFill />
                      </span>
                    </Button>
                  </NavLink>
                    <Button className="btnCrearProceso" type="primary" title="Solicitar Aprobación" onClick={showAprobacionConfirm}>
                      <span className="iconWrapper">
                        <HiDocumentCheck />
                      </span>
                    </Button>
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
                      dataSource={procesosConRevision}
                      pagination={true}
                      className="ant-border-space"
                      style={{ whiteSpace: 'nowrap' }}
                      rowKey="secuencial_reforma"
                      onRow={(fila) => ({
                        onClick: () => handleFilaClick(fila),
                        style: { background: filaSeleccionada === fila ? '#cce5ff' : '' },
                      })}
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
  
  export default Revision_Reformas;