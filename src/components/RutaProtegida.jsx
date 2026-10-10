import { Navigate } from "react-router-dom";

function RutaProtegida({ children }) {
  const sesion = localStorage.getItem("sigoUsuario");

  if (!sesion) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;