import React, { Component, useState, useEffect } from "react";
import { Alert, Form, Table, Checkbox } from 'antd';
import {
    TextArea,
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Input,
    Container,
    Row,
    Col,
  } from "reactstrap";
  // core components
  import AsyncSelect from 'react-select/async';
  import Select from 'react-select';
  import Axios from 'axios';
  import Cookies from 'js-cookie';
  import { RiArrowGoBackFill } from "react-icons/ri";

function generarListaMenu(accesos, menu) {
    const listaMenu = [];
  
    // Itera sobre cada opción de menú
    menu.forEach(opcion => {
      // Busca el acceso correspondiente en la lista de accesos
      const acceso = accesos.find(acc => acc.opcion_menu === opcion.id_opcion);
  
      // Determina si el checkbox debe estar marcado o no
      const isChecked = acceso && acceso.opcion_rol !== null;
  
      // Agrega el elemento a la lista
      listaMenu.push({ id_opcion: opcion.id_opcion, isChecked });
    });
  
    return listaMenu;
}
const Access_Form = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [form] = Form.useForm();
  const [nombreRol, setNombreRol] = useState('');
  const [menu, setMenu] = useState([]);
  const [rol, setRol] = useState([]);
  const user = Cookies.get('usr');
  const [accesos, setAccesos] = useState([]);
  const [checkboxes, setCheckboxes] = useState({});
  const idParaEditar = localStorage.getItem('id');

  useEffect(() => {
    const obtenerMenu = async () => {
      try {
          const response = await Axios.get(`http://localhost:5000/obtener_menu_opciones/`);
          setMenu(response.data);
      } catch (error) {
          console.error('Error al obtener opciones del menu:', error);
      }
    };

    const obtenerAccesos = async () => {
      let response = null;
      try {
          if(idParaEditar === 'null'){
            response = await Axios.get(`http://localhost:5000/obtener_accesos/`);
          }else{
            response = await Axios.get(`http://localhost:5000/obtener_accesos_rol/${idParaEditar}`);
          }
          setAccesos(response.data);
      } catch (error) {
          console.error('Error al obtener opciones del menu:', error);
      }
    };

    const obtenerRol = async () => {
      let response = null;
      try {
          response = await Axios.get(`http://localhost:5000/obtener_rol/${idParaEditar}`);
          setRol(response.data[0]);
      } catch (error) {
          console.error('Error al obtener opciones del menu:', error);
      }
    };

    obtenerRol();
    obtenerAccesos();
    obtenerMenu();
  }, []);
  
  

const handleInputChangeNombreRol = (e) => {
    setNombreRol(e.target.value);
};


const determinarChecked = (id_opcion) => {
  return checkboxes[id_opcion] || false;
};

const limpiarCampos = () => {
  setNombreRol('');
  // Limpia los otros campos del formulario...
};

const regresar_Inicio = () => {
  window.history.back();
};

const handleSubmit = (e) => {
  e.preventDefault();
  
    if (nombreRol.trim() === '' ) {
      setMensajeError('Por favor complete todos los campos del formulario.');
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
    }else{
        form.setFieldsValue({
          nombre_rol:nombreRol, accesos_rol:checkboxes,
        });
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 3000);
        limpiarCampos();
        onSubmit(form);
    }
};

// Función para manejar cambios en los checkboxes
const handleCheckboxChange = (id_opcion, isChecked) => {
  setCheckboxes({
    ...checkboxes,
    [id_opcion]: isChecked,
  });
};

useEffect(() => {
  if(idParaEditar !== 'null'){
    const nuevosAccesosSeleccionados = {};
    accesos.forEach(acceso => {
      if (acceso.opcion_rol !== null) {
        nuevosAccesosSeleccionados[acceso.opcion_menu] = true;
      }
    });
    setCheckboxes(nuevosAccesosSeleccionados);
  }
}, [accesos, menu]);




