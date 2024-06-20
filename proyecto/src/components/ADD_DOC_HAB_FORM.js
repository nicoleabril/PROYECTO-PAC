import React, { useState, useEffect } from "react";
import { Alert, Form, Radio } from 'antd';
import { Button, Card, CardHeader, Col, Container, FormGroup, Input, Row } from "reactstrap";
import Select from 'react-select';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { RiArrowGoBackFill } from "react-icons/ri";

const Add_Doc_Hab_Form = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [form] = Form.useForm();
  const [usuarios, setUsuarios] = useState([]);
  const [documento, setDocumento] = useState([]);
  const [defaultTipoCompra, setDefaultTipoCompra] = useState(null);
  const [defaultTipoProceso, setDefaultTipoProceso] = useState(null);
  const [tipoProcesoSeleccionado, setTipoProcesoSeleccionado] = useState([]);
  const [nombreDoc, setNombreDoc] = useState('');
  const [emailDoc, setEmailDoc] = useState('');
  const idParaEditar = localStorage.getItem('id_doc');
  const [Obligatorio, setObligatorio] = useState(true);
  const [tipoCompra, setTipoCompra] = useState([]);
  const [tipoProceso, setTipoProceso] = useState([]);
  const [tipoCompraSeleccionado, setTipoCompraSeleccionado] = useState([]);

  useEffect(() => {
    const obtenerDocumento = async () => {
      try {
        const tipoCompraResponse = await Axios.get(`http://localhost:5000/obtener_doc_tipo_compra/`);
        const tipoCompraData = tipoCompraResponse.data;
        setTipoCompra(tipoCompraData);

        const tipoProcesoResponse = await Axios.get(`http://localhost:5000/obtener_doc_tipo_proceso/`);
        const tipoProcesoData = tipoProcesoResponse.data;
        setTipoProceso(tipoProcesoData);

        if(idParaEditar !== 'null'){
          const docResponse = await Axios.get(`http://localhost:5000/obtener_doc_hab/${idParaEditar}`);
          const docData = docResponse.data[0];
          setDocumento(docData);
          setNombreDoc(docData.nombre_doc);
          setObligatorio(docData.obligatorio);
          setEmailDoc(docData.email_doc);
          setTipoCompraSeleccionado(docData.tipo_compra);
          setTipoProcesoSeleccionado(docData.tipo_proceso);
          // Establecer el valor predeterminado
          if (tipoCompraData.length > 0 && docData.tipo_compra) {
            const usuarioSeleccionadoEncontrado = tipoCompraData.find(usuario => usuario.id_tipo_compra === (docData.tipo_compra));
            if (usuarioSeleccionadoEncontrado) {
              setDefaultTipoCompra(usuarioSeleccionadoEncontrado);
            }
          }

          if (tipoProcesoData.length > 0 && docData.tipo_proceso) {
            const usuarioSeleccionadoEncontrado = tipoProcesoData.find(usuario => usuario.id_proceso === (docData.tipo_proceso));
            if (usuarioSeleccionadoEncontrado) {
              setDefaultTipoProceso(usuarioSeleccionadoEncontrado);
            }
          }



        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    
    obtenerDocumento();
  }, []); 


  const onChange = (e) => {
    setObligatorio(e.target.value);
  };
  

  const handleInputChangeUsuarios = (selectedOption) => {
    setTipoProcesoSeleccionado(selectedOption.value);
    setDefaultTipoProceso(tipoProceso.filter(doc => doc.id_proceso === selectedOption.value)[0]);
  };

  const handleInputChangeNombreDireccion = (e) => {
    setNombreDoc(e.target.value);
  };

  const handleInputChangeEmailDoc = (e) => {
    setEmailDoc(e.target.value);
  };

  const limpiarCampos = () => {
    setNombreDoc('');
    setEmailDoc('');
    setTipoCompraSeleccionado([]);
    setTipoProcesoSeleccionado([]);
  };

  const handleInputChangeDepartamentos = (selectedOption) => {
    setTipoCompraSeleccionado(selectedOption.value); 
    setDefaultTipoCompra(tipoCompra.filter(doc => doc.id_tipo_compra === selectedOption.value)[0]);
  };

  const regresar_Inicio = () => {
    window.history.back();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombreDoc.trim() === '' || emailDoc.trim() === '' || tipoCompraSeleccionado === null || tipoProcesoSeleccionado === null) {
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 3000);
    } else {
      form.setFieldsValue({
        nombre_doc: nombreDoc, 
        tipo_compra: tipoCompraSeleccionado, 
        obligatorio:Obligatorio,
        email_doc: emailDoc, 
        tipo_proceso: tipoProcesoSeleccionado,
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
          message="Se agregó el documento correctamente"
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
                  <label className="form-control-label" htmlFor="input-username">Nombre del Documento</label>
                  <Input
                    className="form-control-alternative"
                    id="input-username"
                    defaultValue={documento ? documento.nombre_doc : null}
                    placeholder="Ingrese nombre del documento"
                    type="text"
                    onChange={handleInputChangeNombreDireccion}
                  />
                </FormGroup>
              </Col>
              <Col lg="6">
              <FormGroup>
                <label
                    className="form-control-label"
                    htmlFor="input-username"
                    name="area_requirente"
                    label="Área Requirente"
                >Obligatorio</label><br/>
                <Radio.Group onChange={onChange} value={Obligatorio}>
                    <Radio 
                    className="form-control-alternative"
                    value={true}>
                    Sí
                </Radio>
                    <Radio className="form-control-alternative" value={false}>No</Radio>
                </Radio.Group>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-first-name">Tipo de Compra</label>
                  <Select
                      className="form-control-alternative"
                      value={defaultTipoCompra ?
                        { label: defaultTipoCompra.nombre_tipo_compra, 
                          value: tipoCompraSeleccionado
                        } : null
                      }
                      onChange={handleInputChangeDepartamentos}
                      options={tipoCompra.map((elemento) => ({
                      value: elemento.id_tipo_compra,
                      label: elemento.nombre_tipo_compra,
                      }))}
                      placeholder="Selecciona una opción..."
                />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-first-name">Tipo de Proceso</label>
                  <Select
                    className="form-control-alternative"
                    value={defaultTipoProceso ?
                      { label: defaultTipoProceso.nombre_proceso, 
                        value: tipoProcesoSeleccionado
                      } : null
                    }
                    onChange={handleInputChangeUsuarios}
                    options={tipoProceso.map((elemento) => ({
                      value: elemento.id_proceso,
                      label: elemento.nombre_proceso,
                    }))}
                    placeholder="Selecciona una opción..."
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-first-name">Mensaje para Correo</label>
                  <Input
                    id="justificacion-fortuita"
                    type="textarea"
                    required
                    defaultValue={documento ? documento.email_doc : null}
                    onChange={handleInputChangeEmailDoc}
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

export default Add_Doc_Hab_Form;
