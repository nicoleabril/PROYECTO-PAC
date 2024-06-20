/*!
=========================================================
ULTIMA VERSION 2.0.0
*/
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Mis_Procesos from "./pages/Mis Procesos";
import Reformas from "./pages/Mis Reformas";
import Revision_Reformas from "./pages/Revision_Reformas";
import Aprobacion_Reformas from "./pages/Aprobacion_Reformas";
import Consolidar_Reformas from "./pages/Consolidacion_Reformas";
import Autorizacion_Reformas from "./pages/Autorizacion_Reformas";
import Resoluciones_Reformas from "./pages/Resoluciones_Reformas";
import Seguimiento from "./pages/Seguimiento";
import SignUp from "./pages/SignUp";
import Add_Form from "./components/ADD_FORM";
import Main from "./components/layout/Main";
import Inclusion_Proceso from "./pages/Inclusion_Proceso";
import Edicion_Proceso from "./pages/Edicion_Proceso";
import Visualizar_Proceso from "./pages/Visualizar_Proceso";
import Direcciones from "./pages/Direcciones";
import Empresa from "./pages/Empresa";
import Inclusion_Direccion from "./pages/Inclusion_Direccion";
import Edicion_Direccion from "./pages/Edicion_Direccion";
import Departamentos from "./pages/Departamentos";
import Inclusion_Departamento from "./pages/Inclusion_Departamento";
import Edicion_Departamento from "./pages/Edicion_Departamento";
import Usuarios from "./pages/Usuarios";
import Inclusion_Usuario from "./pages/Inclusion_Usuario";
import Edicion_Usuario from "./pages/Edicion_Usuario";
import Roles from "./pages/Roles";
import Inclusion_Rol from "./pages/Inclusion_Roles";
import Edicion_Rol from "./pages/Edicion_Roles";
import Acceso_Rol from "./pages/Accesos_Rol";
import Parametros from "./pages/Parametros";
import Documentos_Generales from "./pages/Documentos_Generales";
import Documentos_Habilitantes from "./pages/Documentos_Habilitantes";
import Eliminacion_Proceso from "./pages/Eliminar_Proceso";
import Visualizar_Reforma from "./pages/Visualizacion_Reforma";
import Visualizar_Resolucion from "./pages/Visualizacion_Resolucion";
import Mi_Perfil from "./pages/Mi Perfil";
import Edicion_Resolucion from "./pages/Edicion_Resolucion";
import Inclusion_Doc_Hab from "./pages/Inclusion_Doc_Hab";
import Edicion_Doc_Hab from "./pages/Edicion_Doc_Hab";
import PAC from "./pages/PAC";
import CPC from "./pages/CPC";
import Mis_Infimas from "./pages/Mis_Infimas";
import Inclusion_Infima from "./pages/Incluir_Infima";
import Visualizar_Infima from "./pages/Visualizar_Infima";
//FASE PREPARATORIA
import Documentos_Preparatorios from "./pages/Documentos_Preparatorios";
import Control_Previo_Compras from "./pages/Control_Previo_Compras";
import Revision_Juridico from "./pages/Revision_Juridico";
import Informe_De_Pertinencia from "./pages/Informe_De_Pertinencia";
import Expediente_Preparatorio from "./pages/Expediente_Preparatorio";
import Elaboracion_De_Pliegos from "./pages/Elaboracion_De_Pliegos";
import Solicitud_De_Inicio from "./pages/Solicitud_De_Inicio";
import Resolucion_De_Inicio from "./pages/Resolucion_De_Inicio";

import Documentos_Preparatorios_Cat from "./pages/Documentos_Preparatorios_Cat";
import Control_Previo_Compras_Cat from "./pages/Control_Previo_Compras_Cat";
import Solicitud_De_Inicio_Cat from "./pages/Solicitud_De_Inicio_Cat";
import Resolucion_De_Inicio_Cat from "./pages/Resolucion_De_Inicio_Cat";
import Liquidar_Catalogo_Electronico from "./pages/Liquidar_Catalogo_Electronico";
import Historial_Comentarios from "./pages/Historial_Comentarios";

