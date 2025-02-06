import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import CalendarComponent from "../components/calendar/Calendar";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} /> {/* Ruta de inicio */}
    <Route path="/auth" element={<Auth />} /> {/* Ruta de login y registro */}
    <Route path="/calendar" element={<CalendarComponent />} />{" "}
    {/* Ruta de inicio */}
  </Routes>
);

export default AppRoutes;
