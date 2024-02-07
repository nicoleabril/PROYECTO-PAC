import React, { useState } from 'react';
import './css/SidebarMenu.css';
import 'font-awesome/css/font-awesome.min.css';

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className={`sidebar${showSidebar ? 'show' : ''}`}>
      <button onClick={toggleSidebar} className={`${showSidebar ? "menu-toggle btn btn-primary bg-dark m5 inline-elements fa fa-angle-double-right fa-2x" : "menu-toggle btn btn-primary bg-dark m5 inline-elements fa fa-angle-double-down fa-2x"}`}></button>
      <ul className="list-group">
        <li className="list-group-item">
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fa fa-home inline-elements fa-2x"></i><p className="inline-elements">Inicio</p>
            </button>
            <ul className="dropdown-menu" aria-labelledby="DropDownMenu1">
              <li><a className="dropdown-item" href='/inicio'>Inicio</a></li>
            </ul>
          </div>
        </li>
        <li className="list-group-item">
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fa fa-bar-chart inline-elements fa-2x"></i><p className="inline-elements">Consultas</p>
            </button>
            <ul className="dropdown-menu" aria-labelledby="DropDownMenu2">
              <li><a className="dropdown-item" href='/pac'>PAC</a></li>
              <li><a className="dropdown-item" href='/cpc'>CPC</a></li>
            </ul>
          </div>
        </li>
        <li className="list-group-item">
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="DropDownMenu3" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fa fa-tasks inline-elements fa-2x"></i><p className="inline-elements">Reformas</p>
            </button>
            <ul className="dropdown-menu" aria-labelledby="DropDownMenu3">
              <li><a className="dropdown-item" href='/mis_reformas'>Mis Reformas</a></li>
              <li><a className="dropdown-item" href='/revision_reformas'>Revisión Reformas</a></li>
              <li><a className="dropdown-item" href='/aprobacion_reformas'>Aprobación Reformas</a></li>
              <li><a className="dropdown-item" href='/consolidacion_reformas'>Consolidación Reformas</a></li>
              <li><a className="dropdown-item" href='/autorizacion_reformas'>Autorización Reformas</a></li>
              <li><a className="dropdown-item" href='/resoluciones_reformas'>Resoluciones Reformas</a></li>
              <li><a className="dropdown-item" href='/seguimiento_reformas'>Seguimiento de Reformas</a></li>
              <li><a className="dropdown-item" href='/actualizacion_pac'>Actualización PAC</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;