import React, { useState, useEffect } from "react";
import { Alert, Form } from 'antd';
import { Button, Card, CardHeader, Col, Container, FormGroup, Input, Row } from "reactstrap";
import Select from 'react-select';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { RiArrowGoBackFill } from "react-icons/ri";

const Add_Dir_Form = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [form] = Form.useForm();
  const [usuarios, setUsuarios] = useState([]);
  const [direccion, setDireccion] = useState([]);
  const [defaultValor, setDefaultValor] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState([]);
  const [nombreDireccion, setNombreDireccion] = useState('');
  const [siglasDireccion, setSiglasDireccion] = useState('');
  const idParaEditar = localStorage.getItem('id');


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuarios
        const usuariosResponse = await Axios.get(`http://localhost:5000/obtener_usuarios/`);
        const usuariosData = usuariosResponse.data;
        setUsuarios(usuariosData);
  
        // Obtener dirección

        if(idParaEditar !== 'null'){
          const direccionResponse = await Axios.get(`http://localhost:5000/obtener_direccion_departamento/${idParaEditar}`);
          const direccionData = direccionResponse.data[0];
    
          setDireccion(direccionData);
          console.log(direccionData);
    
          if (direccionData) {
            setNombreDireccion(direccionData.nombre_direccion);
            setSiglasDireccion(direccionData.siglas_direccion);
            setUsuarioSeleccionado(direccionData.id_superior);
    
            // Establecer el valor predeterminado
            if (usuariosData.length > 0 && direccionData.id_superior) {
              const usuarioSeleccionadoEncontrado = usuariosData.find(usuario => usuario.id_usuario === String(direccionData.id_superior));
              if (usuarioSeleccionadoEncontrado) {
                setDefaultValor(usuarioSeleccionadoEncontrado);
                console.log(usuarioSeleccionadoEncontrado);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
  
    fetchData(); 
  
  }, []); 
  

  const handleInputChangeUsuarios = (selectedOption) => {
    setUsuarioSeleccionado(selectedOption.value);
    setDefaultValor(usuarios.filter(doc => doc.id_usuario === selectedOption.value)[0]);
  };

  const handleInputChangeNombreDireccion = (e) => {
    setNombreDireccion(e.target.value);
  };

  const handleInputChangeSiglasDireccion = (e) => {
    setSiglasDireccion(e.target.value);
  };

  const limpiarCampos = () => {
    setNombreDireccion('');
    setUsuarioSeleccionado([]);
  };

  const regresar_Inicio = () => {
    window.history.back();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombreDireccion.trim() === '' || siglasDireccion.trim() === '' || usuarioSeleccionado === null) {
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
    } else {
      form.setFieldsValue({
        nombre_direccion: nombreDireccion, 
        id_superior: usuarioSeleccionado, 
        siglas_direccion: siglasDireccion,
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
          message="Se agregó la dirección correctamente"
          type="success"
          showIcon
          closable
          onClose={() => setSuccessVisible(false)}
        />
      )}
      <Form form={form} >
        <Card bordered={false} className="criclebox tablespace mb-24" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
          <CardHeader className="headerReformaTitle">
            <Row className="align-items-center">
              <Col xs="8">
                <h6 className="titulosReforma sinMargenDerecho">Datos Generales</h6>
              </Col>
              <Col xs="4" className="text-right">
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <Button className="btnRegresar" type="primary" title="Regresar" onClick={regresar_Inicio}>
                    <span className="iconWrapper">
                      <RiArrowGoBackFill />
                    </span>
                  </Button>
                  <Button className="btnRegresar" color="primary" onClick={handleSubmit} size="sm" type="submit">Enviar</Button>
                </div>
              </Col>
            </Row>
          </CardHeader>
          <div className="pl-lg-4">
            <Row>
              <Col lg="6">
              <FormGroup>
                  <label className="form-control-label" htmlFor="input-username">Nombre de la Dirección</label>
                  <Input
                    className="form-control-alternative"
                    id="input-username"
                    defaultValue={direccion ? direccion.nombre_direccion : null}
                    placeholder="Ingrese nombre de la dirección"
                    type="text"
                    onChange={handleInputChangeNombreDireccion}
                  />
                </FormGroup>
              </Col>
              <Col lg="6">
              <FormGroup>
                  <label className="form-control-label" htmlFor="input-username">Siglas de la Dirección</label>
                  <Input
                    className="form-control-alternative"
                    id="input-username"
                    placeholder="Ingrese las siglas de la dirección"
                    type="text"
                    onChange={handleInputChangeSiglasDireccion}
                    defaultValue={direccion ? direccion.siglas_direccion : null}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-first-name">Director de la Dirección</label>
                  <Select
                    className="form-control-alternative"
                    value={defaultValor ?
                      { label: defaultValor.nombres_usuario + ' ' + defaultValor.apellidos_usuario, 
                        value: usuarioSeleccionado
                      } : null
                    }
                    onChange={handleInputChangeUsuarios}
                    options={usuarios.map((elemento) => ({
                      value: elemento.id_usuario,
                      label: elemento.nombres_usuario + ' ' + elemento.apellidos_usuario,
                    }))}
                    placeholder="Selecciona una opción..."
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>
        </Card>
      </Form>
    </>
  );
}

export default Add_Dir_Form;
