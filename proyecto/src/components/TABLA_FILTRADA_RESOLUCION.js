import {flexRender,useReactTable,getCoreRowModel,getPaginationRowModel,getSortedRowModel,getFilteredRowModel} from "@tanstack/react-table";
import React, { useState, Component, useEffect } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label} from 'reactstrap';  
import Axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
const enlace={
    cursor:'pointer',
    color: 'blue',
    width: '3%',
}

const modalStyles={
    position: "absolute",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
}

const buscarIcono={
    margin:'4px 4px 0 0',
    color: '#a1a1a1'
}

const encabezado={
    padding:'4px 10px',
    borderBottom: '0 none'
}

const fila_seleccionada_estilo ={
  backgroundColor: '#cce5ff',
}

const styles = `
/* Agrega estos estilos a tu hoja de estilos CSS */

/* Estilos para resaltar la fila seleccionada */
.fila-seleccionada {
  background-color: #cce5ff  !important; /* Cambia el color de fondo según tus preferencias */
}

/* Estilos para el encabezado de la tabla */
.ui-widget-header {
  background-color: #f2f2f2; /* Cambia el color de fondo del encabezado según tus preferencias */
  padding: 8px;
  text-align: left;
}

/* Estilos para el botón de búsqueda */
.ui-widget-header i.fa-search {
  margin-right: 8px;
  color: #666; /* Cambia el color del icono de búsqueda según tus preferencias */
}

/* Estilos para los botones de paginación */
button {
  margin: 4px;
  padding: 8px;
  cursor: pointer;
  background-color: #007bff; /* Cambia el color de fondo del botón según tus preferencias */
  color: #fff; /* Cambia el color del texto del botón según tus preferencias */
  border: none;
  border-radius: 4px;
}

button:disabled {
  background-color: #ccc; /* Cambia el color de fondo del botón deshabilitado según tus preferencias */
  color: #666; /* Cambia el color del texto del botón deshabilitado según tus preferencias */
}

/* Estilos para los íconos en las celdas de acción */
td[style*="fa-eye"],
td[style*="fa-pencil"],
td[style*="fa-trash"] {
  cursor: pointer;
  color: #007bff; /* Cambia el color del ícono según tus preferencias */
}

/* Puedes añadir más estilos según sea necesario */

`;


const detalle_reforma = (id) => {
  window.location.href=`/detalle_reforma/${id}/reformas/false`;
};

const editar_reforma = (id) => {
  window.location.href=`/editar_resolucion/${id}`;
};

