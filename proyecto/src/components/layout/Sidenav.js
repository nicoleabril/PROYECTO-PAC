import React, { useState, useEffect } from "react";
import Axios from 'axios';
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import { Image } from "antd";
import { BiSolidBusiness, BiSolidChevronRightCircle, BiSolidChevronDownCircle } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { RiSettings3Fill } from "react-icons/ri";
import { IoIosListBox } from "react-icons/io";
import { HiDocumentText, HiDocumentSearch } from "react-icons/hi";
import { FaUserGear } from "react-icons/fa6";
import { LuClipboardList } from "react-icons/lu";
import { LuFileText , LuFileStack  } from "react-icons/lu";
import logo from "../../assets/images/logo.png"; 

function Sidenav({ color, onToggleSidebar, onMouseEnterSidebar, onMouseLeaveSidebar }) {
  const [empresa, setEmpresa] = useState([]);
  const [menu, setMenu] = useState([]);
  const [submenu, setSubMenu] = useState([]);
  const [imagen, setImagen] = useState([]);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeSubsubmenu, setActiveSubsubmenu] = useState(null);
  const [subsubmenuPosition, setSubsubmenuPosition] = useState({ top: 0, left: 0 });
  const username = Cookies.get('usr');
  function separarNombreYExtension(nombreImagen) {
    const partesNombreImagen = nombreImagen.split('.');
    const nombre = partesNombreImagen.slice(0, -1).join('.'); // Unir las partes del nombre (por si el nombre contiene puntos)
    const extension = partesNombreImagen[partesNombreImagen.length - 1]; // Obtener la última parte como extensión

    return extension;
  }
  
  const iconoComponentes = {
    '<GoHomeFill />': GoHomeFill,//Inicio
    '<IoIosListBox />': IoIosListBox,//Procesos
    '<HiDocumentText />': HiDocumentText,//Reformas
    '<RiSettings3Fill />': RiSettings3Fill,//Configuracion
    '<HiDocumentSearch />': HiDocumentSearch,//Consultas
    '<FaUserGear />': FaUserGear,//Perfil
    '<LuClipboardList />':LuClipboardList,//Fase Preparatoria
    '<LuFileText />':LuFileText,//Fase Precontractual
    '<LuFileStack />':LuFileStack,//Infimas Cuantias
    // Agrega más aquí según sea necesario
    // Agrega tus componentes de icono aquí según sea necesario
  };

  useEffect(() => {
    const obtenerMenu = async () => {
        try {
          const response = await Axios.get(`http://localhost:5000/obtener_menu/${username}`);
          setMenu(obtenerMenuPrincipal(response.data));
          setSubMenu(response.data);
        } catch (error) {
          console.error('Error al obtener opciones del menu:', error);
        }
    };

    const obtenerEmpresa = async () => {
      try {
        const response = await Axios.get(`http://localhost:5000/obtenerEmpresa/`);
        setEmpresa(response.data[0]);
        const extension = separarNombreYExtension(response.data[0].logo_empresa);
        const blob = new Blob([new Uint8Array(response.data[0].imagen_empresa.data)], { type: 'image/' + extension });
        const url = URL.createObjectURL(blob);
        setImagen(url);
      } catch (error) {
        console.error('Error al obtener información de empresa', error);
      }
    };
    obtenerEmpresa();
    obtenerMenu();
  }, [username]);

  const obtenerSubmenus = (idOpcion) => {
    const submenusDirectos = submenu.filter(opcion => opcion.pertenece_a === idOpcion && opcion.tipo === 2);
    const subsubmenus = submenu.filter(opcion => opcion.pertenece_a === idOpcion && opcion.tipo === 3);
    return submenusDirectos.concat(subsubmenus);
  };
  
  
  const obtenerMenuPrincipal = (opcionesMenu) => {
    return opcionesMenu.filter(opcion => opcion.pertenece_a === null || opcion.pertenece_a === undefined && opcion.tipo === 1);
  };

  const toggleSubmenu = (idOpcion) => {
    adjustMarginTopOnClick(idOpcion); // Ajustar el margen
    setActiveSubmenu(activeSubmenu === idOpcion ? null : idOpcion); // Establecer el submenú activo
    setActiveSubsubmenu(null); // Ocultar los submenús secundarios
  };
  
  const toggleSubsubmenu = (idOpcion) => {
    adjustMarginTopOnClick(idOpcion); // Ajustar el margen
    setActiveSubsubmenu(activeSubsubmenu === idOpcion ? null : idOpcion);
  };
  
  
  const adjustMarginTopOnClick = (idOpcion) => {
    const submenu = document.querySelector(`.submenu-${idOpcion}`);
    const nextElement = document.querySelector(`.menu-item-${idOpcion} + .menu-item`);
    let subsubmenuHeight = 0;
  
    // Si hay submenús secundarios
    const subsubmenu = document.querySelector(`.submenu-submenu-${idOpcion}`);
    if (subsubmenu) {
      subsubmenuHeight = subsubmenu.getBoundingClientRect().height;
    }
  
    if (submenu && nextElement) {
      if (submenu.style.display === "block") {
        submenu.style.display = "none";
        nextElement.style.marginTop = "0";
        if (subsubmenu) {
          subsubmenu.style.display = "none";
        }
      } else {
        submenu.style.display = "block";
        const submenuHeight = submenu.getBoundingClientRect().height;
        nextElement.style.marginTop = `${submenuHeight}px`; // Ajuste de margen para el submenú
        if (subsubmenu) {
          subsubmenu.style.display = "block";
          const totalHeight = submenuHeight + subsubmenuHeight;
          nextElement.style.marginTop = `${totalHeight}px`; // Ajuste de margen para el submenú y subsubmenú combinados
        }
  
        // Ajustar margen de los elementos del menú principal
        const mainMenuItems = document.querySelectorAll('.menu-item');
        let adjustMargin = false;
        mainMenuItems.forEach(item => {
          if (adjustMargin) {
            const height = item.getBoundingClientRect().height;
            item.style.marginTop = `${subsubmenuHeight}px`;
          }
          if (item === nextElement) {
            adjustMargin = true;
          }
        });
      }
    }
  };
  
  
  

  const obtenerComponenteIcono = (nombreIcono, className) => {
    const componenteIcono = iconoComponentes[nombreIcono];
    return componenteIcono ? React.createElement(componenteIcono, { className }) : null;
  };

  const hideSubmenu = (idOpcion) => {
    setActiveSubmenu(null);
    setActiveSubsubmenu(null); // Ocultar los submenús secundarios
    const submenu = document.querySelector(`.submenu-${idOpcion}`);
    if (submenu) {
      submenu.style.display = "none";
      const nextElement = document.querySelector(`.menu-item-${idOpcion} + .menu-item`);
      if (nextElement) {
        nextElement.style.marginTop = "0";
      }
    }
  };

  return (
    <>
      <nav className="menuPrincipal">
        <ul>
          <li>
            <a className="logoNav">
              {imagen ? (
                <Image src={(imagen)} style={{ maxWidth: '30px', maxHeight: '30px' }} className="icon" />
              ) : (
                <BiSolidBusiness className="icon" />
              )}
              {empresa && empresa.nombre_empresa ? (
                <span className="nav-item">{empresa.nombre_empresa}</span>
              ) : (
                <span className="nav-item">Empresa</span>
              )}
            </a>
          </li>
          {menu.map(opcion => (
            <li key={opcion.id_opcion} className={`menu-item menu-item-${opcion.id_opcion} ${obtenerSubmenus(opcion.id_opcion).length > 0 ? "submenu" : ""} ${!opcion.habilitado ? "deshabilitado" : ""}`} onMouseLeave={() => hideSubmenu(opcion.id_opcion)}>
              {opcion.descripcion === 'Mi Perfil' && (<hr className="hr" />)}
              {opcion.descripcion === 'Inicio' ? (
                <NavLink to="/panel" className="menu" onClick={() => setActiveSubmenu(null)}>
                  {obtenerComponenteIcono(opcion.icono, "icon")}
                  <span className="nav-item">{opcion.descripcion}</span>
                  {obtenerSubmenus(opcion.id_opcion).length > 0 && (
                    <span className="chevron" onClick={(e) => { e.preventDefault(); adjustMarginTopOnClick(opcion.id_opcion); }}>
                      <BiSolidChevronRightCircle />
                    </span>
                  )}
                </NavLink>
              ) : (
                opcion.descripcion === 'Mi Perfil' ? (
                  <NavLink to="/mi-perfil" className="menu" onClick={() => setActiveSubmenu(null)}>
                    {obtenerComponenteIcono(opcion.icono, "icon")}
                    <span className="nav-item">{opcion.descripcion}</span>
                    {obtenerSubmenus(opcion.id_opcion).length > 0 && (
                      <span className="chevron" onClick={(e) => { e.preventDefault(); adjustMarginTopOnClick(opcion.id_opcion); }}>
                        <BiSolidChevronRightCircle className={activeSubmenu === opcion.id_opcion ? "chevron-expanded" : ""} />
                      </span>
                    )}
                  </NavLink>
                ) : (
                  <div className="menu" onClick={() => toggleSubmenu(opcion.id_opcion)}>
                    {obtenerComponenteIcono(opcion.icono, "icon")}
                    <span className="nav-item">{opcion.descripcion}</span>
                    {obtenerSubmenus(opcion.id_opcion).length > 0 && (
                      <span className="chevron">
                        {activeSubmenu === opcion.id_opcion ? <BiSolidChevronDownCircle /> : <BiSolidChevronRightCircle />}
                      </span>
                    )}
                  </div>
                )
              )}
              {obtenerSubmenus(opcion.id_opcion).length > 0 && (
  <ul className={`submenu submenu-${opcion.id_opcion} ${activeSubmenu === opcion.id_opcion ? "active" : ""}`}>
    {obtenerSubmenus(opcion.id_opcion).map(submenu => (
      <li key={submenu.id_opcion} className={`submenu-secundario ${!submenu.habilitado ? "deshabilitado" : ""}`}>
        <div className="submenu-header" onClick={() => toggleSubsubmenu(submenu.id_opcion)}>
          {submenu.tipo === 2 && obtenerSubmenus(submenu.id_opcion).length > 0 ? (
            <NavLink to={submenu.ruta ? submenu.ruta : '#'} className="subsubmenu-item">
              <span className="texto-submenu">{submenu.descripcion}</span>
            </NavLink>
          ) : (
            <NavLink to={submenu.ruta ? submenu.ruta : '#'} className={`item-submenu ${activeSubsubmenu === submenu.id_opcion ? "subsubmenu-active" : ""}`}>
              <span className="texto-submenu">{submenu.descripcion}</span>
            </NavLink>
          )}
          {submenu.tipo === 2 && obtenerSubmenus(submenu.id_opcion).length > 0 && (
            <span className="chevron-submenu">
              {activeSubsubmenu === submenu.id_opcion ? <BiSolidChevronDownCircle /> : <BiSolidChevronRightCircle />}
            </span>
          )}
        </div>
        {activeSubsubmenu === submenu.id_opcion && (
          <div className="subsubmenu-container">
            <ul
              className={`submenu-submenu submenu-submenu-${submenu.id_opcion} ${
                activeSubsubmenu === submenu.id_opcion ? "active" : ""
              }`}
            >
              {obtenerSubmenus(submenu.id_opcion).map(subsubmenu => (
                <li key={subsubmenu.id_opcion}>
                  <NavLink to={subsubmenu.ruta ? subsubmenu.ruta : "#"} className="item-submenu ">
                    {subsubmenu.descripcion}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    ))}
  </ul>
)}


            </li>
          ))}
        </ul>
      </nav>
    </>
  );
   
}

export default Sidenav;
