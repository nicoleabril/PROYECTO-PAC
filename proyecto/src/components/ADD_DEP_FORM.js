import React, { useState, useEffect } from "react";
import { Alert, Form } from 'antd';
import {
    Input,
    Button,
    Card,
    CardHeader,
    FormGroup,
    Row,
    Col,
  } from "reactstrap";
import AsyncSelect from 'react-select/async';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { RiArrowGoBackFill } from "react-icons/ri";
import Select from 'react-select';
const Add_Dep_Form = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [form] = Form.useForm();
  const [usuarios, setUsuarios] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [departamento, setDepartamento] = useState([]);
  const [defaultValor, setDefaultValor] = useState(null);
  const [defaultValorDireccion, setDefaultValorDireccion] = useState(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState([]);
  const [nombreDepartamento, setNombreDepartamento] = useState('');
  const user = Cookies.get('usr');
  const idParaEditar = localStorage.getItem('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const direccionesResponse = await Axios.get(`http://localhost:5000/obtener_direcciones/`);
        const direccionesData = direccionesResponse.data;
        setDirecciones(direccionesData);

        // Obtener usuarios
        const usuariosResponse = await Axios.get(`http://localhost:5000/obtener_usuarios/`);
        const usuariosData = usuariosResponse.data;
        setUsuarios(usuariosData);
  
        if (idParaEditar !== 'null') {
          // Obtener dirección
          const direccionResponse = await Axios.get(`http://localhost:5000/obtener_departamento/${idParaEditar}`);
          const direccionData = direccionResponse.data[0];
    
          setDepartamento(direccionData);
          console.log(direccionData);

          setNombreDepartamento(direccionData.nombre_direccion);
          setDireccionSeleccionada(direccionData.id_direccion);
          setUsuarioSeleccionado(direccionData.id_superior);
          setDepartamento(direccionData);
          // Establecer el valor predeterminado
          if (usuariosData.length > 0 && direccionData.id_superior) {
            const usuarioSeleccionadoEncontrado = usuariosData.find(usuario => usuario.id_usuario === String(direccionData.id_superior));
            if (usuarioSeleccionadoEncontrado) {
              setDefaultValor(usuarioSeleccionadoEncontrado);
              console.log(usuarioSeleccionadoEncontrado);
            }
          }

          if (direccionesData.length > 0 && direccionData.id_direccion) {
            console.log(direccionesData);
            const usuarioSeleccionadoEncontrado = direccionesData.find(usuario => usuario.id_direccion === (direccionData.id_direccion));
            if (usuarioSeleccionadoEncontrado) {
              setDefaultValorDireccion(usuarioSeleccionadoEncontrado);
              console.log(usuarioSeleccionadoEncontrado);
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
  
    fetchData(); 
  
  }, []); 

  const handleInputChangeDirecciones = (selectedOption) => {
    setDireccionSeleccionada(selectedOption);
    setDefaultValorDireccion(direcciones.filter(doc => doc.id_direccion === selectedOption.value)[0]);
  };

  const handleInputChangeUsuarios = (selectedOption) => {
    setDefaultValor(usuarios.filter(doc => doc.id_usuario === selectedOption.value)[0]);
    setUsuarioSeleccionado(selectedOption);
  };

  const handleInputChangeNombreDepartamento = (e) => {
    setNombreDepartamento(e.target.value);
  };

  const limpiarCampos = () => {
    setNombreDepartamento('');
    setDireccionSeleccionada([]);
    setUsuarioSeleccionado([]);
  };

  const regresar_Inicio = () => {
    window.history.back();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombreDepartamento.trim() === '' || 
      usuarioSeleccionado === null || direccionSeleccionada === null) {
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
    } else {
      form.setFieldsValue({
        nombre_departamento: nombreDepartamento, 
        id_direccion: direccionSeleccionada.value,
        id_superior: usuarioSeleccionado.value, 
      });
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
      limpiarCampos();
      onSubmit(form);
    }
  };

  return (
    <>
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
          message="Se agregó el departamento correctamente"
          type="success"
          showIcon
          closable
          onClose={() => setSuccessVisible(false)}
        />
      )}
      <Form form={form}>
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
                  >Nombre del Departamento</label>
                  <Input
                    className="form-control-alternative"
                    id="input-username"
                    placeholder="Ingrese nombre del departamento"
                    type="text"
                    onChange={handleInputChangeNombreDepartamento}
                    defaultValue={departamento ? departamento.nombre_departamento : null}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-first-name"
                  >
                    Dirección del Departamento
                  </label>
                  <Select
                    className="form-control-alternative"
                    value={defaultValorDireccion ?
                      { label: defaultValorDireccion.nombre_direccion,
                        value: defaultValorDireccion.id_direccion
                      } :
                      null
                    }
                    onChange={handleInputChangeDirecciones}
                    options={direcciones.map((elemento) => ({
                      value: elemento.id_direccion,
                      label: elemento.nombre_direccion,
                    }))}
                    placeholder="Selecciona una opción..."
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-first-name"
                  >
                    Jefe Departamental
                  </label>
                  <Select
                    className="form-control-alternative"
                    value={defaultValor ?
                      { label: defaultValor.nombres_usuario + ' ' + defaultValor.apellidos_usuario, 
                        value: usuarioSeleccionado
                      } :
                      null
                    }
                    onChange={handleInputChangeUsuarios}
                    options={usuarios.map((elemento) => ({
                      value: elemento.id_usuario,
                      label: elemento.nombres_usuario + ' ' + elemento.apellidos_usuario,
                    }))}
                    placeholder="Selecciona una opción..."
                    style={{ minHeight: '50px' }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>
          <hr className="hr" />
        </Card>
      </Form>
    </>
  );
}

export default Add_Dep_Form;
