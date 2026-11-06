import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("sigoUsuario"));

  const cerrarSesion = () => {
    localStorage.removeItem("sigoUsuario");
    navigate("/");
  };

  return (
    <div className="tarjeta">
      <h2>Bienvenido, {usuario?.nombre}</h2>
      <p>Rol: {usuario?.rol}</p>
      <p>
        <Link to="/expedientes">Ir al módulo de Expedientes →</Link>
      </p>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}

export default Dashboard;