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
  import { HiDocumentPlus,HiDocumentMinus,HiDocumentCheck,HiDocumentMagnifyingGlass, HiDocumentArrowUp   } from "react-icons/hi2";
  const { confirm } = Modal;
  const { Title } = Typography; // Usa Typography de antd para el título
  
  function Autorizacion_Reformas() {
    const history = useHistory();
    const [procesosConRevision, setProcesosConRevision] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
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
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_reformas_a_autorizar/`);
            setProcesosConRevision(response.data);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
    };
  
      useEffect(() => {
        obtenerProcesosConRevision();
    }, []);
      

    const generarPDF = async () => {
        const resoluciones = obtenerResolucionesAutorizadas();
        try {
            const response = await fetch('http://localhost:5000/generar_detalle_reforma', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ datos: resoluciones }),
            });
    
            if (!response.ok) {
                throw new Error('Error al generar el PDF');
            }
            const blob = await response.blob();
            // Crear un enlace para la descarga del PDF
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'output.pdf';
            link.click();
            return blob;
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };

    const obtener_id_resolucion = async () => {
        try {
            const response = await Axios.get('http://localhost:5000/obtener_id_resolucion');
            console.log(response.data.nextval);
            return response.data.nextval;
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerResolucionesAutorizadas = () => {
        const autorizados = [];
        for (let elemento of procesosConRevision) {
            if(elemento.estado_autorizador === 'Autorizado'){
                autorizados.push(elemento);
            }
        }
        console.log(autorizados);
        return autorizados;
    }

    const solicitarResolucion = async (id_resolucion) => {
        const resoluciones = obtenerResolucionesAutorizadas();
        for (let elemento of resoluciones) {
            try {
                const response_data = await Axios.post(`http://localhost:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_autorizador', estadoNuevo:'Completado', secuencial_reforma:elemento.secuencial_reforma});
                const secuencial_data = await Axios.post(`http://localhost:5000/actualizarSecuencial`, {secuencial_resolucion:parseInt(id_resolucion), secuencial_reforma:elemento.secuencial_reforma});
                setProcesosConRevision(procesosConRevision.filter(proceso => proceso.secuencial_reforma !== elemento.secuencial_reforma));
            } catch (error) {
                    console.error('Error al solicitar resolucion:', error);
            }
            
        }
    }

    const crearResolucion = async () => {
        const resoluciones = obtenerResolucionesAutorizadas();
        if (resoluciones.length !== 0) {
            const id_resolucion = await obtener_id_resolucion();
            const archivoGenerado = await generarPDF();
            try {
                if (archivoGenerado !== null) {
                    
                    const formData = new FormData();
                    formData.append('secuencial_resolucion', parseInt(id_resolucion));
                    formData.append('fch_solicitada', new Date().toISOString());
                    formData.append('usr_solicita', Cookies.get('usr'));
                    formData.append('estado', 'Pendiente');
                    formData.append('url_detalle_resol', archivoGenerado);

                    const response = await Axios.post('http://localhost:5000/registrarResolucion', formData);
                    console.log(response.data.message);
                    // Resto de tu código
                    await solicitarResolucion(id_resolucion);
                }
            } catch (error) {
                console.error('Error al crear resolucion:', error);
            }
        } else {
            setMensaje("Primero autorice las resoluciones")
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 3000);
        } 
    };
    

    const autorizarTodo = async () => {
        let response_data=[];
        try {
            if(procesosConRevision.length!== 0){
                for (let elemento of procesosConRevision) {
                    response_data = await Axios.post(`http://localhost:5000/cambiarEstadoReforma`, {estadoACambiar:'estado_autorizador', estadoNuevo:'Autorizado', secuencial_reforma:elemento.secuencial_reforma});
                }  
                setMensaje("Reformas autorizadas correctamente")
                setSuccessVisible(true);
                setTimeout(() => setSuccessVisible(false), 3000);
                obtenerProcesosConRevision();
            }else{
                setMensaje("No existen reformas para autorizar");
                setErrorVisible(true);
                setTimeout(() => setErrorVisible(false), 3000);
            }
        } catch (error) {
            setMensaje("Ocurrió un problema al autorizar las reformas")
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 3000);
            console.error('Error al cambiar estado de Reforma:', error);
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
      localStorage.setItem('id', id);
      history.push('/editar-procesos');
    };
  
    const detalle_reforma = (id) => {
      localStorage.setItem('id', id);
      localStorage.setItem('tabla', 'procesos');
      localStorage.setItem('proceso', 'autorizar');
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


    const showAutorizarConfirm = () => {
        confirm({
          title: '¿Está seguro de autorizar todo?',
          icon: <ExclamationCircleFilled />,
          okText: 'Sí',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            autorizarTodo();
          },
          onCancel() {
            console.log('No borrar usuario');
          },
        });
    };
  
    const showResolucionConfirm = () => {
        confirm({
          title: '¿Está seguro de solicitar resolución?',
          icon: <ExclamationCircleFilled />,
          okText: 'Sí',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            crearResolucion();
          },
          onCancel() {
            console.log('No borrar usuario');
          },
        });
    };
  
    return (
        <div>
        <Container className="contenedorTitleTable" fluid>
          <Row gutter={[24, 0]}>
            <Col xs={24} xl={24}>
            <Card bordered={false} className="criclebox tablespace mb-24" style={{ height: 'fit-content' }}>
              <div className="titleTable">
                <Title level={4} className="titleTable2" >Reformas por Autorizar</Title>
                <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                  <NavLink to="/panel">
                    <Button className="btnCrearProceso" type="primary" title="Regresar">
                      <span className="iconWrapper">
                        <RiArrowGoBackFill />
                      </span>
                    </Button>
                  </NavLink>
                  <Button className="btnCrearProceso" type="primary" title="Solicitar Resolución" onClick={showResolucionConfirm}>
                      <span className="iconWrapper">
                        <HiDocumentCheck />
                      </span>
                  </Button>
                  <Button className="btnCrearProceso" type="primary" title="Autorizar Todo" onClick={showAutorizarConfirm}>
                      <span className="iconWrapper">
                        <HiDocumentArrowUp />
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
  
  export default Autorizacion_Reformas;