import React, { Component, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import Axios from 'axios';

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
    const [mostrarListaPP, setMostrarListaPP] = useState(false);
    const [mostrarListaCPC, setMostrarListaCPC] = useState(false);
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
    const [seleccionadoTipoProducto, setSeleccionadoTipoProducto] = useState('');
    const [ppEncontrado, setPPEncontrado] = useState([]);
    const [opcionesFiltradasPP, setOpcionesFiltradasPP] = useState([]);
    const [opcionesFiltradasCPC, setOpcionesFiltradasCPC] = useState([]);
    const [error, setError] = useState(null);
    const [justificacionTec, setJustificacionTec] = useState('');
    const [justificacionEco, setJustificacionEco] = useState('');
    const [justificacionFortuita, setJustificacionFortuita] = useState('');
    const [objetoContratacion, setObjetoContratacion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [costoUnitario, setCostoUnitario] = useState('');
    const [fechaPublicacion, setFechaPublicacion] = useState('');
    const [cuatrimestre, setCuatrimestre] = useState('');

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

        obtenerUser();
        obtenerDepartamento();
        obtenerDireccion();
        obtenerProceso();
        
    }, [idDepartamento, idDireccion, area, justificacionEco, proceso]);

    useEffect(() => {
        const obtenerPartidasPresupuestarias = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtenerPartidasPresupuestarias/${idDireccion}`);
                setPartidasPresu(response.data);
                setOpcionesFiltradasPP(response.data);
            } catch (error) {
                console.error('Error al obtener partidas:', error);
                setError(error);
            }
        };

        const obtenerCPC = async () => {
            try {
                const response = await Axios.get(`http://190.154.254.187:5000/obtener_cpc/`);
                setProcesosCPC(response.data);
                setOpcionesFiltradasCPC(response.data);
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
        obtenerPartidasPresupuestarias();
        obtenerCPC();
        obtenerUnidades();
        obtenerRegimen();
      }, []);
    
    const determinarCuatrimestre = (selectedDate) => {
        const month = new Date(selectedDate).getMonth() + 1;
        const cuatrimestreActual = Math.ceil(month / 3);
      
        switch (cuatrimestreActual) {
          case 1:
            return '1er cuatrimestre';
          case 2:
            return '2do cuatrimestre';
          case 3:
            return '3er cuatrimestre';
          case 4:
            return '4to cuatrimestre';
          default:
            return '';
        }
    };

    const handleChangeFechaPublicacion = (event) => {
        setFechaPublicacion(event.target.value);
    
        const cuatrimestre = determinarCuatrimestre(event.target.value);
        setCuatrimestre(cuatrimestre);
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

    const obtenerPPEncontrado = async (codigo_partida) => {
        try {
            const response = await Axios.get(`http://190.154.254.187:5000/obtenerPartidaPresupuestaria/${codigo_partida}`);
            setPPEncontrado(response.data[0]);
        } catch (error) {
            console.error('Error al obtener partida presupuestaria seleccionada:', error);
            setError(error);
        }
    };

    const handleInputChangePartida = (e) => {
        const inputValue = e.target.value;
        setFiltroPP(inputValue);
        // Lógica de filtrado aquí
        const opcionesFiltradasPP = partidasPresu.filter(opcion =>
            `${opcion.index}: ${opcion.opcion}`.toLowerCase().includes(inputValue.toLowerCase())
          );
        setOpcionesFiltradasPP(opcionesFiltradasPP);
        setMostrarListaPP(true); // Mostrar lista al escribir
    };

    const handleInputChangeRegimen = (e) => {
        const inputValue = e.target.value;
        setSeleccionadoRegimen(inputValue);
        obtenerCompra(inputValue);
    };

    const handleInputChangeCompra = (e) => {
        const inputValue = e.target.value;
        setSeleccionadoCompra(inputValue);
        obtenerProcSuge(seleccionadoRegimen, inputValue);
        
    };

    const handleInputChangeProce = (e) => {
        const inputValue = e.target.value;
        setSeleccionadoProcSuge(inputValue);
        obtenerTipoProducto(seleccionadoRegimen, seleccionadoCompra, inputValue);
        
    };

    const handleInputChangeTipoProducto = (e) => {
        const inputValue = e.target.value;
        setSeleccionadoTipoProducto(inputValue);
    };

    const handleInputChangeCPC = (e) => {
        const inputValue = e.target.value;
        setFiltroCPC(inputValue);
        // Lógica de filtrado aquí
        const opcionesFiltradasCPC = procesosCPC.filter(opcion =>
          `${opcion.index}: ${opcion.opcion}`.toLowerCase().includes(inputValue.toLowerCase())
        );
        setOpcionesFiltradasCPC(opcionesFiltradasCPC);
        setMostrarListaCPC(true); // Mostrar lista al escribir
      };

    const regresar_Inicio = () => {
        window.history.back();
    };

    const cancelar = () => {
        window.location.reload();
    };

    return (
        <div style={body}>
            <div>
                <h1>Incluir Reforma</h1>
                <div>
                    <form>
                        <div style={encabezaGrupoForm}>
                        <table width="100%">
                            <tr>
                                <td style={{ width: '80%' }}><label style={etiqueta}>Justificación</label></td>
                                <td onClick={() => regresar_Inicio()} style={{ width: '10%' }}>Regresar</td>
                                <td onClick={() => cancelar()} style={{ width: '10%' }}>Cancelar</td>
                            </tr>
                        </table>
                        </div>  
                        <div className="form-group" style={grupoForm}>
                            <table width="100%">
                                <tr>
                                    <td style={{ width: '15%' }}><label style={etiqueta}>Área Requiriente:</label></td>
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
                                <td style={{ width: '20%' }}><label style={etiqueta}>Partida Presupuestaria</label></td>
                                <td style={{ width: '70%' }}>
                                <input
                                    className="form-control"
                                    type="text"
                                    value={filtroPP}
                                    onChange={handleInputChangePartida}
                                    placeholder="Seleccione una opción..."
                                />
                                </td>
                            </tr>
                        </table>
                                    {mostrarListaPP && (
                                        <ul>
                                            {opcionesFiltradasPP.map((opcion, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setSeleccionadoPartidasP(`${opcion.index} - ${opcion.opcion}`);
                                                        setMostrarListaPP(false);
                                                        setFiltroPP(`${opcion.index}: ${opcion.opcion}`);
                                                        obtenerPPEncontrado(opcion.index);
                                                    }}
                                                >
                                                    {opcion.index}: {opcion.opcion}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                    )}
                                    
                                    {seleccionadoPartidasP && (
                                        //<td style={{ width: '10%' }}><button style={BotonCircular}>Guardar</button></td></tr>
                                        <div>
                                            <p>Opción seleccionada: {seleccionadoPartidasP}</p>
                                            <table width="100%">
                                                <tr>
                                                    <td style={{ width: '10%' }}><label style={etiqueta}>Código Partida</label></td>
                                                    <td style={{ width: '20%' }}><label>{ppEncontrado.codigo_partida}</label></td>
                                                    <td style={{ width: '10%' }}></td>
                                                    <td style={{ width: '30%' }}><label style={etiqueta}>Presupuesto</label></td>
                                                    <td style={{ width: '20%' }}><label>{ppEncontrado.valor_disponible}</label></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '20%' }}><label style={etiqueta}>Actividad</label></td>
                                                    <td style={{ width: '70%' }}><label>{ppEncontrado.actividad}</label></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '20%' }}><label style={etiqueta}>Tipo Presupuesto</label></td>
                                                    <td style={{ width: '70%' }}><label>{ppEncontrado.tipo_presupuesto}</label></td>
                                                </tr>
                                            </table>
                                        </div>
                                        
                                    )}
                            <table width="100%">
                                <tr>
                                    <td style={{ width: '20%' }}><label style={etiqueta}>CPC</label></td>
                                    <td style={{ width: '70%' }}>
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={filtroCPC}
                                        onChange={handleInputChangeCPC}
                                        placeholder="Seleccione una opción..."
                                    />
                                    </td>
                                </tr>
                            </table>
                                {mostrarListaCPC && (
                                    <ul>
                                        {opcionesFiltradasCPC.map((opcion, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setSeleccionadoCPC(`${opcion.index}: ${opcion.opcion}`);
                                                    setMostrarListaCPC(false);
                                                    setFiltroCPC(`${opcion.index}: ${opcion.opcion}`);
                                                }}
                                            >
                                                {opcion.index}: {opcion.opcion}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {seleccionadoCPC && (
                                    <div>
                                        <p>Opción seleccionada: {seleccionadoCPC}</p>
                                        <table width="100%">
                                                <tr>
                                                    <td style={{ width: '20%' }}><label style={etiqueta}>Descripción CPC</label></td>
                                                    <td style={{ width: '70%' }}><label>{seleccionadoCPC}</label></td>
                                                </tr>
                                        </table>
                                    </div>
                                )}
                            <label style={etiqueta}>Tipo Régimen</label><br/>
                            <select value={seleccionadoRegimen} onChange={handleInputChangeRegimen} className="form-control">
                                <option value="">Selecciona una opción...</option>
                                {regimen.map((option, index) =>(
                                    <option key={index} value={option.tipo_regimen}>{option.tipo_regimen}</option>
                                )
                                )}
                            </select>
                            <label style={etiqueta}>Tipo Compra</label><br/>
                            {seleccionadoRegimen && (
                                <select value={seleccionadoCompra} onChange={handleInputChangeCompra} className="form-control">
                                    <option value="">Selecciona una opción...</option>
                                    {compra.map((option, index) =>(
                                        <option key={index} value={option.tipo_compra}>{option.tipo_compra}</option>
                                    )
                                    )}
                                </select>
                            )}
                            <label style={etiqueta}>Procedimiento Sugerido</label><br/>
                            {seleccionadoRegimen && seleccionadoCompra && (
                                <select value={seleccionadoProcSuge} onChange={handleInputChangeProce} className="form-control">
                                    <option value="">Selecciona una opción...</option>
                                    {procSuge.map((option, index) =>(
                                        <option key={index} value={option.procedimiento_sugerido}>{option.procedimiento_sugerido}</option>
                                    )
                                    )}
                                </select>
                            )}
                            <label style={etiqueta}>Tipo Producto</label><br/>
                            {seleccionadoRegimen && seleccionadoCompra && seleccionadoProcSuge &&(
                                <label>{tipoProducto}</label>
                            )}
                            <br/><label style={etiqueta}>Objeto de Contratación</label><br/>
                            <textarea
                                className="form-control"
                                id="objetoContra"
                                value={objetoContratacion}
                                onChange={(e) => setObjetoContratacion(e.target.value)}
                            />
                            <label style={etiqueta}>Cantidad</label><br/>
                            <label>
                                <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)}/>
                            </label><br/>
                            <label style={etiqueta}>Unidad</label><br/>
                            <select className="form-control">
                                <option value="">Selecciona una opción...</option>
                                {unidades.map(elemento =>(
                                    <option key={elemento.id} value={elemento.id}>{elemento.unidad}</option>
                                )
                                )}
                            </select>
                            <label style={etiqueta}>Costo Unitario</label><br/>
                            <label>
                                <input type="number" value={costoUnitario} onChange={(e) => setCostoUnitario(e.target.value)}/>
                            </label><br/>
                            <label style={etiqueta}>Total</label><br/>
                            <label style={etiqueta}>Cuatrimestre</label><br/>
                            <label >{cuatrimestre}</label><br/>
                            <label style={etiqueta}>Fecha de Entrega de Documentos Habilitantes</label><br/>
                            <label style={etiqueta}>Fecha Estimada de Publicación</label><br/>
                            <label>
                                <input type="date" value={fechaPublicacion} onChange={handleChangeFechaPublicacion} />
                            </label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Add_Form;