import React, { Component, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import Axios from 'axios';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

const body = {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '60%',

};

const mensaje_Error = {
    color: '#FF0000',
    fontWeight: 'bold'
};

const BotonCircular =  {
    borderRadius: '0%',
    width: '120px',
    height: '50px',
    backgroundColor: '#176B87',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
};

const etiqueta = {
    fontWeight: 'bold',
    marginRight: '5px',
}

const grupoForm = {
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: '0px 2px 2px 2px',
    borderRadius: '0px 0px 5px 5px',
    padding: '10px',
    width: '100%',
}

const encabezaGrupoForm = {
    border: '2px solid #000',
    borderRadius: '5px 5px 0px 0px',
    backgroundColor: '#176B87',
    fontWeight: 'bold',
    color: 'white',
    width: '100%',
    padding: '10px',
}


const Add_Form = (props) => {
    const user = Cookies.get('usr');
    const [regimen, setTipoRegimen] = useState([]);
    const [compra, setCompra] = useState([]);
    const [procSuge, setProcedimientoSugerido] = useState([]);
    const [id_proceso, setIDProceso] = useState('');
    const [tipoProducto, setTipoProducto] = useState('');
    const [idDepartamento, setIdDepartamento] = useState('');
    const [idDireccion, setIdDireccion] = useState('');
    const [area, setArea] = useState('');
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const [proceso, setProceso] = useState([]);
    const [partidasPresu, setPartidasPresu] = useState([]);
    const [procesosCPC, setProcesosCPC] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [filtroPP, setFiltroPP] = useState('');
    const [filtroCPC, setFiltroCPC] = useState('');
    const [seleccionadoPartidasP, setSeleccionadoPartidasP] = useState('');
    const [seleccionadoCPC, setSeleccionadoCPC] = useState('');
    const [seleccionadoRegimen, setSeleccionadoRegimen] = useState('');
    const [seleccionadoCompra, setSeleccionadoCompra] = useState('');
    const [seleccionadoProcSuge, setSeleccionadoProcSuge] = useState('');
    const [seleccionadoUnidad, setSeleccionadoUnidad] = useState('');
    const [ppEncontrado, setPPEncontrado] = useState([]);
    const [error, setError] = useState(null);
    const [justificacionTec, setJustificacionTec] = useState('');
    const [justificacionEco, setJustificacionEco] = useState('');
    const [justificacionFortuita, setJustificacionFortuita] = useState('');
    const [objetoContratacion, setObjetoContratacion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [costoUnitario, setCostoUnitario] = useState('');
    const [fechaPublicacion, setFechaPublicacion] = useState('');
    const [fechaDocumentos, setFechaDocumentos] = useState('');
    const [cuatrimestre, setCuatrimestre] = useState('');
    const [total, setTotal] = useState('');
    const [mensajeError, setMensajeError] = useState({
        mensaje_justificacionTec: '',mensaje_justificacionEco: '',mensaje_justificacionFortuita: '',mensaje_seleccionadoPartidasP:'', mensaje_seleccionadoCPC:'',
        mensaje_seleccionadoRegimen:'', mensaje_seleccionadoCompra:'', mensaje_seleccionadoProc:'', mensaje_objetoContr:'', mensaje_cantidad:'', mensaje_unidad:'',
        mensaje_costo:'', mensaje_fecha_estimada:'',
    });

    useEffect(() => {
        const obtenerUser = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_info_user/${user}`);
                setIdDepartamento(response.data[0].depar_usuario);
            } catch (error) {
                console.error('Error al obtener procesos:', error);
                setError(error);
            }
        }

        const obtenerDepartamento = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_departamento_user/${idDepartamento}`);
                setIdDireccion(response.data[0].id_direccion);
            } catch (error) {
                console.error('Error al obtener departamento:', error);
                setError(error);
            }
        }

        const obtenerDireccion = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_direccion_departamento/${idDireccion}`);
                setArea(response.data[0].nombre_direccion);
            } catch (error) {
                console.error('Error al obtener direccion:', error);
                setError(error);
            }
        }

        const obtenerPartidasPresupuestarias = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtenerPartidasPresupuestarias/${idDireccion}`);
                setPartidasPresu(response.data);
                
            } catch (error) {
                console.error('Error al obtener partidas:', error);
                setError(error);
            }
        };

        obtenerUser();
        obtenerDepartamento();
        obtenerDireccion();
        obtenerPartidasPresupuestarias();
        
    }, [idDepartamento, idDireccion] );

    useEffect(() => {
        const calcularTotal = () => {
            setTotal(cantidad * costoUnitario);
        };

        calcularTotal();

    }, [cantidad, costoUnitario]);
    
    useEffect(() => {
        
        const obtenerCPC = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_cpc/`);
                setProcesosCPC(response.data);
            } catch (error) {
                console.error('Error al obtener cpc:', error);
                setError(error);
            }
        };


        const obtenerRegimen = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_regimen/`);
                setTipoRegimen(response.data);
            } catch (error) {
                console.error('Error al obtener regimen:', error);
                setError(error);
            }
        };

        const obtenerUnidades = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_Unidades/`);
                setUnidades(response.data);
            } catch (error) {
                console.error('Error al obtener unidades:', error);
                setError(error);
            }
        };
        obtenerCPC();
        obtenerUnidades();
        obtenerRegimen();
      }, []);
    
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

    const obtenerIDProceso = async () => {
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtener_id_proceso/`);
            console.log(response.data.nextval+'dhbdh')
            setIDProceso(response.data.nextval);
        } catch (error) {
            console.error('Error al obtener procesos:', error);
            setError(error);
        }
    };

    
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


    const obtenerFechaDocumentosHabilitantes = (selectedDate) => {
        const fechaSeleccionada = new Date(selectedDate);
        fechaSeleccionada.setDate(fechaSeleccionada.getDate() - 30);
        console.log(fechaSeleccionada);
        // Formatear la fecha restada como YYYY-MM-DD
        const fechaRestada = fechaSeleccionada.toISOString().split('T')[0];
        console.log(fechaRestada);
        return fechaRestada;
      };

    const handleChangeFechaPublicacion = (event) => {
        setFechaPublicacion(event.target.value);
    
        const cuatrimestre = determinarCuatrimestre(event.target.value);
        setCuatrimestre(cuatrimestre);

        const fecha = obtenerFechaDocumentosHabilitantes(event.target.value);
        setFechaDocumentos(fecha);

      };
    

    const obtenerCompra = async (regimen) => {
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtener_compra/${regimen}`);
            setCompra(response.data);
        } catch (error) {
            console.error('Error al obtener Compra', error);
            setError(error);
        }
    };

    const obtenerProcSuge = async (regimen, compra) => {
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtener_procedimiento_sugerido/${regimen}/${compra}`);
            setProcedimientoSugerido(response.data);
        } catch (error) {
            console.error('Error al obtener Compra', error);
            setError(error);
        }
    };

    const obtenerTipoProducto = async (regimen, compra, procSuge) => {
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtener_tipo_producto/${regimen}/${compra}/${procSuge}`);
            setTipoProducto(response.data[0].tipo_producto);
        } catch (error) {
            console.error('Error al obtener Compra', error);
            setError(error);
        }
    };

    useEffect(() => {
        const obtenerPPEncontrado = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtenerPartidaPresupuestaria/${filtroPP}`);
                setPPEncontrado(response.data[0]);
            } catch (error) {
                console.error('Error al obtener partida presupuestaria seleccionada:', error);
                setError(error);
            }
        };

        obtenerPPEncontrado();

    }, [seleccionadoPartidasP]);
    
    

    const handleInputChangePartida = (selectedOption) => {
        if (selectedOption) {
            setFiltroPP(selectedOption.value);
            setSeleccionadoPartidasP(selectedOption);
          } else {
            setSeleccionadoPartidasP(''); // Maneja el caso en el que se limpie la selección
            setFiltroPP('');
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

    function verificarCatalogoElectronico(variable) {
        if (variable === 'CATALOGO ELECTRONICO') {
          return 'SI';
        } else {
          return 'NO';
        }
    }
      

    const opcionesFormateadasPP = partidasPresu.map((opcion) => ({
        value: opcion.index,
        label: `${opcion.index}: ${opcion.opcion}`,
    }));

    const opcionesFormateadasCPC = procesosCPC.map((opcion) => ({
        value: opcion.index,
        label: `${opcion.index}: ${opcion.opcion}`,
    }
    ));


    const handleInputChangeCPC = (opcion) => {
        if (opcion) {
            setFiltroCPC(opcion);
            setSeleccionadoCPC({ index: `${opcion.value}`, opcion: `${opcion.label}` });
          } else {
            setSeleccionadoCPC(''); 
            setFiltroCPC('');
        }
      };

    const regresar_Inicio = () => {
        window.history.back();
    };

    const cancelar = () => {
        window.location.reload();
    };

    const handleSubmit = async (event) => {
        const errores= {
            mensaje_justificacionTec: '',mensaje_justificacionEco: '',mensaje_justificacionFortuita: '',mensaje_seleccionadoPartidasP:'', mensaje_seleccionadoCPC:'',
            mensaje_seleccionadoRegimen:'', mensaje_seleccionadoCompra:'', mensaje_seleccionadoProc:'', mensaje_objetoContr:'', mensaje_cantidad:'', mensaje_unidad:'',
            mensaje_costo:'', mensaje_fecha_estimada:'',
        };
        event.preventDefault();
        let formValido = true;
        if (!justificacionTec.trim()) {
            errores.mensaje_justificacionTec ='*Ingrese justificación técnica';
            formValido = false;
        }
        if (!justificacionEco.trim()) {
            errores.mensaje_justificacionEco = '*Ingrese justificación económica';
            formValido = false;
        }
        if (!justificacionFortuita.trim()) {
            errores.mensaje_justificacionFortuita = ('*Ingrese justificación caso fortuito o fuerza mayor');
            formValido = false;
        }
        if (!seleccionadoPartidasP) {
            errores.mensaje_seleccionadoPartidasP = ('*Seleccione partida presupuestaria');
            formValido = false;
        }
        if (!seleccionadoCPC) {
            errores.mensaje_seleccionadoCPC = ('*Seleccione CPC');
            formValido = false;
        }
        if (!seleccionadoRegimen) {
            errores.mensaje_seleccionadoRegimen = ('*Seleccione régimen');
            formValido = false;
        }
        if (!seleccionadoCompra) {
            errores.mensaje_seleccionadoCompra = ('*Seleccione compra');
            formValido = false;
        }
        if (!seleccionadoProcSuge) {
            errores.mensaje_seleccionadoProc = ('*Seleccione procedimiento sugerido');
            formValido = false;
        }
        if (!seleccionadoUnidad) {
            errores.mensaje_unidad = ('*Seleccione unidad');
            formValido = false;
        }
        if (!objetoContratacion.trim()) {
            errores.mensaje_objetoContr = ('*Ingrese objeto de contratación');
            formValido = false;
        }
        if (!cantidad.trim()) {
            errores.mensaje_cantidad = ('*Ingrese cantidad de producto');
            formValido = false;
        }
        if (!costoUnitario.trim()) {
            errores.mensaje_costo = ('*Ingrese costo unitario de producto');
            formValido = false;
        }
        if (!fechaPublicacion.trim()) {
            errores.mensaje_fecha_estimada = ('*Ingrese fecha estimada de publicación');
            formValido = false;
        }
        if(!formValido){
            setMensajeError(errores);
        }
        if(formValido){
            obtenerIDProceso();
            setMensajeError([]);
            try {
              const response = await Axios.post('http://190.154.254.187:5000/registrarProceso/', {
                proceso: id_proceso,
                partida: ppEncontrado.id_partida, 
                anio: anioActual, 
                cpc: filtroCPC.value, 
                tipoCompra: seleccionadoCompra.value, 
                codigoProceso: null, 
                detalleProducto: objetoContratacion, 
                cantidadAnual: cantidad, 
                estado: 'NO INICIADO', 
                costoUnitario: costoUnitario, 
                total: total, 
                cuatrimestre: cuatrimestre, 
                fechaEedh: fechaDocumentos, 
                fechaReedh: null, 
                fechaEstPublic: fechaPublicacion, 
                fechaRealPublic: null, 
                tipoProducto: tipoProducto, 
                catalogoElectronico: verificarCatalogoElectronico(seleccionadoProcSuge.value), 
                procedimeintoSugerido: seleccionadoProcSuge.value, 
                fondosBid: null, 
                codOpePresBid: null, 
                codigoProyectoBid: null, 
                tipoRegimen: seleccionadoRegimen.value, 
                tipoPresupuesto: ppEncontrado.tipo_presupuesto, 
                funcionarioResponsable: 'Esto es una prueba', 
                directorResponsable: 'Esto es una prueba', 
                versionProceso: 1, 
                unidad: seleccionadoUnidad.label, 
                presupuestoPublicado: null, 
                observaciones: null, 
                revisorCompras: 'Esto es una prueba', 
                funcionarioRevisor: 'Esto es una prueba', 
                fechaUltModif:null, 
                usrCreacion: user, 
                usrUltModif: null, 
                fechaCreacion: fechaActual, 
                direccion: area, 
                partidaPresupuestaria: ppEncontrado.codigo_partida, 
                pacFasePreparatoriaPK: id_proceso+'-'+1, 
                secuencialResolucion: null, 
                eliminado: 'NO', 
                estadoFasePreparatoria: 'NO INICIADO', 
                fechaEdp: null, 
                fechaCpc: null, 
                fechaRv: null, 
                fechaSip: null, 
                fechaExp: null, 
                fechaElp: null, 
                fechaSi: null, 
                fechaRi: null, 
                fechaFin: null, 
                revisorJuridico:null, 
                idDepartamento: idDepartamento, 
                reqIp: 'NO'
              });
    
              console.log('Respuesta del servidor:', response.data);
              
            } catch (error) {
              console.error('Error al enviar datos:', error);
              
            }
        }
    };

    return (
        <div style={body}>
            <div>
                <h1>Incluir Reforma</h1>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div style={encabezaGrupoForm}>
                        <table width="100%">
                            <tr>
                                <td style={{ width: '80%' }}><label style={etiqueta}>Justificación</label></td>
                                <td onClick={() => regresar_Inicio()} style={{ width: '10%' }}>Regresar</td>
                                <td style={{ width: '10%' }}><button type="submit">Guardar</button></td>
                            </tr>
                        </table>
                        </div>  
                        <div className="form-group" style={grupoForm}>
                            <table width="100%">
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Área Requiriente:</label></td>
                                    <td style={{ width: '15%' }}><label>{area}</label></td>
                                    <td style={{ width: '40%' }}></td>
                                    <td style={{ width: '15%', textAlign: 'right' }}><label style={etiqueta}>Año:</label></td>
                                    <td style={{ width: '15%' }}><label>{anioActual}</label></td>
                                </tr>
                            </table>
                            <br />
                            
                            <label style={etiqueta}>Justificación Técnica</label>
                            <textarea
                                className="form-control"
                                id="justificacionTec"
                                value={justificacionTec}
                                onChange={(e) => setJustificacionTec(e.target.value)}
                                placeholder="MOTIVAR LA RAZON TÉCNICA DEL PORQUE SE INCLUYE, CANCELA O MODIFICA EL PAC."
                            />
                            <p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_justificacionTec}</p>
                            <label style={etiqueta}>Justificación Económica</label>
                            <textarea
                            placeholder="MOTIVAR LA RAZON ECONÓMICA DEL PORQUE SE INCLUYE, CANCELA O MODIFICA EL PAC (En caso de no aplicar señalar los motivos por los cuales no impact al presupuesto)."
                                className="form-control"
                                id="justificacionEco"
                                value={justificacionEco}
                                onChange={(e) => setJustificacionEco(e.target.value)}
                                
                            />
                            <p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_justificacionEco}</p>
                            <label style={etiqueta}>Justificación Caso Fortuito / Fuerza mayor</label>
                            <textarea
                                type="text"
                                className="form-control"
                                id="justificacionFortuita"
                                value={justificacionFortuita}
                                onChange={(e) => setJustificacionFortuita(e.target.value)}
                                placeholder="MOTIVAR LA RAZON DEL PORQUE SE INCLUYE, CANCELA O MODIFICA EL PAC (Este punto solo aplica para caso fortuito o fuerza mayor, caso contrario señalar &quot;No Aplica&quot;)"
                            />
                            <p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_justificacionFortuita}</p>
                        </div>
                        <br />
                        <br />
                        <div style={encabezaGrupoForm}>Solicitud Reformas</div>
                        <div className="form-group" style={grupoForm}>
                            <table width="100%">
                                <tr>
                                    <td style={{ width: '25%' }}><label style={etiqueta}>Partida Presupuestaria</label></td>
                                    <td style={{ width: '70%' }}>
                                    <Select
                                        value={seleccionadoPartidasP}
                                        onChange={handleInputChangePartida}
                                        options={opcionesFormateadasPP}
                                        isClearable
                                        placeholder="Seleccione una opción..."
                                        noOptionsMessage={() => 'No se encontraron opciones'}
                                    />
                                    </td>
                                </tr>
                                <tr><td colspan="3"><p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_seleccionadoPartidasP}</p></td></tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Código Partida</label></td>
                                    <td style={{ width: '20%' }}><label>{ppEncontrado.codigo_partida}</label></td>
                                    <td style={{ width: '50%' }}><label style={etiqueta}>Presupuesto</label></td>
                                    <td style={{ width: '10%' }}><label>{ppEncontrado.valor_disponible}</label></td>
                                </tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Actividad</label></td>
                                    <td style={{ width: '70%' }}><label>{ppEncontrado.actividad}</label></td>
                                </tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Tipo Presupuesto</label></td>
                                    <td style={{ width: '70%' }}><label>{ppEncontrado.tipo_presupuesto}</label></td>
                                </tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>CPC</label></td>
                                    <td style={{ width: '70%' }}>
                                        <AsyncSelect
                                            value={filtroCPC}
                                            defaultOptions={opcionesFormateadasCPC.slice(0, 100)}
                                            onChange={handleInputChangeCPC}
                                            loadOptions={loadOptions}
                                            isClearable
                                            placeholder="Seleccione una opción..."
                                            noOptionsMessage={() => 'No se encontraron opciones'}
                                        />
                                    </td>
                                </tr>
                                <tr><td colspan="3"><p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_seleccionadoCPC}</p></td></tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Descripción CPC</label></td>
                                    <td style={{ width: '70%' }}><label>{seleccionadoCPC.opcion}</label></td>
                                </tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Tipo Régimen</label></td>
                                    <td style={{ width: '70%' }}>
                                        <Select
                                                value={seleccionadoRegimen}
                                                onChange={handleInputChangeRegimen}
                                                options={regimen.map((option) => ({
                                                value: option.tipo_regimen,
                                                label: option.tipo_regimen,
                                                }))}
                                                placeholder="Selecciona una opción..."
                                        />
                                    </td>
                                </tr>
                                <tr><td colspan="3"><p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_seleccionadoRegimen}</p></td></tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Tipo Compra</label></td>
                                    <td style={{ width: '70%' }}>
                                        {seleccionadoRegimen && (
                                            <Select
                                                value={seleccionadoCompra}
                                                onChange={handleInputChangeCompra}
                                                options={compra.map((option) => ({
                                                value: option.tipo_compra,
                                                label: option.tipo_compra,
                                                }))}
                                                placeholder="Selecciona una opción..."
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr><td colspan="3"><p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_seleccionadoCompra}</p></td></tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Procedimiento Sugerido</label></td>
                                    <td style={{ width: '70%' }}>
                                        {seleccionadoRegimen && seleccionadoCompra && (
                                            <Select
                                                value={seleccionadoProcSuge}
                                                onChange={handleInputChangeProce}
                                                options={procSuge.map((option) => ({
                                                value: option.procedimiento_sugerido,
                                                label: option.procedimiento_sugerido,
                                                }))}
                                                placeholder="Selecciona una opción..."
                                            />
                                        )}
                                    </td>
                                </tr>
                                <tr><td colspan="3"><p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_seleccionadoProc}</p></td></tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Tipo Producto</label></td>
                                    <td style={{ width: '70%' }}>
                                        {seleccionadoRegimen && seleccionadoCompra && seleccionadoProcSuge &&(
                                            <label>{tipoProducto}</label>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Objeto de Contratación</label></td>
                                    <td style={{ width: '70%' }}>
                                        <textarea
                                            className="form-control"
                                            id="objetoContra"
                                            value={objetoContratacion}
                                            onChange={(e) => setObjetoContratacion(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr><td colspan="3"><p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_objetoContr}</p></td></tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Cantidad</label></td>
                                    <td style={{ width: '70%' }}>
                                        <label>
                                            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)}/>
                                        </label>
                                    </td>
                                </tr>
                                <tr><td colspan="3"><p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_cantidad}</p></td></tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Unidad</label></td>
                                    <td style={{ width: '70%' }}>
                                        <Select
                                                value={seleccionadoUnidad}
                                                onChange={handleInputChangeUnidad}
                                                options={unidades.map((elemento) => ({
                                                value: elemento.id,
                                                label: elemento.unidad,
                                                }))}
                                                placeholder="Selecciona una opción..."
                                        />
                                    </td>
                                </tr>
                                <tr><td colspan="3"><p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_unidad}</p></td></tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Costo Unitario</label></td>
                                    <td style={{ width: '70%' }}>
                                        <label>
                                            <input type="number" value={costoUnitario} onChange={(e) => setCostoUnitario(e.target.value)}/>
                                        </label>
                                    </td>
                                </tr>
                                <tr><td colspan="3"><p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_costo}</p></td></tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Total</label></td>
                                    <td style={{ width: '70%' }}>
                                        {cantidad && costoUnitario && (
                                            <label>{total}</label>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Cuatrimestre</label></td>
                                    <td style={{ width: '70%' }}>
                                        <label >{cuatrimestre}</label><br/>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Fecha de Entrega de Documentos Habilitantes</label></td>
                                    <td style={{ width: '70%' }}>
                                        <label >{fechaDocumentos}</label><br/>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Fecha Estimada de Publicación</label></td>
                                    <td style={{ width: '70%' }}>
                                        <label>
                                            <input type="date" value={fechaPublicacion} onChange={handleChangeFechaPublicacion} />
                                        </label>
                                    </td>
                                </tr>
                                <tr><td colspan="3"><p className="mensaje-validacion" style={mensaje_Error}>{mensajeError.mensaje_fecha_estimada}</p></td></tr>
                            </table>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Add_Form;