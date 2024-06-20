import React, { useState } from 'react';
import Sidenav from './Sidenav';
import { Card, Breadcrumb } from 'antd';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaUserTie } from "react-icons/fa6";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { RiProfileLine } from "react-icons/ri";
import Cookies from 'js-cookie';

const Main = ({ children, showHeader = true, showFooter = true, showSidebar = true }) => {
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const [isUserProfileHovered, setUserProfileHovered] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMouseInside, setIsMouseInside] = useState(false); // Nuevo estado para controlar si el cursor está dentro de la sidenav
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const username = Cookies.get('usr');
  const anio = new Date().getFullYear();

  const handleSubMenuOpen = () => {
    setSubMenuOpen(true);
  };

  const handleSubMenuClose = () => {
    setSubMenuOpen(false);
  };

  const handleMouseEnterSidebar = () => {
    setSidebarExpanded(true);
  };

  const handleMouseLeaveSidebar = () => {
    setSidebarExpanded(false);
    setIsMouseInside(false); // Cuando se sale de la sidenav, indicar que el cursor está fuera de ella
  };

  const handleUserProfileMouseEnter = () => {
    setUserProfileHovered(true);
    handleSubMenuOpen();
  };

  const handleUserProfileMouseLeave = () => {
    setUserProfileHovered(false);
    handleSubMenuClose();
  };

  const handleLogOut = () => {
    Cookies.remove('authToken');
    Cookies.remove('usr');
    Cookies.remove('rol');
    window.location.href = '/sign-up';
  };

  const handleMiPerfil = () => {
    window.location.href = '/mi-perfil';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      {showHeader && (
        <div className="header" style={{ zIndex: 2, background: 'white', boxShadow: '0 20px 35px rgba(0, 0, 0, 0.2)', padding: '16px' }}>
          <div className="title">
            <h2>SISTEMA DE COMPRAS PÚBLICAS</h2>
          </div>
          <div
            className="userProfile"
            onMouseEnter={handleUserProfileMouseEnter}
            onMouseLeave={handleUserProfileMouseLeave}
          >
            <FaUserTie />
            <span>{username}</span>
            {(isSubMenuOpen || isUserProfileHovered) && (
              <div className="subMenuUser">
                <p className="subMenuUser1" onClick={handleMiPerfil}>
                  <RiProfileLine className="iconSubMenuUser" />Mi Perfil
                </p>
                <p className="subMenuUser2" onClick={handleLogOut}>
                  <RiLogoutCircleRLine className="iconSubMenuUser" />Cerrar Sesión
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidenav */}
        {showSidebar && (
          <div
            className={`sidenav ${isSidebarExpanded ? 'expanded' : ''}`}
            onMouseEnter={handleMouseEnterSidebar}
            onMouseLeave={handleMouseLeaveSidebar}
          >
            <Sidenav color="#1890ff" isMouseInside={isMouseInside} /> {/* Pasar el estado isMouseInside como prop */}
          </div>
        )}

        {/* Contenido principal */}
        <div className="main-content" style={{ flex: 1, paddingBottom: showFooter ? '20px' : '0' }}>
          <Card className='cardBreadCrumb'>
            <Breadcrumb>
              <Breadcrumb.Item>
                <RouterLink to="/panel">Inicio</RouterLink>
              </Breadcrumb.Item>
              {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('>')}`;
                const isLast = index === pathnames.length - 1;

                const formatName = (str) => {
                  return str
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                };

                const formattedName = formatName(name);

                return isLast ? (
                  <Breadcrumb.Item key={formattedName}>
                    {formattedName}
                  </Breadcrumb.Item>
                ) : (
                  <Breadcrumb.Item key={formattedName}>
                    <RouterLink to={routeTo}>{formattedName}</RouterLink>
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </Card>

          {/* Contenido */}
          <div className="contenidoPrincipal">{children}</div>
        </div>
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="footer" style={{ background: 'lightgray', padding: '16px', textAlign: 'center' }}>
          <h2>© {anio}</h2> 
        </div>
      )}
    </div>
  );
};

export default Main;