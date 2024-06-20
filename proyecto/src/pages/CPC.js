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
  import { Typography } from 'antd'; 
  import { Container } from 'reactstrap';
  import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined} from "@ant-design/icons";
  import Highlighter from 'react-highlight-words';
  import { RiArrowGoBackFill } from "react-icons/ri";
  import { FiPlus } from "react-icons/fi";
  
  
  
  const { Title } = Typography; // Usa Typography de antd para el título
  
  function CPC() {
    const history = useHistory();
    const [procesos, setProcesos] = useState([]);
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
        try {
            const response = await Axios.get(`http://localhost:5000/obtener_cpc/`);
            setProcesos(response.data);
        } catch (error) {
            console.error('Error al obtener cpc:', error);
        }
      };
  
      obtenerProcesos();
    }, []);
  
  
    const detalle_reforma = (id) => {
      localStorage.setItem('id', id);
      localStorage.setItem('tabla', 'procesos')
      history.push('/visualizar-procesos');
    };
    
  
    const columnas = [
      {
          title: "Código CPC",
          key: "index",
          dataIndex: "index",
          sorter: (a, b) => {
            const lengthA = a.index ? a.index.length : 0;
            const lengthB = b.index ? b.index.length : 0;
            return lengthA - lengthB;
          },
          ...getColumnSearchProps('codigo_proceso'),
      },
      {
          title: "Descripción",
          key: "opcion",
          dataIndex: "opcion",
          sorter: (a, b) => a.opcion.length - b.opcion.length,
          ...getColumnSearchProps('opcion'),
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
                <Title level={4} className="titleTable2" >CPC</Title>
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
          <Container className="mt--90" fluid>
            <Row gutter={[24, 0]}>
              <Col xs={24} xl={24}>
                <Card bordered={false} className="criclebox tablespace mb-24">
                  <div className="table-responsive">
                    <Table
                      columns={columnas}
                      dataSource={procesos}
                      pagination={{ pageSize: 20 }}
                      className="ant-border-space"
                      style={{ whiteSpace: 'nowrap' }}
                      rowKey="index"
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
  
  export default CPC;