const ver_cambios = (id) => {
  window.location.href=`/cambios_reforma/${id}/reformas/false`;
};


  const TablaFiltrada = ({ data, columns, visualizar, editar, eliminar, verCambios , onSeleccionarFila }) => {
    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const [tablaData, setTablaData] = useState(data);
    const [eliminado, setEliminado] = useState(null);
    useEffect(() => {
        // Actualiza la tabla cuando cambia la data
        setTablaData(data);
    }, [data]);

    const eliminar_reforma = (id) => {
      abrirModal();
      setEliminado(id);
    };

    const eliminarCompleto = async () => {
      try {
        const response = await Axios.delete(`http://190.154.254.187:5000/eliminarFisicaReforma`, {secuencial_reforma: eliminado});
        console.log('Respuesta del servidor:', response.data);
        await toast.success(response.data.message);
      } catch (error) {
          console.error('Error al eliminar Reforma:', error);
      }
    }

    const [state, setState] = useState({
      abierto: false,
    });
    
    const abrirModal=()=>{
        setState({abierto: !state.abierto});
    } 
  
    const table = useReactTable({ 
      data: tablaData, 
      columns: columns, 
      getCoreRowModel: getCoreRowModel(), 
      getPaginationRowModel: getPaginationRowModel(), 
      getSortedRowModel: getSortedRowModel(), 
      getFilteredRowModel: getFilteredRowModel(),
      state: {sorting, globalFilter: filtering},
      onSortingChange: setSorting,
      onGlobalFilterChange: setFiltering,
    });
  
    const seleccionarFila = (row) => {
      if (filaSeleccionada === row.id) {
        setFilaSeleccionada(null);
        onSeleccionarFila && onSeleccionarFila(null);
      } else {
        setFilaSeleccionada(row.id);
        onSeleccionarFila && onSeleccionarFila(row.original.secuencial_reforma);
      }
    };


    const generarEnlaceDescarga = (blob, nombreArchivo) => {
      const enlaceDescarga = document.createElement('a');
      enlaceDescarga.href = URL.createObjectURL(blob);
      enlaceDescarga.download = nombreArchivo; // Establecer el nombre del archivo de descarga
      enlaceDescarga.textContent = `Ver/Descargar`;
  
      return enlaceDescarga;
    }
  
    return (
      <div>
        <div className="ui-widget-header" style={encabezado}>
          <i className="fa fa-search" style={buscarIcono}></i>
          <input 
            className="ui-toolbar-input-search ui-inputtext ui-corner-all ui-state-default ui-widget" 
            pinputtext="" 
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            placeholder="Buscar" 
            type="text"
          />
        </div>
        <table className="table table-striped table-hover">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {verCambios && (<th></th>)}
                {visualizar && (<th></th>)}
                {editar && (<th></th>)}
                {eliminar && (<th></th>)}
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {
                          {asc: '⬆️', desc: '⬇️'}[header.column.getIsSorted() ?? null]
                        }
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                style={{ backgroundColor: filaSeleccionada === row.id ? '#cce5ff' : 'inherit' }}
                onClick={() => seleccionarFila(row)}
              >
                {visualizar && (<td onClick={() => detalle_reforma(row.original.secuencial_resolucion)} style={enlace}><i className="fa fa-eye" aria-hidden="true"></i></td>)}
                {verCambios && (<td onClick={() => ver_cambios(row.original.secuencial_resolucion)} style={enlace}><i className="fa fa-eye" aria-hidden="true"></i></td>)}
                {editar && (<td onClick={() => editar_reforma(row.original.secuencial_resolucion)} style={enlace}><i className="fa fa-pencil" aria-hidden="true"></i></td>)}
                {eliminar && (<td onClick={() => eliminar_reforma(row.original.secuencial_resolucion)} style={enlace}><i className="fa fa-trash" aria-hidden="true"></i></td>)}
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ width: 'auto' }}>
                    {cell.column.id === 'url_detalle_resol' ? (
                      <div>
                          {console.log('Datos binarios del PDF:', cell.row.original.url_detalle_resol)}
                          <a
                            href={URL.createObjectURL(new Blob([new Uint8Array(cell.row.original.url_detalle_resol.data)], { type: 'application/pdf' }))}
                            download="Resolucion.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver/Descargar
                          </a>
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <table width="100%">
            <tr>
                <td style={{ width: 'auto',textAlign: 'right' }}><button onClick={() => table.setPageIndex(0)}>Primera Página</button></td>
                <td style={{ width: 'auto',textAlign: 'right' }}><button disabled={!table.getCanPreviousPage()}onClick={() => table.previousPage()}><i className="fa fa-backward" aria-hidden="true"></i></button></td>
                <td style={{ width: 'auto',textAlign: 'left' }}><button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
                <i className="fa fa-forward" aria-hidden="true"></i></button></td>
                <td style={{ width: 'auto',textAlign: 'left' }}><button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                Última Página
                </button></td>
            </tr>
          </table>
        </div>
        <style>{styles}</style>
        <Modal isOpen={state.abierto} style={modalStyles}>
          <ModalHeader>
              Confirmación de Eliminación
          </ModalHeader>
          <ModalBody>
          <p>¿Está seguro de que desea eliminar este proceso?</p>
          </ModalBody>
          <ModalFooter>
              <Button color="danger" onClick={eliminarCompleto}>Sí, estoy seguro</Button>
              <Button color="secondary" onClick={abrirModal}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  };
  export default TablaFiltrada;