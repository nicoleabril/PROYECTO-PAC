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

const Add_Inf_Form = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [form] = Form.useForm();
  const user = Cookies.get('usr');
  const [filtroPP, setFiltroPP] = useState('');
  const [area, setArea] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [seleccionadoPartidasP, setSeleccionadoPartidasP] = useState([]);
  const [partidasPresu, setPartidasPresu] = useState([]);
  const [ppEncontrado, setPPEncontrado] = useState([]);
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const [filtroCPC, setFiltroCPC] = useState('');
  const [procesosCPC, setProcesosCPC] = useState([]);
  const [seleccionadoCPC, setSeleccionadoCPC] = useState('');
  const [seleccionadoCompra, setSeleccionadoCompra] = useState('');
  const [seleccionadoUnidad, setSeleccionadoUnidad] = useState('');
  const [compra, setCompra] = useState([]);
  const [aprobador, setAprobador] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [idDireccion, setIdDireccion] = useState('');
  const [objetoContratacion, setObjetoContratacion] = useState('');

  const handleInputChangePartida = (selectedOption) => {
      if (selectedOption) {
          setFiltroPP(selectedOption);
          setSeleccionadoPartidasP(selectedOption);
        } else {
          setSeleccionadoPartidasP(''); // Maneja el caso en el que se limpie la selección
          setFiltroPP('');
          setPPEncontrado('');
      }
  };


  const handleInputChangeCPC = (opcion) => {
    if (opcion) {
        setFiltroCPC(opcion);
        setSeleccionadoCPC({ index: `${opcion.value}`, opcion: `${(opcion.label.split(': '))[1]}` });
      } else {
        setSeleccionadoCPC([]); 
        setFiltroCPC('');
    }
};

useEffect(() => {
  const obtenerPPEncontrado = async () => {
      try {
          if(filtroPP){
              const response = await Axios.get(`http://localhost:5000/obtenerPartidaPresupuestaria/${filtroPP.value}/${(filtroPP.label.split(': '))[1]}/${idDireccion}`);
              setPPEncontrado(response.data[0]);
              console.log(response.data[0]);
          }
      } catch (error) {
          console.error('Error al obtener partida presupuestaria seleccionada:', error);
      }
  };

  obtenerPPEncontrado();

}, [filtroPP]);


