import React, { useState } from 'react';
import './css/SidebarMenu.css'; // Importa tus estilos CSS personalizados

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className={`sidebar${showSidebar ? 'show' : ''}`}>
      <button onClick={toggleSidebar} className="menu-toggle btn btn-primary bg-dark m5">☰</button>
      <ul className="list-group">
        <li className="list-group-item">Menú 1</li>
        <li className="list-group-item">
          Menú 2
          <ul className="list-group sub-menu">
            <li className="list-group-item">Submenú 1</li>
            <li className="list-group-item">Submenú 2</li>
          </ul>
        </li>
        <li className="list-group-item">
          Menú 3
          <ul className="list-group sub-menu">
            <li className="list-group-item">Submenú 3</li>
            <li className="list-group-item">Submenú 4</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
