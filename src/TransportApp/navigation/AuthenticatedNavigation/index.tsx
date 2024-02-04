/* eslint-disable react-hooks/exhaustive-deps */
import { Routes, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { Layout } from "antd";

import { SideBar } from "../../components/Sidebar";
import MovilizationOrderPage from "../../pages/Admin/MotilizationOrder";
import SolicitudTransportPage from "../../pages/Admin/SolicitudTransport";
import AbastecimientoCombustiblePage from "../../pages/Admin/AbastecimientoCombustible";
import SolicitudMantenimientoPage from "../../pages/Admin/SolicitudMantenimiento";
import RegistroSalidaMecanicaPage from "../../pages/Admin/RegistroSalidaMecanica";
import { AuthContext } from "../../../context/AuthContext";
import VehiclesPage from "../../pages/Management/Vehicles";
import CitiesPage from "../../pages/Management/Cities";
import StationsPage from "../../pages/Management/Stations";
import MovilizationTypesPage from "../../pages/Management/MovilizationTypes";
import MovilizationTosPage from "../../pages/Management/MovilizationTos";
import MovilizationValiditiesPage from "../../pages/Management/MovilizationValidities";
import RegisterNoticiasPage from "../../pages/RegisterNoticiasPage";
import Dashboard from "../../pages/Dashboard";
import DriversPage from "../../pages/Management/Drivers";
import ActivitiesPage from "../../pages/Management/Activities";

function WelcomePage() {
  return (
    <h3>Bienvenido!</h3>
  )
}

const AuthenticatedNavigation = () => {
  const { user }: any = useContext(AuthContext)
  console.log('USER', user)
  // const isSuperAdmin = user.roles.filter((role: any) => role.id === 1)

  const isSuperAdmin = false
  const admin = true
  const cliente = false


  return (
    <>
      <Layout>
        <SideBar>
          <Routes>
            <Route path="solicitudMantenimiento" element={<SolicitudMantenimientoPage />} />
            <Route path="movilizationOrders" element={<MovilizationOrderPage />} />
            <Route path="" element={<Dashboard />} />
            <Route path="movilizationOrders" element={<MovilizationOrderPage />} />
            <Route path="solicitudTransport" element={<SolicitudTransportPage />} />
            <Route path="abastecimientoCombustible" element={<AbastecimientoCombustiblePage />} />
            <Route path="solicitudMantenimiento" element={<SolicitudMantenimientoPage />} />
            <Route path="registroSalidaMecanica" element={<RegistroSalidaMecanicaPage />} />
            <Route path="registerNoticias" element={<RegisterNoticiasPage />} />


            <Route path="conductores" element={<DriversPage />} />
            <Route path="vehiculos"  element={<VehiclesPage />} />
            <Route path="ciudades" element={<CitiesPage />} />
            <Route path="estaciones" element={<StationsPage />} />
            <Route path="tiposMovilizacion" element={<MovilizationTypesPage />} />
            <Route path="parasMovilizacion" element={<MovilizationTosPage />} />
            <Route path="vigenciasMovilizacion" element={<MovilizationValiditiesPage />} />
            <Route path="actividades" element={<ActivitiesPage />} />

          </Routes>
        </SideBar>
      </Layout>

    </>
  );
};

export default AuthenticatedNavigation;