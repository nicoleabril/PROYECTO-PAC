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
    Label,
  } from "reactstrap";
  // core components
  import AsyncSelect from 'react-select/async';
  import Select from 'react-select';
  import Axios from 'axios';
  import Cookies from 'js-cookie';
  import Echart from "../components/chart/EChart";
import LineChart from "../components/chart/LineChart";
  import { RiArrowGoBackFill } from "react-icons/ri";

const Edit_Form = ({ onSubmit })=> {
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [form] = Form.useForm();
  const user = Cookies.get('usr');
  const [filtroPP, setFiltroPP] = useState('');
  const [area, setArea] = useState('');
  const [justificacionTecnica, setJustificacionTecnica] = useState('');
  const [justificacionEconomica, setJusificacionEconomica] = useState('');
  const [justificacionFortuita, setJustificacionFortuita] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [costo_unitario, setCostoUnitario] = useState('');
  const [seleccionadoPartidasP, setSeleccionadoPartidasP] = useState([]);
  const [partidasPresu, setPartidasPresu] = useState([]);
  const [ppEncontrado, setPPEncontrado] = useState([]);
  const [procesoActual, setProcesoActual] = useState([]);
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const [filtroCPC, setFiltroCPC] = useState('');
  const [procesosCPC, setProcesosCPC] = useState([]);
  const [empresa, setEmpresa] = useState([]);
  const [seleccionadoCPC, setSeleccionadoCPC] = useState('');
  const [seleccionadoRegimen, setSeleccionadoRegimen] = useState('');
  const [seleccionadoCompra, setSeleccionadoCompra] = useState('');
  const [seleccionadoProcSuge, setSeleccionadoProcSuge] = useState('');
  const [seleccionadoUnidad, setSeleccionadoUnidad] = useState('');
  const [regimen, setTipoRegimen] = useState([]);
  const [compra, setCompra] = useState([]);
  const [procSuge, setProcedimientoSugerido] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [tipoProducto, setTipoProducto] = useState('');
  const [total, setTotal] = useState('');
  const [cuatrimestre, setCuatrimestre] = useState('');
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [fechaDocumentos, setFechaDocumentos] = useState('');
  const [idDireccion, setIdDireccion] = useState('');
  const [directorResponsable, setdirectorResponsable] = useState('');
  const [funcionario_revisor, setFuncionarioRevisor] = useState('');
  const [idDepartamento, setIdDepartamento] = useState('');
  const [objetoContratacion, setObjetoContratacion] = useState('');
  const idParaEditar = localStorage.getItem('id');
  const tabla = localStorage.getItem('tabla');

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
          }
      } catch (error) {
          console.error('Error al obtener partida presupuestaria seleccionada:', error);
      }
  };

  obtenerPPEncontrado();

}, [filtroPP]);

const handleChangeFechaPublicacion = (event) => {
  setFechaPublicacion(event.target.value);

  const cuatrimestre = determinarCuatrimestre(event.target.value);
  setCuatrimestre(cuatrimestre);

  const fecha = obtenerFechaDocumentosHabilitantes(event.target.value);
  setFechaDocumentos(fecha);

};

const determinarCuatrimestre = (selectedDate) => {
  const month = new Date(selectedDate).getMonth() + 1;
  const cuatrimestreActual = Math.ceil(month / 3);

  switch (cuatrimestreActual) {
    case 1:
      return 'C1';
    case 2:
      return 'C2';
    case 3:
      return 'C3';
    case 4:
      return 'C4';
    default:
      return '';
  }
};

