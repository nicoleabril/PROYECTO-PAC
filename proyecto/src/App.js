import './App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import React from 'react';
import Login from './auth/Login';
import Inicio from './pages/Inicio';
import Mis_reformas from './pages/Mis_Reformas';
import Revision_reformas from './pages/Revision_Reformas';
import Aprobacion_reformas from './pages/Aprobacion_Reformas';
import Consolidacion_reformas from './pages/Consolidacion_Reformas';
import Autorizacion_reformas from './pages/Autorizacion_Reformas';
import Detalle_reforma from './pages/Pantalla_Detalle_Reforma';
import Editar_Reforma from './pages/Edicion_Reformas';
import Inclusion_Reforma from './pages/Inclusion_Reformas';
import Eliminar_Reforma from './pages/Eliminar_Reformas';
import PAC from './pages/PAC';
import CPC from './pages/CPC';
import 'font-awesome/css/font-awesome.min.css';

function App() {

      


  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/inicio' element={<Inicio />} />
          <Route path='/mis_reformas' element={<Mis_reformas />} />
          <Route path='/revision_reformas' element={<Revision_reformas />} />
          <Route path='/aprobacion_reformas' element={<Aprobacion_reformas />} />
          <Route path='/consolidacion_reformas' element={<Consolidacion_reformas />} />
          <Route path='/autorizacion_reformas' element={<Autorizacion_reformas />} />
          <Route path='/detalle_reforma/:id' element={<Detalle_reforma />} />
          <Route path='/editar_reforma/:id' element={<Editar_Reforma />} />
          <Route path='/eliminar_reforma/:id' element={<Eliminar_Reforma />} />
          <Route path='/incluir_reforma/:id' element={<Inclusion_Reforma />} />
          <Route path='/pac' element={<PAC />} />
          <Route path='/cpc' element={<CPC />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
