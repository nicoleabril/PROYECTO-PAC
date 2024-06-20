import {
    Row,
    Col,
    Card,
    Radio,
    InputNumber,
    Popconfirm,
  } from "antd"; 
import React, { useRef, useEffect, useState } from "react";
import Axios from 'axios';
import { Typography, Modal, Alert, Input, Button, Space, Table, Form } from 'antd'; 
import { RiArrowGoBackFill } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import { EditOutlined, DeleteOutlined, SearchOutlined, ExclamationCircleFilled, EyeOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import { Container } from 'reactstrap';
import { NavLink, useHistory } from "react-router-dom";

const { confirm } = Modal;
const { Title } = Typography;

const Roles = () => {
    const [form] = Form.useForm();
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const history = useHistory();
    const [roles, setRoles] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.id_rol === editingKey;
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {

        const obtenerRoles = async () => {
            try {
                const response = await Axios.get(`http://localhost:5000/obtener_roles/`);
                setRoles(response.data);
            } catch (error) {
                console.error('Error al obtener roles:', error);
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

        obtenerRoles();
        obtenerUsuarios();
    }, []);

    // Funciones de edición
    const edit = (record) => {
        form.setFieldsValue({
          id_rol: '',
          nombre_rol: '',
          codigo_rol: '',
          ...record,
        });
        setEditingKey(record.id_rol);
      };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (form, key) => {
        try {
            const row = await form.validateFields();
            const newData = [...roles];
            const index = newData.findIndex((item) => key === item.id_rol);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setRoles(newData);
                setEditingKey('');
            }
        } catch (err) {
            console.log('Validate Failed:', err);
        }
    };    

    const eliminarUsuario = async (id) => {
        try {
            const response = await Axios.post(`http://localhost:5000/borrarRol`, { id_rol: id });
            setRoles(roles.filter(role => role.id_rol !== id));
            console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            console.error('Error al eliminar rol', error);
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: '¿Está seguro de borrar este rol?',
            icon: <ExclamationCircleFilled />,
            okText: 'Sí',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                eliminarUsuario(id);
            },
            onCancel() {
                console.log('No borrar rol');
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

    const detalle_reforma = (id) => {
        localStorage.setItem('id', id);
        history.push('/acceso-de-rol');
      };
    
    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
      }) => {
        const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item
                name={dataIndex}
                style={{
                  margin: 0,
                }}
                rules={[
                  {
                    required: true,
                    message: `Por favor, ingrese ${title}!`,
                  },
                ]}
              >
                {inputNode}
              </Form.Item>
            ) : (
              children
            )}
          </td>
        );
      };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }}>
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
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
                    <Button type="link" size="small" onClick={() => close()}>
                        Cerrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
        history.push('/editar-roles');
    };

    const ingresar_reforma = (id) => {
        localStorage.setItem('id', null);
    };
  

    const columns = [
        {
            title: '',
            key: 'visualizar',
            fixed: 'left',
            render: (_, registro) => (
                <Typography.Link onClick={() => detalle_reforma(registro.id_rol)} >
                    <a><EyeOutlined title="Visualizar Rol" /></a>
                </Typography.Link>
            ),
            width:10,
        },
        {
            title: '',
            key: 'editar',
            dataIndex: 'editar',
            fixed: 'left',
            render: (_, registro) => (
                <Typography.Link onClick={() => editar_reforma(registro.id_rol)} >
                    <a><EditOutlined title="Editar Rol"/></a>
                </Typography.Link>
            ),
            width: 10,
        },
        {
            title: '',
            key: 'eliminar',
            dataIndex: 'eliminar',
            fixed: 'left',
            render: (_, registro) => (
                <Typography.Link onClick={() => showDeleteConfirm(registro.id_rol)} >
                    <a><DeleteOutlined title="Borrar Rol" /></a>
                </Typography.Link>
            ),
            width: 10,
        },
        {
            title: "ID del Rol",
            key: "id",
            dataIndex: "id",
            sorter: (a, b) => a.id - b.id,
            ...getColumnSearchProps('id'),
            editable: true,
        },
        {
            title: "Nombre del Rol",
            key: "nombre_rol",
            dataIndex: "nombre_rol",
            sorter: (a, b) => a.nombre_rol.localeCompare(b.nombre_rol),
            ...getColumnSearchProps('nombre_rol'),
            editable: true,
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            inputType: col.dataIndex === ('id_rol' || 'codigo_rol') ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      });
      

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
                        message="El rol se eliminó correctamente"
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
                                <Title level={4} className="titleTable2" >Mis Roles</Title>
                                <div className="botones" style={{ display: 'flex', gap: '10px' }}>
                                    <NavLink to="/panel">
                                        <Button className="btnCrearProceso" type="primary" title="Regresar">
                                            <span className="iconWrapper">
                                                <RiArrowGoBackFill />
                                            </span>
                                        </Button>
                                    </NavLink>
                                    <NavLink to="/incluir-roles">
                                        <Button className="btnCrearProceso" type="primary" title="Crear Rol" onClick={ingresar_reforma()}>
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
            <div className="contenedorTabla2">
                <Container className="mt--90" fluid>
                    <Row gutter={[24, 0]}>
                        <Col xs={24} xl={24}>
                            <Card bordered={false} className="criclebox tablespace mb-24">
                                <div className="table-responsive">
                                    <Table
                                        columns={mergedColumns}
                                        dataSource={roles}
                                        pagination={true}
                                        className="ant-border-space"
                                        style={{ whiteSpace: 'nowrap' }}
                                        rowKey="id_rol"
                                        rowClassName={(record) => isEditing(record) ? 'editable-row' : ''}
                                        components={{
                                            body: {
                                                cell: EditableCell,
                                            },
                                        }}
                                    />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Roles;
