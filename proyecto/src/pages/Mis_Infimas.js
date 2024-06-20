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
  
  function Mis_Infimas() {
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
  
  
    useEffect(() => {
      const obtenerProcesos = async () => {
        const username = Cookies.get('usr');
        const rol = Cookies.get('rol');
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_infimas_cuantias/${username}/${rol}`);
            setProcesos(response.data);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
      };
  
      const obtenerProcesosPreparatorios = async () => {
        const user = Cookies.get('usr');
        const rol = Cookies.get('rol');
        const valor = 'ELABORACIÓN DOCUMENTOS PREPARATORIOS';
        const valorCodificado = encodeURIComponent(valor);
        try {
          const userResponse = await Axios.get(`http://localhost:5000/obtener_info_user/${user}`);
          const idDepartamento = userResponse.data[0].depar_usuario;

          const response = await Axios.get(`http://localhost:5000/obtener_fase_preparatoria_infimas/${valorCodificado}/${idDepartamento}/${rol}/${user}`);
          setProcesosPreparatorios(response.data);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
        }
      };
      obtenerProcesosPreparatorios();
      obtenerProcesos();
    }, []);
  
  
    const editar_reforma = (id) => {
      localStorage.setItem('idInfima', id);
      localStorage.setItem('fase', 'Documentos Preparatorios');
      history.push('/subir-documentos-infima');
    };
  
    const eliminar_reforma = async (id) => {
      try {
        const response = await Axios.post(`http://localhost:5000/borrarInfima`, {id_infima: id});
        console.log('Respuesta del servidor:', response.data);
        setProcesos(procesos.filter(proceso => proceso.id_infima !== id));
        setMensaje("Ínfima eliminada correctamente");
        setSuccessVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
      } catch (error) {
          console.error('Error al eliminar Ínfima:', error);
          setMensaje("Ocurrió un problema al eliminar la ínfima");
          setErrorVisible(true);
          setTimeout(() => setSuccessVisible(false), 3000);
      }
    };

    const showDeleteConfirm = (id) => {
      confirm({
          title: '¿Está seguro de borrar esta ínfima?',
          icon: <ExclamationCircleFilled />,
          okText: 'Sí',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
              eliminar_reforma(id);
          },
          onCancel() {
              console.log('No borrar ínfima');
          },
      });
  };
  
  
    const detalle_reforma = (id) => {
      localStorage.setItem('idInfima', id);
      history.push('/visualizar-infimas');
    };

    const reasignar_responsable = (id) => {
      localStorage.setItem('idInfima', id);
      history.push('/reasignar-responsables');
    };
    
  
    const columnas = [
      {
        title: '',
        key: 'visualizar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => detalle_reforma(registro.id_infima)} >
              <a><EyeOutlined title="Visualizar Proceso" /></a>
          </Typography.Link>
        ),
        width:100,
      },
      {
        title: '',
        key: 'eliminar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => showDeleteConfirm(registro.id_infima)} >
            <a><DeleteOutlined title="Borrar Proceso" /></a>
          </Typography.Link>
        ),
        width:100,
      },   
      {
          title: "Nro.",
          key: "row_number",
          dataIndex: "row_number",
          sorter: (a, b) => {
            const lengthA = a.row_number ? a.row_number.length : 0;
            const lengthB = b.row_number ? b.row_number.length : 0;
            return lengthA - lengthB;
          },
          ...getColumnSearchProps('row_number'),
      },
      {
          title: "Dirección",
          key: "nombre_direccion",
          dataIndex: "nombre_direccion",
          sorter: (a, b) => a.nombre_direccion.length - b.nombre_direccion.length,
          ...getColumnSearchProps('nombre_direccion'),
      },
      {
          title: "Partida Presupuestaria",
          key: "partida_presupuestaria",
          dataIndex: "partida_presupuestaria",
          sorter: (a, b) => a.partida_presupuestaria.length - b.partida_presupuestaria.length,
      },
      {
          title: "CPC",
          key: "cpc",
          dataIndex: "cpc",
          sorter: (a, b) => a.cpc.length - b.cpc.length,
      },
      {
          title: "Tipo Compra",
          key: "tipo_compra",
          dataIndex: "tipo_compra",
          sorter: (a, b) => a.tipo_compra.length - b.tipo_compra.length,
      },
      {
          title: "Objeto Contratación",
          key: "detalle_producto",
          dataIndex: "detalle_producto",
          sorter: (a, b) => a.detalle_producto.length - b.detalle_producto.length,
      },
      {
        title: "Cantidad",
        key: "cantidad",
        dataIndex: "cantidad",
        sorter: (a, b) => a.cantidad.length - b.cantidad.length,
        },
        {
            title: "Unidad",
            key: "unidad",
            dataIndex: "unidad",
            sorter: (a, b) => a.unidad.length - b.unidad.length,
        },
        {
            title: "Costo Unitario",
            key: "costo_unitario",
            dataIndex: "costo_unitario",
            sorter: (a, b) => a.costo_unitario - b.costo_unitario,
        },
        {
            title: "Total",
            key: "total",
            dataIndex: "total",
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: "Fecha Inicio Estado",
            key: "fecha_inicio_estado",
            dataIndex: "fecha_inicio_estado",
            sorter: (a, b) => a.fecha_inicio_estado - b.fecha_inicio_estado,
        },
        {
            title: "Estado",
            key: "estado",
            dataIndex: "estado",
            sorter: (a, b) => a.estado.length - b.estado.length,
        },
        {
          title: "Oferente Adjudicado",
          key: "oferente_adjudicado",
          dataIndex: "oferente_adjudicado",
          sorter: (a, b) => a.oferente_adjudicado.length - b.oferente_adjudicado.length,
        },
        {
          title: "Elaborador",
          key: "elaborador",
          dataIndex: "elaborador",
          sorter: (a, b) => a.elaborador.length - b.elaborador.length,
        },
        {
          title: "Aprobador",
          key: "aprobador",
          dataIndex: "aprobador",
          sorter: (a, b) => a.aprobador.length - b.aprobador.length,
        },
        {
          title: "Revisor de Compras",
          key: "revisor_compras",
          dataIndex: "revisor_compras",
          sorter: (a, b) => a.revisor_compras.length - b.revisor_compras.length,
        },
    ];

    const columnasFasePreparatoria = [
      {
        title: '',
        key: 'visualizar',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => detalle_reforma(registro.id_infima)} >
              <a><EyeOutlined title="Visualizar Proceso" /></a>
          </Typography.Link>
        ),
        width:100,
      }, 
      {
        title: '',
        key: 'responsable',
        fixed: 'left',
        render: (_, registro) => (
          <Typography.Link onClick={() => reasignar_responsable(registro.id_infima)} >
              <a>Reasignar Responsables</a>
          </Typography.Link>
        ),
        width:100,
      },   
      {
          title: "Nro.",
          key: "id_infima",
          dataIndex: "id_infima",
          sorter: (a, b) => {
            const lengthA = a.id_infima ? a.id_infima.length : 0;
            const lengthB = b.id_infima ? b.id_infima.length : 0;
            return lengthA - lengthB;
          },
          ...getColumnSearchProps('row_number'),
      },
      {
          title: "Dirección",
          key: "nombre_direccion",
          dataIndex: "nombre_direccion",
          sorter: (a, b) => a.nombre_direccion.length - b.nombre_direccion.length,
          ...getColumnSearchProps('nombre_direccion'),
      },
      {
          title: "Partida Presupuestaria",
          key: "partida_presupuestaria",
          dataIndex: "partida_presupuestaria",
          sorter: (a, b) => a.partida_presupuestaria.length - b.partida_presupuestaria.length,
      },
      {
          title: "CPC",
          key: "cpc",
          dataIndex: "cpc",
          sorter: (a, b) => a.cpc.length - b.cpc.length,
      },
      {
          title: "Tipo Compra",
          key: "tipo_compra",
          dataIndex: "tipo_compra",
          sorter: (a, b) => a.tipo_compra.length - b.tipo_compra.length,
      },
      {
          title: "Objeto Contratación",
          key: "detalle_producto",
          dataIndex: "detalle_producto",
          sorter: (a, b) => a.detalle_producto.length - b.detalle_producto.length,
      },
      {
        title: "Cantidad",
        key: "cantidad",
        dataIndex: "cantidad",
        sorter: (a, b) => a.cantidad.length - b.cantidad.length,
        },
        {
            title: "Unidad",
            key: "unidad",
            dataIndex: "unidad",
            sorter: (a, b) => a.unidad.length - b.unidad.length,
        },
        {
            title: "Costo Unitario",
            key: "costo_unitario",
            dataIndex: "costo_unitario",
            sorter: (a, b) => a.costo_unitario - b.costo_unitario,
        },
        {
            title: "Total",
            key: "total",
            dataIndex: "total",
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: "Fecha Inicio Estado",
            key: "fecha_inicio_estado",
            dataIndex: "fecha_inicio_estado",
            sorter: (a, b) => a.fecha_inicio_estado - b.fecha_inicio_estado,
        },
        {
            title: "Estado",
            key: "estado",
            dataIndex: "estado",
            sorter: (a, b) => a.estado.length - b.estado.length,
        },
        {
          title: "Oferente Adjudicado",
          key: "oferente_adjudicado",
          dataIndex: "oferente_adjudicado",
          sorter: (a, b) => a.oferente_adjudicado.length - b.oferente_adjudicado.length,
        },
        {
          title: "Elaborador",
          key: "elaborador",
          dataIndex: "elaborador",
          sorter: (a, b) => a.elaborador.length - b.elaborador.length,
        },
        {
          title: "Aprobador",
          key: "aprobador",
          dataIndex: "aprobador",
          sorter: (a, b) => a.aprobador.length - b.aprobador.length,
        },
        {
          title: "Revisor de Compras",
          key: "revisor_compras",
          dataIndex: "revisor_compras",
          sorter: (a, b) => a.revisor_compras.length - b.revisor_compras.length,
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
                <Title level={4} className="titleTable2" >Mis Ínfimas Cuantías</Title>
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
                <Title level={4} className="titleTable2" >Seguimiento Ínfimas Cuantías Revisor de Compras</Title>
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
  
  export default Mis_Infimas;
  