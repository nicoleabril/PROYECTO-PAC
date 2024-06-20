import React, { Component, useState, useEffect } from "react";
import { Alert, Form } from 'antd';
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

const Add_User_Form = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [form] = Form.useForm();
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [roles, setRoles] = useState([]);
  const [contrasenia, setContrasenia] = useState('');
  const [contraseniaConfirmada, setContraseniaConfirmada] = useState('');
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState([]);
  const [rolSeleccionado, setRolSeleccionado] = useState([]);
  const user = Cookies.get('usr');
  const [defaultValor, setDefaultValor] = useState(null);
  const [defaultValorDepartamento, setDefaultValorDepartamento] = useState(null);
  const idParaEditar = localStorage.getItem('id');
  
useEffect(() => {
    
    const obtenerDatos = async () => {
      try {
          const responseDepartamentos = await Axios.get(`http://localhost:5000/obtener_departamentos/`);
          const departamentos = responseDepartamentos.data;
          setDepartamentos(responseDepartamentos.data);

          const response = await Axios.get(`http://localhost:5000/obtener_roles/`);
          setRoles(response.data);

          if(idParaEditar !== 'null'){
            const responseUsuario = await Axios.get(`http://localhost:5000/obtener_usuario/${idParaEditar}`);
            const usuario = responseUsuario.data[0];

            if(responseUsuario){
              setNombres(usuario.nombres_usuario);
              setApellidos(usuario.apellidos_usuario);
              setCorreo(usuario.correo_usuario);
              const rolUsuario = await Axios.get(`http://localhost:5000/obtener_rol_usuario/${usuario.correo_usuario}`);
              setRolSeleccionado(rolUsuario.data[0].id_rol);
              setDefaultValor(rolUsuario.data[0]);
            }

            if (departamentos.length > 0 && usuario.depar_usuario) {
              const departamentoSeleccionado = departamentos.find(departamento => departamento.id_departamento === (usuario.depar_usuario));
              if (departamentoSeleccionado) {
                setDepartamentoSeleccionado(departamentoSeleccionado.id_departamento);
                setDefaultValorDepartamento(departamentoSeleccionado);
              }
            }
          }
      } catch (error) {
          console.error('Error al obtener roles:', error);
      }
    };

    obtenerDatos();
    limpiarCampos();
}, []);

const handleInputChangeDepartamentos = (selectedOption) => {
  setDepartamentoSeleccionado(selectedOption); // Actualizar la opción seleccionada
  setDefaultValorDepartamento(departamentos.filter(doc => doc.id_departamento === selectedOption.value)[0]);
  const inputValue = selectedOption ? selectedOption.value : null;
  
};

const handleInputChangeRol = (selectedOption) => {
  setRolSeleccionado(selectedOption); // Actualizar la opción seleccionada
  setDefaultValor(roles.filter(doc => doc.id_rol === selectedOption.value)[0]);
  const inputValue = selectedOption ? selectedOption.value : null;
  
};

const handleInputChangeRoles = (selectedOption) => {
  setRolSeleccionado(selectedOption); // Actualizar la opción seleccionada
  // Obtener el valor seleccionado de selectedOption si es necesario
  const inputValue = selectedOption ? selectedOption.value : null;
  
};

const handleInputChangeNombres = (e) => {
    setNombres(e.target.value);
};

const handleInputChangeApellidos = (e) => {
    setApellidos(e.target.value);
};

const handleInputChangeCorreo = (e) => {
    setCorreo(e.target.value);
};

const handleInputChangeContrasenia = (e) => {
    setContrasenia(e.target.value);
};

const handleInputChangeContraseniaConfirmada = (e) => {
    setContraseniaConfirmada(e.target.value);
};

const limpiarCampos = () => {
  setNombres('');
  setApellidos('');
  setCorreo('');
  setContrasenia('');
  setContraseniaConfirmada('');
  setDepartamentoSeleccionado([]);
  setRolSeleccionado([]);
  // Limpia los otros campos del formulario...
};

const regresar_Inicio = () => {
  window.history.back();
};

const handleSubmit = (e) => {
  e.preventDefault();
    if (nombres.trim() === '' || apellidos.trim() === '' || correo.trim() === '' || contrasenia.trim() === '' || 
      contraseniaConfirmada.trim() === '' ||  departamentoSeleccionado === null  ||  rolSeleccionado === null) {
      setMensajeError('Por favor complete todos los campos del formulario.');
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
    }else{
      if(contrasenia === contraseniaConfirmada){
        form.setFieldsValue({
          nombres:nombres, apellidos, correo, contrasenia,
          id_departamento: departamentoSeleccionado.value,
          id_rol: rolSeleccionado.value,
        });
        setSuccessVisible(true);
        setTimeout(() => setSuccessVisible(false), 3000);
        limpiarCampos();
        onSubmit(form);
      }else{
        setMensajeError('Por favor, asegúrese de ingresar la misma contraseña en ambos campos.');
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
    
      }
    }
};

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
          message="El usuario se agregó correctamente"
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
              >Nombres del Usuario</label>
                <Input
                  className="form-control-alternative"
                  placeholder="Ingrese nombres del usuario"
                  type="text"
                  onChange={handleInputChangeNombres}
                  value={nombres}
                  autoComplete="off"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-username"
                name="area_requirente"
                label="Área Requirente"
              >Apellidos del Usuario</label>
                <Input
                  className="form-control-alternative"
                  placeholder="Ingrese apellidos del usuario"
                  type="text"
                  autocomplete="off"
                  onChange={handleInputChangeApellidos}
                  value={apellidos}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-username"
                name="area_requirente"
                label="Área Requirente"
              >Correo del Usuario</label>
                <Input
                  className="form-control-alternative"
                  placeholder="Ingrese correo del usuario"
                  type="text"
                  onChange={handleInputChangeCorreo}
                  value={correo}
                  autocomplete="off"
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
                  Departamento
                </label>
                <Select
                    className="form-control-alternative"
                    value={defaultValorDepartamento ?
                      { label: defaultValorDepartamento.nombre_departamento,
                        value: defaultValorDepartamento.id_departamento
                      } : null
                    }
                    onChange={handleInputChangeDepartamentos}
                    options={departamentos.map((elemento) => ({
                    value: elemento.id_departamento,
                    label: elemento.nombre_departamento,
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
                  Rol del Usuario
                </label>
                <Select
                    className="form-control-alternative"
                    value={defaultValor ?
                      { label: defaultValor.nombre_rol,
                        value: defaultValor.id_rol
                      } : null
                    }
                    onChange={handleInputChangeRol}
                    options={roles.map((elemento) => ({
                    value: elemento.id_rol,
                    label: elemento.nombre_rol,
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
                htmlFor="input-username"
                name="area_requirente"
                label="Área Requirente"
              >Contraseña</label>
                <Input
                  className="form-control-alternative"
                  placeholder="Ingrese contraseña del usuario"
                  type="password"
                  onChange={handleInputChangeContrasenia}
                  value={contrasenia}
                  autocomplete="off"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-username"
                name="area_requirente"
                label="Área Requirente"
              >Confirmar Contraseña</label>
                <Input
                  className="form-control-alternative"
                  placeholder="Ingrese confirmación de contraseña del usuario"
                  type="password"
                  onChange={handleInputChangeContraseniaConfirmada}
                  value={contraseniaConfirmada}
                  autocomplete="off"
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

export default Add_User_Form;