const obtenerFechaDocumentosHabilitantes = (selectedDate) => {
  const fechaSeleccionada = new Date(selectedDate);
  const anioOriginal = fechaSeleccionada.getFullYear();
  const mesOriginal = fechaSeleccionada.getMonth();
  fechaSeleccionada.setDate(fechaSeleccionada.getDate() - empresa.dias_previos_de_publicacion);
  const anioModificado = fechaSeleccionada.getFullYear();

  // Verificar si la fecha resultante está en el mismo año
  if (anioModificado !== anioOriginal && mesOriginal===0) {
      // Establecer la fecha al 1 de enero del mismo año
      fechaSeleccionada.setFullYear(anioOriginal);
      fechaSeleccionada.setMonth(mesOriginal); // 0 representa enero
      fechaSeleccionada.setDate(0);
  }

  // Formatear la fecha restada como YYYY-MM-DD
  const fechaRestada = fechaSeleccionada.toISOString().split('T')[0];
  return fechaRestada;
};

  useEffect(() => {
    const obtenerDatos = async () => {
        try {
            const userResponse = await Axios.get(`http://localhost:5000/obtener_info_user/${user}`);
            const idDepartamento = userResponse.data[0].depar_usuario;

            const departamentoResponse = await Axios.get(`http://localhost:5000/obtener_departamento_user/${idDepartamento}`);
            const idDireccion = departamentoResponse.data[0].id_direccion;
            const funcionarioRevisorID = departamentoResponse.data[0].id_superior;

            const direccionResponse = await Axios.get(`http://localhost:5000/obtener_direccion_departamento/${idDireccion}`);
            const directorResponsableID = direccionResponse.data[0].id_superior;
            const area = direccionResponse.data[0].nombre_direccion;

            const partidasResponse = await Axios.get(`http://localhost:5000/obtenerPartidasPresupuestarias/${idDireccion}`);
            const partidasPresu = partidasResponse.data;
            const directorResponse = await Axios.get(`http://localhost:5000/obtener_info_user_dado_ID/${directorResponsableID}`);
            const directorResponsable = directorResponse.data[0].correo_usuario;

            const funcionarioResponse = await Axios.get(`http://localhost:5000/obtener_info_user_dado_ID/${funcionarioRevisorID}`);
            const funcionarioRevisor = funcionarioResponse.data[0].correo_usuario;

            // Usar los datos obtenidos
            setArea(area);
            setPartidasPresu(partidasPresu);
            setIdDepartamento(idDepartamento);
            setIdDireccion(idDireccion)
            setdirectorResponsable(directorResponsable);
            setFuncionarioRevisor(funcionarioRevisor);
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


  const obtenerRegimen = async () => {
      try {
          const response = await Axios.get(`http://localhost:5000/obtener_regimen/`);
          setTipoRegimen(response.data);
      } catch (error) {
          console.error('Error al obtener regimen:', error);
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

  const obtenerProcesoActual = async () => {
    if(tabla==='procesos'){
      try {
        const response = await Axios.get(`http://localhost:5000/obtener_proceso/${idParaEditar}`);
        setProcesoActual(response.data[0]);
      } catch (error) {
        console.error('Error al obtener procesos:', error);
      }
    } 
    if(tabla==='reformas'){
      try {
        const response = await Axios.get(`http://localhost:5000/obtener_reforma/${idParaEditar}`);
        setProcesoActual(response.data[0]);
      } catch (error) {
        console.error('Error al obtener procesos:', error);
      }
    }
  };

  const obtenerEmpresa = async () => {
    const username = Cookies.get('usr');
    try {
        const response = await Axios.get(`http://localhost:5000/obtenerEmpresa/`);
        setEmpresa(response.data[0]);
    } catch (error) {
        console.error('Error al obtener información de empresa', error);
    }
  };

  obtenerEmpresa();
  obtenerCPC();
  obtenerUnidades();
  obtenerRegimen();
  obtenerCPC();
  obtenerProcesoActual();
}, []);

useEffect(() => {
  const calcularTotal = () => {
      setTotal(cantidad * parseFloat(costo_unitario));
  };

  calcularTotal();

}, [cantidad, costo_unitario]);

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

const obtenerCompra = async (regimen) => {
  try {
      const response = await Axios.get(`http://localhost:5000/obtener_compra/${regimen}`);
      setCompra(response.data);
  } catch (error) {
      console.error('Error al obtener Compra', error);
  }
};

const obtenerProcSuge = async (regimen, compra) => {
  try {
      const response = await Axios.get(`http://localhost:5000/obtener_procedimiento_sugerido/${regimen}/${compra}`);
      setProcedimientoSugerido(response.data);
  } catch (error) {
      console.error('Error al obtener Compra', error);
  }
};

const obtenerTipoProducto = async (regimen, compra, procSuge) => {
  try {
      const response = await Axios.get(`http://localhost:5000/obtener_tipo_producto/${regimen}/${compra}/${procSuge}`);
      setTipoProducto(response.data[0].tipo_producto);
  } catch (error) {
      console.error('Error al obtener Compra', error);
  }
};

const handleInputChangeRegimen = (selectedOption) => {
  const inputValue = selectedOption ? selectedOption.value : null;
  setSeleccionadoRegimen(selectedOption);
  obtenerCompra(inputValue);
};

const handleInputChangeCompra = (selectedOption) => {
  const inputValue = selectedOption ? selectedOption.value : null;
  setSeleccionadoCompra(selectedOption);
  obtenerProcSuge(seleccionadoRegimen.value, inputValue);
  
};

const handleInputChangeProce = (selectedOption) => {
  setSeleccionadoProcSuge(selectedOption); // Actualizar la opción seleccionada
  // Obtener el valor seleccionado de selectedOption si es necesario
  const inputValue = selectedOption ? selectedOption.value : null;
  obtenerTipoProducto(seleccionadoRegimen.value, seleccionadoCompra.value, inputValue);
  
};

const handleInputChangeUnidad = (selectedOption) => {
  setSeleccionadoUnidad(selectedOption); // Actualizar la opción seleccionada
  // Obtener el valor seleccionado de selectedOption si es necesario
  const inputValue = selectedOption ? selectedOption.value : null;
  
};

const handleInputChangeCantidad = (e) => {
  // Obtén el valor del input
  let inputValue = e.target.value;
  setCantidad(inputValue);
  // Si el valor no es un número, no actualices el estado
  if (!/^\d*$/.test(inputValue)) {
    return;
  }

};

const handleInputBlurCantidad = (e) => {
  let inputValue = e.target.value;
  // Convierte el valor a un número entero
  inputValue = parseInt(inputValue, 10);
  setCantidad(inputValue);
  //form.setFieldsValue({cantidad: inputValue});
};

const handleInputChangeCostoUnitario = (e) => {
  const value = e.target.value; // El valor del input
  setCostoUnitario(value);
};

const handleInputBlurCostoUnitario = (e) => {

  const valueWithDot = costo_unitario.replace(',', '.');
  const parsedValue = parseFloat(valueWithDot);
  const roundedValue = !isNaN(parsedValue) ? parsedValue.toFixed(2) : '';
  setCostoUnitario(roundedValue);
  //form.setFieldsValue({costo_unitario: roundedValue});
}

const handleInputChangeJE = (e) => {
  setJusificacionEconomica(e.target.value);
};

const handleInputChangeJT = (e) => {
  setJustificacionTecnica(e.target.value);
};

const handleInputChangeJF = (e) => {
  setJustificacionFortuita(e.target.value);
};

const handleInputChangeOC = (e) => {
  setObjetoContratacion(e.target.value);
};

const limpiarCampos = () => {
  setJustificacionTecnica('');
  setJusificacionEconomica('');
  setJustificacionFortuita('');
  setPPEncontrado([]);
  setFiltroCPC([]);
  setSeleccionadoCompra([]);
  setSeleccionadoRegimen([]);
  setTipoProducto([]);
  setSeleccionadoPartidasP([]);
  setSeleccionadoProcSuge([]);
  setProcedimientoSugerido([]);
  setObjetoContratacion('');
  setCantidad('');
  setSeleccionadoUnidad([]);
  setCostoUnitario('');
  setTotal('');
  setCuatrimestre('');
  setFechaDocumentos('');
  setFechaPublicacion('');
  // Limpia los otros campos del formulario...
};
const regresar_Inicio = () => {
  window.history.back();
};
const handleSubmit = (e) => {
  e.preventDefault();
  if (justificacionTecnica.trim() === '' || 
    justificacionEconomica.trim() === '' || 
    justificacionFortuita.trim() === '' ||
    ppEncontrado === null || 
    filtroCPC === null || 
    seleccionadoCompra === null || 
    seleccionadoRegimen === null ||
    tipoProducto === null || 
    seleccionadoProcSuge === null || 
    objetoContratacion.trim() === '' || 
    cantidad.toString().trim() === '' ||
    seleccionadoUnidad === null || 
    costo_unitario.trim() === '' ||
    total.toString().trim() === '' || 
    cuatrimestre .trim() === '' ||
    fechaDocumentos.trim() === '' ||
    fechaPublicacion.trim() === '') {
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
  }else{
    form.setFieldsValue({
      area_requirente: area, 
      anio: anioActual, 
      just_tecnica: justificacionTecnica, 
      just_econom: justificacionEconomica, 
      just_caso_fort_fmayor: justificacionFortuita, 
      id_partida_presupuestaria: parseInt(ppEncontrado.id_partida,10), 
      partida_presupuestaria: ppEncontrado.codigo_partida, 
      cpc: filtroCPC.value, 
      tipo_compra: seleccionadoCompra.value, 
      tipo_regimen: seleccionadoRegimen.value, 
      tipo_presupuesto: ppEncontrado.tipo_presupuesto, 
      tipo_producto: tipoProducto, 
      procedimiento_sugerido: seleccionadoProcSuge.value, 
      descripcion: objetoContratacion, 
      cantidad: cantidad, 
      unidad: seleccionadoUnidad.label, 
      costo_unitario: costo_unitario, 
      total: total, 
      cuatrimestre: cuatrimestre, 
      fecha_eedh: fechaDocumentos, 
      fecha_est_public: fechaPublicacion, 
      tipo_reforma: 'Modificacion', 
      observaciones: null, 
      usr_creacion: user, 
      fecha_creacion: fechaActual, 
      id_proceso: parseInt(procesoActual.id_proceso,10), 
      estado_elaborador: null, 
      usr_revisor: funcionario_revisor, 
      usr_aprobador: directorResponsable, 
      usr_consolidador: null, 
      usr_autorizador: null, 
      id_departamento: idDepartamento, 
      version_proceso: procesoActual.version_proceso+1, 
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
          message="Se agregó la reforma correctamente"
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
              Justificación
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
            <Col lg="6">
              <FormGroup>
              <label
                className="form-control-label"
                htmlFor="input-username"
                name="area_requirente"
                label="Área Requirente"
              >Área Requirente</label>
                <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={area}
                  placeholder="Username"
                  type="text"
                  disabled
                />
              </FormGroup>
            </Col>
            <Col lg="6">
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-email"
                >
                  Año
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-email"
                  placeholder="jesse@example.com"
                  defaultValue={anioActual}
                  disabled
                  type="email"
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
                  Justificación Técnica
                </label>
                <Input 
                  className="form-control-alternative"
                  id="input-first-name"
                  type="textarea"
                  value={justificacionTecnica}
                  onChange={handleInputChangeJT}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12" >
              <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-first-name"
                >
                  Justificación Económica
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-first-name"
                  type="textarea"
                  value={justificacionEconomica}
                  onChange={handleInputChangeJE}
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
                  Justificación Caso Fortuito / Fuerza mayor
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-first-name"
                  type="textarea"
                  required
                  value={justificacionFortuita}
                  onChange={handleInputChangeJF}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>
        <hr className="hr" />
      </Form>
        {/* Address */}
        <Row >
          <Col lg={6} >
            <h6 className="titulosReforma sinMargenDerecho">
              Solicitud Reformas
            </h6>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-address"
                >
                  Partida Presupuestaria
                </label>
                <Select
                    value={seleccionadoPartidasP}
                    onChange={handleInputChangePartida}
                    options={opcionesFormateadasPP}
                    isClearable
                    placeholder="Seleccione una opción..."
                    noOptionsMessage={() => 'No se encontraron opciones'}
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-city"
                >
                  CPC
                </label>
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
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Régimen
                </label>
                <Select
                    value={seleccionadoRegimen}
                    onChange={handleInputChangeRegimen}
                    options={regimen.map((option) => ({
                    value: option.tipo_regimen,
                    label: option.tipo_regimen,
                    }))}
                    placeholder="Selecciona una opción..."
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Compra
                </label>
                <Select
                      value={seleccionadoCompra}
                      onChange={handleInputChangeCompra}
                      options={compra.map((option) => ({
                      value: option.tipo_compra,
                      label: option.tipo_compra,
                      }))}
                      isDisabled={!seleccionadoRegimen}
                      placeholder="Selecciona una opción..."
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Procedimiento Sugerido
                </label>
                <Select
                        value={seleccionadoProcSuge}
                        onChange={handleInputChangeProce}
                        options={procSuge.map((option) => ({
                        value: option.procedimiento_sugerido,
                        label: option.procedimiento_sugerido,
                        }))}
                        isDisabled={!seleccionadoCompra}
                        placeholder="Selecciona una opción..."
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Producto
                </label>
                  <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={
                    (seleccionadoRegimen && seleccionadoCompra && seleccionadoProcSuge) 
                      ? tipoProducto 
                      : ''
                  }
                  type="text"
                  disabled
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Objeto de Contratación
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-postal-code"
                  type="textarea"
                  value={objetoContratacion}
                  onChange={handleInputChangeOC}
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Cantidad
                </label>
                <Input type="number" value={cantidad}  onChange={handleInputChangeCantidad} onBlur={handleInputBlurCantidad} />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Unidad
                </label>
                <Select
                    className="form-control-alternative"
                    value={seleccionadoUnidad}
                    onChange={handleInputChangeUnidad}
                    options={unidades.map((elemento) => ({
                    value: elemento.id,
                    label: elemento.unidad,
                    }))}
                    placeholder="Selecciona una opción..."
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Costo Unitario
                </label>
                <Input type="number" value={costo_unitario} onChange={handleInputChangeCostoUnitario} onBlur={handleInputBlurCostoUnitario}/>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Total
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={
                    (cantidad && costo_unitario) 
                      ? total 
                      : ''
                  }
                  type="text"
                  disabled
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Cuatrimestre&nbsp;
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={cuatrimestre}
                  type="text"
                  disabled
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Fecha de Entrega de Documentos Habilitantes
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-username"
                  defaultValue={fechaDocumentos}
                  type="date"
                  disabled
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Fecha Estimada de Publicación
                </label>
                <Input type="date" value={fechaPublicacion} onChange={handleChangeFechaPublicacion}></Input>
            </FormGroup>
          </Col>
          <Col lg={6}>
            <h6 className="titulosReforma sinMargenDerecho">
              Estado Actual
            </h6>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-address"
                >
                  Partida Presupuestaria
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.partida_presupuestaria : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-city"
                >
                  CPC
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.cpc : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Régimen
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.tipo_regimen : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Compra
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.tipo_compra : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Procedimiento Sugerido
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.procedimiento_sugerido : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Tipo Producto
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.tipo_producto : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Objeto de Contratación
                </label>
                <Input
                  className="form-control-alternative"
                  id="input-postal-code"
                  type="textarea"
                  defaultValue={
                    tabla === "reformas" && procesoActual ? procesoActual.descripcion :
                    tabla === "procesos" && procesoActual ? procesoActual.detalle_producto :
                    null
                  }
                  disabled
                />
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Cantidad
                </label>
                <Input 
                    defaultValue={
                      tabla === "reformas" && procesoActual ? procesoActual.cantidad :
                      tabla === "procesos" && procesoActual ? procesoActual.cantidad_anual :
                      null
                    }
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Unidad
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.unidad : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Costo Unitario
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.costo_unitario : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Total
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.total : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Cuatrimestre&nbsp;
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.cuatrimestre : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Fecha de Entrega de Documentos Habilitantes
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.fecha_eedh : null}
                    disabled
                >
                </Input>
            </FormGroup>
            <FormGroup>
                <label
                  className="form-control-label"
                  htmlFor="input-country"
                >
                  Fecha Estimada de Publicación
                </label>
                <Input 
                    defaultValue={procesoActual ? procesoActual.fecha_est_public : null}
                    disabled
                >
                </Input>
            </FormGroup>
          </Col>
        </Row>
      </>
    );
}

export default Edit_Form;