useEffect(() => {
    const obtenerDatos = async () => {
        try {
            const userResponse = await Axios.get(`http://localhost:5000/obtener_info_user/${user}`);
            const idDepartamento = userResponse.data[0].depar_usuario;

            const departamentoResponse = await Axios.get(`http://localhost:5000/obtener_departamento_user/${idDepartamento}`);
            const idDireccion = departamentoResponse.data[0].id_direccion;

            const direccionResponse = await Axios.get(`http://localhost:5000/obtener_direccion_departamento/${idDireccion}`);
            const directorResponsableID = direccionResponse.data[0].id_superior;
            const directorResponse = await Axios.get(`http://localhost:5000/obtener_info_user_dado_ID/${directorResponsableID}`);
            setAprobador(directorResponse.data[0].correo_usuario);

            const partidasResponse = await Axios.get(`http://localhost:5000/obtenerPartidasPresupuestarias/${idDireccion}`);
            const partidasPresu = partidasResponse.data;
            
            setPartidasPresu(partidasPresu);
            setIdDireccion(idDireccion)
            // ... establecer otros estados según sea necesario
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    obtenerDatos();
}, []);

useEffect(() => {
        
  const obtenerCPC = async () => {
      try {
          const response = await Axios.get(`http://localhost:5000/obtener_cpc/`);
          setProcesosCPC(response.data);
      } catch (error) {
          console.error('Error al obtener cpc:', error);
      }
  };



  const obtenerUnidades = async () => {
      try {
          const response = await Axios.get(`http://localhost:5000/obtener_Unidades/`);
          setUnidades(response.data);
      } catch (error) {
          console.error('Error al obtener unidades:', error);
      }
  };

  const obtenerCompra = async () => {
    try {
        const response = await Axios.get(`http://localhost:5000/obtener_tipo_compra/`);
        setCompra(response.data);
    } catch (error) {
        console.error('Error al obtener Compra', error);
    }
  };

  obtenerCPC();
  obtenerUnidades();
  obtenerCompra();
}, []);



  const opcionesFormateadasPP = partidasPresu.map((opcion) => ({
    value: opcion.index,
    label: `${opcion.index}: ${opcion.opcion}`,
  }));

  const opcionesFormateadasCPC = procesosCPC.map((opcion) => ({
    value: opcion.index,
    label: `${opcion.index}: ${opcion.opcion}`,
  }
  ));

  const loadOptions = (inputValue, callback) => {
    try {
      // Si no se ha ingresado nada, cargar las opciones predeterminadas
      if (!inputValue) {
        callback(opcionesFormateadasCPC.slice(0, 100)); 
      } else {
        // Si hay una búsqueda, filtrar las opciones
        const opciones = filtrarOpciones(inputValue);
        callback(opciones);
      }
    } catch (error) {
      console.error('Error al cargar opciones:', error);
      // Manejo de errores si es necesario
    }
};

const filtrarOpciones = (inputValue) => {
  // Lógica de filtrado para encontrar opciones coincidentes
  const opcionesFiltradas = opcionesFormateadasCPC.filter((opcion) =>
    opcion.label.toLowerCase().includes(inputValue.toLowerCase())
  );
  return opcionesFiltradas;
};


const handleInputChangeCompra = (selectedOption) => {
  const inputValue = selectedOption ? selectedOption.value : null;
  setSeleccionadoCompra(selectedOption);
  
};


const handleInputChangeUnidad = (selectedOption) => {
  setSeleccionadoUnidad(selectedOption); // Actualizar la opción seleccionada
  // Obtener el valor seleccionado de selectedOption si es necesario
  const inputValue = selectedOption ? selectedOption.value : null;
  
};

const handleInputChangeCantidad = (e) => {
  if(e.target.value){
    let inputValue = e.target.value;
    setCantidad(inputValue);
    // Si el valor no es un número, no actualices el estado
    if (!/^\d*$/.test(inputValue)) {
      return;
    }
  }

};

const handleInputBlurCantidad = (e) => {
  if(e.target.value){
    let inputValue = e.target.value;
    // Convierte el valor a un número entero
    inputValue = parseInt(inputValue, 10);
    setCantidad(inputValue);
    //form.setFieldsValue({cantidad: inputValue});
  }

};





const handleInputChangeOC = (e) => {
  setObjetoContratacion(e.target.value);
};

const limpiarCampos = () => {
  setPPEncontrado([]);
  setFiltroCPC([]);
  setSeleccionadoCompra([]);
  setSeleccionadoPartidasP([]);
  setObjetoContratacion('');
  setCantidad('');
  setSeleccionadoUnidad([]);
};

const regresar_Inicio = () => {
  window.history.back();
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (
    ppEncontrado === null || 
    filtroCPC === null || 
    seleccionadoCompra === null || 
    objetoContratacion.trim() === '' || 
    cantidad.toString().trim() === '' ||
    seleccionadoUnidad === null) {
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
  }else{
    form.setFieldsValue({
      id_direccion: idDireccion, 
      id_partida_presupuestaria: ppEncontrado.id_partida, 
      partida_presupuestaria: ppEncontrado.codigo_partida, 
      cpc: filtroCPC.value, 
      tipo_compra: seleccionadoCompra.value, 
      detalle_producto: objetoContratacion, 
      cantidad: cantidad, 
      unidad: seleccionadoUnidad.label, 
      fecha_inicio_estado: fechaActual,
      estado: 'ELABORACIÓN DOCUMENTOS PREPARATORIOS', 
      elaborador: user,
      aprobador: aprobador
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
          message="Se agregó la ínfima cuantía correctamente"
          type="success"
          showIcon
          closable
          onClose={() => setSuccessVisible(false)}
        />
      )}
     
       <Form form={form} >
        <CardHeader className="headerReformaTitle">
        <Row className="align-items-center">
          <Col xs="8">
            <h6 className="titulosReforma sinMargenDerecho">
                Datos Generales
            </h6>
          </Col>
          <Col xs="4" className="text-right">
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
              <Button className="btnRegresar" type="button" color="primary" title="Regresar" onClick={regresar_Inicio}>
                <span className="iconWrapper">
                  <RiArrowGoBackFill />
                </span>
              </Button>
              <Button className="btnRegresar" color="primary" size="sm" type="submit" onClick={handleSubmit}>
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
                <label>Partida Presupuestaria</label>
                <Select
                    value={seleccionadoPartidasP}
                    onChange={handleInputChangePartida}
                    options={opcionesFormateadasPP}
                    isClearable
                    placeholder="Seleccione una opción..."
                    noOptionsMessage={() => 'No se encontraron opciones'}
                />
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup>
                <label>CPC</label>
                <AsyncSelect
                    value={filtroCPC}
                    defaultOptions={opcionesFormateadasCPC.slice(0, 100)}
                    onChange={handleInputChangeCPC}
                    loadOptions={loadOptions}
                    isClearable
                    placeholder="Seleccione una opción..."
                    noOptionsMessage={() => 'No se encontraron opciones'}
                />
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup>
                <label>Objeto de Contratación</label>
                <Input
                    type="textarea"
                    value={objetoContratacion}
                    onChange={handleInputChangeOC}
                />
                </FormGroup>
            </Col>
            <Col md="4">
                <FormGroup>
                <label>Tipo Compra</label>
                <Select
                    value={seleccionadoCompra}
                    onChange={handleInputChangeCompra}
                    options={compra.map((option) => ({
                    value: option.tipo_compra,
                    label: option.tipo_compra,
                    }))}
                    placeholder="Selecciona una opción..."
                />
                </FormGroup>
            </Col>
            <Col md="4">
                <FormGroup>
                <label>Cantidad</label>
                <Input type="number" value={cantidad} onChange={handleInputChangeCantidad} onBlur={handleInputBlurCantidad} />
                </FormGroup>
            </Col>
            <Col md="4">
                <FormGroup>
                <label>Unidad</label>
                <Select
                    value={seleccionadoUnidad}
                    onChange={handleInputChangeUnidad}
                    options={unidades.map((elemento) => ({
                    value: elemento.id,
                    label: elemento.unidad,
                    }))}
                    placeholder="Selecciona una opción..."
                />
                </FormGroup>
            </Col>
            </Row>
        </div>
        <hr className="hr" />
    </Form>

      </>
    );
}

export default Add_Inf_Form;
