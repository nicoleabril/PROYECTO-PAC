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
                console.log(idDepartamento);
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_departamento_user/${idDepartamento}`);
                setIdDireccion(response.data[0].id_direccion);
            } catch (error) {
                console.error('Error al obtener procesos:', error);
                setError(error);
            }
        }

        const obtenerDireccion = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_direccion_departamento/${idDireccion}`);
                setArea(response.data[0].nombre_direccion);
            } catch (error) {
                console.error('Error al obtener procesos:', error);
                setError(error);
            }
        }

        const obtenerProceso = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_proceso/${props.idProceso}`);
                setProceso(response.data);
                setJustificacionEco(response.data[0].año);
            } catch (error) {
                console.error('Error al obtener procesos:', error);
                setError(error);
            }
        };

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
        obtenerProceso();
        obtenerPartidasPresupuestarias();
        
    }, [idDepartamento, idDireccion, area, justificacionEco, proceso]);

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
            setSeleccionadoCPC(''); // Maneja el caso en el que se limpie la selección
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
        event.preventDefault();
        try {
          const response = await Axios.post('http://190.154.254.187:5000/registrarProceso/', {
            partida: 5657, 
            anio: '7211200132', 
            cpc: '7211200132', 
            tipoCompra: 'fsfsg', 
            codigoProceso: 'jkfvg', 
            detalleProducto: 'fsfsg', 
            cantidadAnual: 1, 
            estado: 'gdgd', 
            costoUnitario: 24, 
            total: 24, 
            cuatrimestre: 'fsfsg', 
            fechaEedh: '2005-11-20', 
            fechaReedh: '2005-11-20', 
            fechaEstPublic: '2005-11-20', 
            fechaRealPublic: '2005-11-20', 
            tipoProducto: 'fsfsg', 
            catalogoElectronico: 'NO', 
            procedimeintoSugerido: 'fsfsg', 
            fondosBid: '7211200132', 
            codOpePresBid: '7211200132', 
            codigoProyectoBid: '7211200132', 
            tipoRegimen: 'fsfsg', 
            tipoPresupuesto: 'fsfsg', 
            funcionarioResponsable: 'fsfsg', 
            directorResponsable: 'fsfsg', 
            versionProceso: 1, 
            unidad: 1, 
            presupuestoPublicado: 1, 
            observaciones: '7211200132', 
            revisorCompras: '7211200132', 
            funcionarioRevisor: '2005-11-20', 
            fechaUltModif:'2005-11-20', 
            usrCreacion:'2005-11-20', 
            usrUltModif:'2005-11-20', 
            fechaCreacion: '2005-11-20', 
            direccion: '2005-11-20', 
            partidaPresupuestaria: 'fsfsg', 
            pacFasePreparatoriaPK: '150-123', 
            secuencialResolucion: 3, 
            eliminado: 'NO', 
            estadoFasePreparatoria: 'NO INICIADO', 
            fechaEdp: '2005-11-20', 
            fechaCpc: '2005-11-20', 
            fechaRv: '2005-11-20', 
            fechaSip: '2005-11-20', 
            fechaExp: '2005-11-20', 
            fechaElp: '2005-11-20', 
            fechaSi: '2005-11-20', 
            fechaRi: '2005-11-20', 
            fechaFin: '2005-11-20', 
            revisorJuridico:'7211200132', 
            idDepartamento: 'G120002', 
            reqIp: 'NO'
          });

          console.log('Respuesta del servidor:', response.data);
          
        } catch (error) {
          console.error('Error al enviar datos:', error);
          
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
                            <label style={etiqueta}>Justificación Económica</label>
                            <textarea
                            placeholder="MOTIVAR LA RAZON ECONÓMICA DEL PORQUE SE INCLUYE, CANCELA O MODIFICA EL PAC (En caso de no aplicar señalar los motivos por los cuales no impact al presupuesto)."
                                className="form-control"
                                id="justificacionEco"
                                value={justificacionEco}
                                onChange={(e) => setJustificacionEco(e.target.value)}
                                
                            />
                            <label style={etiqueta}>Justificación Caso Fortuito / Fuerza mayor</label>
                            <textarea
                                type="text"
                                className="form-control"
                                id="justificacionFortuita"
                                value={justificacionFortuita}
                                onChange={(e) => setJustificacionFortuita(e.target.value)}
                                placeholder="MOTIVAR LA RAZON DEL PORQUE SE INCLUYE, CANCELA O MODIFICA EL PAC (Este punto solo aplica para caso fortuito o fuerza mayor, caso contrario señalar &quot;No Aplica&quot;)"
                            />
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
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Cantidad</label></td>
                                    <td style={{ width: '70%' }}>
                                        <label>
                                            <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)}/>
                                        </label>
                                    </td>
                                </tr>
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
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>Costo Unitario</label></td>
                                    <td style={{ width: '70%' }}>
                                        <label>
                                            <input type="number" value={costoUnitario} onChange={(e) => setCostoUnitario(e.target.value)}/>
                                        </label>
                                    </td>
                                </tr>
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
                            </table>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Add_Form;