import Documentos_Preparatorios_Inf from "./pages/Documentos_Preparatorios_Inf";
import Control_Previo_Compras_Inf from "./pages/Control_Previo_Compras_Inf";
import Solicitud_De_Publicacion from "./pages/Solicitud_De_Publicacion";
import Publicacion_De_Necesidad from "./pages/Publicacion_De_Necesidad";
import Cuadro_Comparativo from "./pages/Cuadro_Comparativo";
import Elaboracion_De_Orden from "./pages/Elaboracion_De_Orden";
import Finalizar_Infima from "./pages/Finalizar_Infima";
import Bitacora_Infima from "./pages/Bitacora_Infima";

import Subir_SOCE from "./pages/Subir_Fase_Preparatoria_SOCE";
import Subir_CAT from "./pages/Subir_Fase_Preparatoria_CAT";
import Subir_Infima_Cuantia from "./pages/Subir_Infima_Cuantia";
import Procesos_Desiertos from "./pages/Procesos_Desiertos";
import Reasignar_Responsable from "./pages/Reasignar_Responsable";
import Replanificar_Procesos from "./pages/Replanificar_Procesos";
import Reporte_Replanificacion_Procesos from "./pages/Reporte_Replanificacion_Procesos";
import Formulario_Replanificacion_Proceso from "./pages/Formulario_Replanificacion_Proceso";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/add-form" exact component={Add_Form} />
        <Route path="/" exact><SignUp /></Route>
        <Main>
          <Route exact path="/panel" component={Home} />
          <Route exact path="/acceso-de-rol" component={Acceso_Rol} />
          <Route exact path="/mi-perfil" component={Mi_Perfil} />
          <Route exact path="/incluir-procesos" component={Inclusion_Proceso} />
          <Route exact path="/incluir-ínfimas-cuantías" component={Inclusion_Infima} />
          <Route exact path="/incluir-direcciones" component={Inclusion_Direccion} />
          <Route exact path="/incluir-departamentos" component={Inclusion_Departamento} />
          <Route exact path="/incluir-usuarios" component={Inclusion_Usuario} />
          <Route exact path="/incluir-doc-habilitantes" component={Inclusion_Doc_Hab} />
          <Route exact path="/incluir-roles" component={Inclusion_Rol} />
          <Route exact path="/configurar-empresa" component={Empresa} />
          <Route exact path="/configurar-parametros" component={Parametros} />
          <Route exact path="/configurar-direcciones" component={Direcciones} />
          <Route exact path="/configurar-departamentos" component={Departamentos} />
          <Route exact path="/configurar-usuarios" component={Usuarios} />
          <Route exact path="/configurar-roles" component={Roles} />
          <Route exact path="/configurar-documentos-generales" component={Documentos_Generales} />
          <Route exact path="/configurar-documentos-habilitantes" component={Documentos_Habilitantes} />
          <Route exact path="/editar-procesos" component={Edicion_Proceso} />
          <Route exact path="/eliminar-procesos" component={Eliminacion_Proceso} />
          <Route exact path="/editar-direcciones" component={Edicion_Direccion} />
          <Route exact path="/editar-departamentos" component={Edicion_Departamento} />
          <Route exact path="/editar-usuarios" component={Edicion_Usuario} />
          <Route exact path="/editar-roles" component={Edicion_Rol} />
          <Route exact path="/editar-resolucion" component={Edicion_Resolucion} />
          <Route exact path="/editar-doc-hab" component={Edicion_Doc_Hab} />
          <Route exact path="/visualizar-procesos" component={Visualizar_Proceso} />
          <Route exact path="/visualizar-infimas" component={Visualizar_Infima} />
          <Route exact path="/visualizar-reformas" component={Visualizar_Reforma} />
          <Route exact path="/visualizar-resoluciones" component={Visualizar_Resolucion} />
          <Route exact path="/visualizar-PAC" component={PAC} />
          <Route exact path="/visualizar-CPC" component={CPC} />
          <Route exact path="/mis-procesos" component={Mis_Procesos} />
          <Route exact path="/mis-ínfimas-cuantías" component={Mis_Infimas} />
          <Route exact path="/procesos-desiertos" component={Procesos_Desiertos} />
          <Route exact path="/mis-reformas" component={Reformas} />
          <Route exact path="/revisar-reformas" component={Revision_Reformas} />
          <Route exact path="/aprobar-reformas" component={Aprobacion_Reformas} />
          <Route exact path="/consolidar-reformas" component={Consolidar_Reformas} />
          <Route exact path="/autorizar-reformas" component={Autorizacion_Reformas} />
          <Route exact path="/resoluciones-de-reformas" component={Resoluciones_Reformas} />
          <Route exact path="/seguimiento-de-reformas" component={Seguimiento} />

          <Route exact path="/documentos-preparatorios" component={Documentos_Preparatorios} />
          <Route exact path="/control-previo-compras" component={Control_Previo_Compras} />
          <Route exact path="/revision-juridico" component={Revision_Juridico} />
          <Route exact path="/informe-de-pertinencia" component={Informe_De_Pertinencia} />
          <Route exact path="/expediente-preparatorio" component={Expediente_Preparatorio} />
          <Route exact path="/elaboracion-de-pliegos" component={Elaboracion_De_Pliegos} />
          <Route exact path="/solicitud-de-inicio" component={Solicitud_De_Inicio} />
          <Route exact path="/resolucion-de-inicio" component={Resolucion_De_Inicio} />
          <Route exact path="/historial-comentarios" component={Historial_Comentarios} />
          <Route exact path="/revisar-bitacora-infima" component={Bitacora_Infima} />
          <Route exact path="/documentos-preparatorios-cat" component={Documentos_Preparatorios_Cat} />
          <Route exact path="/control-previo-compras-cat" component={Control_Previo_Compras_Cat} />
          <Route exact path="/solicitud-de-inicio-cat" component={Solicitud_De_Inicio_Cat} />
          <Route exact path="/resolucion-de-inicio-cat" component={Resolucion_De_Inicio_Cat} />
          <Route exact path="/liquidar-cat" component={Liquidar_Catalogo_Electronico} />

          <Route exact path="/documentos-preparatorios-inf" component={Documentos_Preparatorios_Inf} />
          <Route exact path="/control-previo-compras-inf" component={Control_Previo_Compras_Inf} />
          <Route exact path="/solicitud-de-publicacion" component={Solicitud_De_Publicacion} />
          <Route exact path="/publicacion-de-necesidad" component={Publicacion_De_Necesidad} />
          <Route exact path="/cuadro-comparativo" component={Cuadro_Comparativo} />
          <Route exact path="/elaboracion-de-orden" component={Elaboracion_De_Orden} />
          <Route exact path="/finalizar-infima-cuantia" component={Finalizar_Infima} />

          <Route exact path="/reasignar-responsables" component={Reasignar_Responsable} />
          <Route exact path="/subir-documentos-SOCE" component={Subir_SOCE} />
          <Route exact path="/subir-documentos-CAT" component={Subir_CAT} />
          <Route exact path="/subir-documentos-infima" component={Subir_Infima_Cuantia} />
          <Route exact path="/replanificar-proceso" component={Replanificar_Procesos} />
          <Route exact path="/reporte-replanificacion-procesos" component={Reporte_Replanificacion_Procesos} />
          <Route exact path="/formulario-replanificacion-proceso" component={Formulario_Replanificacion_Proceso} />
        </Main>
      </Switch>
    </div>
  );
}
//RUTAS FVSAFGS
export default App;