const menuMap = menu.reduce((map, opcion) => {
  map[opcion.id_opcion] = opcion.descripcion;
  return map;
}, {});

const columns = [
  {
      title: "ID de Opción",
      key: "id_opcion",
      dataIndex: "id_opcion",
      sorter: (a, b) => a.id_opcion - b.id_opcion,
      width:10,
  },
  {
      title: "Nombre de la Opcion",
      key: "descripcion",
      dataIndex: "descripcion",
      sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
      width:10,
  },
  {
      title: "Opción De",
      key: "pertenece_a",
      dataIndex: "pertenece_a",
      render: (opcion) => menuMap[opcion],
      width:10,
  },
  {
      title: "Habilitado",
      key: "habilitado",
      dataIndex: "habilitado",
      render: habilitado => habilitado ? "Sí" : "No",
      width:10,
  },
  {
    title: "Acceso",
    key: "id_opcion",
    dataIndex: "id_opcion",
    render: (_, record) => {
      const accessItem = accesos.find(item => item.opcion_menu === record.id_opcion);
      const isChecked = determinarChecked(record.id_opcion);
      if (typeof accessItem !== 'undefined') {
        const isNullRole = accessItem.opcion_rol === null;
        if (isNullRole) {
          return <Checkbox checked disabled />;
        }else{
          return <Checkbox
          checked={isChecked}
          disabled
          onChange={(e) => handleCheckboxChange(record.id_opcion, e.target.checked)}
          />
        }
      } else {
        return <Checkbox
          checked={isChecked}
          disabled
          onChange={(e) => handleCheckboxChange(record.id_opcion, e.target.checked)}
        />
      }
    },
    width: 10,
  },  
];

  return (
      <>
      {/* Alerta de error */}
      {errorVisible && (
        <Alert
          message={mensajeError}
          type="error"
          showIcon
          closable
          onClose={() => setErrorVisible(false)}
        />
      )}

      {/* Alerta de éxito */}
      {successVisible && (
        <Alert
          message="El rol se agregó correctamente"
          type="success"
          showIcon
          closable
          onClose={() => setSuccessVisible(false)}
        />
      )}
       <Form form={form} >
       <Card bordered={false} className="criclebox tablespace mb-24" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
       <CardHeader className="headerReformaTitle">
        <Row className="align-items-center">
          <Col xs="8">
            <h6 className="titulosReforma sinMargenDerecho">
              Datos Generales
            </h6>
          </Col>
          <Col xs="4" className="text-right">
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              <Button className="btnRegresar" type="primary" title="Regresar" onClick={regresar_Inicio}>
                <span className="iconWrapper">
                  <RiArrowGoBackFill />
                </span>
              </Button>
              <Button
                className="btnRegresar"
                color="primary"
                onClick={handleSubmit}
                size="sm"
                type="submit"
              >
                Enviar
              </Button>
            </div>
          </Col>
        </Row>
      </CardHeader>
        <div className="pl-lg-4">
          <Row>
            <Col md="12">
              <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-username"
                name="area_requirente"
                label="Área Requirente"
              >Nombre del Rol</label>
                <Input
                  className="form-control-alternative"
                  placeholder="Ingrese nombre del rol"
                  type="text"
                  onChange={handleInputChangeNombreRol}
                  defaultValue={ rol ? rol.nombre_rol : null}
                  autoComplete="off"
                  disabled
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
        <hr className="hr" />
          <Row className="align-items-center">
            <Col xs="8">
              <h6 className="titulosReforma sinMargenDerecho">
                Accesos Generales
              </h6>
            </Col>
          </Row>
          <div className="pl-lg-4">
            <Table 
            className="ant-border-space"
            columns={columns} 
            dataSource={menu} 
            rowKey={"id_opcion"} 
            style={{ whiteSpace: 'nowrap' }}
            pagination={{ pageSize: 5 }}/>
          </div>
        </Card>
      </Form>
      </>
    );
}

export default Access_Form;