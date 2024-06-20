import React, { Component, useState, useEffect } from "react";
import { Alert, Form, Image } from 'antd';
import { BiSolidBusiness } from "react-icons/bi";//Empresa
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
  import { NavLink, useHistory } from "react-router-dom";
  import AsyncSelect from 'react-select/async';
  import Select from 'react-select';
  import Axios from 'axios';
  import Cookies from 'js-cookie';
  import { RiArrowGoBackFill } from "react-icons/ri";
  import sinFoto from "../assets/images/SinFotoPerfil.png"
const Profile_Form = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [form] = Form.useForm();
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [cargarImagen, setCargarImagen] = useState([]);
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [contraseniaConfirmada, setContraseniaConfirmada] = useState('');
  const [usuario, setUsuario] = useState([]);
  const [imagen, setImagen] = useState(null);
  const user = Cookies.get('usr');

  const definirRutaImagen = () => {
    if(cargarImagen.name){
      return cargarImagen.name;
    }else{
      return usuario.ruta_usuario;
    }
  }
  
  function separarNombreYExtension(nombreImagen) {
    const partesNombreImagen = nombreImagen.split('.');
    const nombre = partesNombreImagen.slice(0, -1).join('.'); // Unir las partes del nombre (por si el nombre contiene puntos)
    const extension = partesNombreImagen[partesNombreImagen.length - 1]; // Obtener la última parte como extensión

    return extension;
}

useEffect(() => {
    
    const obtenerDatos = async () => {
      try {
          const responseUsuario = await Axios.get(`http://localhost:5000/obtener_usuario_correo/${user}`);
          const usuario = responseUsuario.data[0];
          setUsuario(usuario);
          if(responseUsuario){
            setNombres(usuario.nombres_usuario);
            setApellidos(usuario.apellidos_usuario);
            setCorreo(usuario.correo_usuario);
            if(usuario.imagen_usuario){
              const extension = separarNombreYExtension(usuario.ruta_usuario);
              const blob = new Blob([new Uint8Array(usuario.imagen_usuario.data)], { type: 'image/'+extension });
              const url = URL.createObjectURL(blob);
              setCargarImagen(blob);
              setImagen(url);
            }
          }

      } catch (error) {
          console.error('Error al obtener informacion del usuario:', error);
      }
    };

    obtenerDatos();
    limpiarCampos();
}, []);

const handleImagenChange = (event) => {
  const imagenSeleccionada = event.target.files[0];
  // Aquí podrías guardar la imagen en el estado o en una variable antes de subirla al servidor
  setCargarImagen(imagenSeleccionada);
  setImagen(URL.createObjectURL(imagenSeleccionada));
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
  // Limpia los otros campos del formulario...
};

const regresar_Inicio = () => {
  window.history.back();
};

const handleSubmit = async (e) => {
  e.preventDefault();
    if (nombres.trim() === '' || apellidos.trim() === '' || correo.trim() === '' || contrasenia.trim() === '' || 
      contraseniaConfirmada.trim() === '') {
      setMensajeError('Por favor complete todos los campos del formulario.');
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
    }else{
      const logo_empresa = definirRutaImagen();
      if(contrasenia === contraseniaConfirmada){
        try {
          const response = await Axios.post(`http://localhost:5000/actualizar_solo_datos/`, {id:usuario.id_usuario, nombres, apellidos, correo, contrasena: contrasenia, ruta_usuario:logo_empresa, imagen_usuario: cargarImagen}, 
           {headers: {
              'Content-Type': 'multipart/form-data'
            }});
          console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            console.error('Error al guardar información de usuario', error);
        }
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
          message="El usuario se actualizó correctamente"
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
            <NavLink to="/panel">
              <Button className="btnRegresar" type="primary" title="Regresar">
                <span className="iconWrapper">
                  <RiArrowGoBackFill />
                </span>
              </Button>
            </NavLink>
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
          <Col lg="6">
            <FormGroup>
            <label
              className="form-control-label"
              htmlFor="input-username"
              name="area_requirente"
              label="Área Requirente"
            >Imagen de Perfil</label><br/><br/>
              {imagen ? (
                  <Image
                      src={(imagen)}
                      alt="Imagen del Usuario"
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
              ) : (
                      <div className="sinFoto">
                           <Image
                              src={(sinFoto)}
                              alt="Imagen del Usuario"
                          />
                      </div>
              )}
            </FormGroup>
          </Col>
          <Col lg="6">
            <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-email"
              >
                Elegir imagen
              </label>
              <Input type="file" id="imagen" onChange={handleImagenChange} accept="image/*"/>
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

export default Profile_Form;