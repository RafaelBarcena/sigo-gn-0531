import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usuarios from "../data/usuarios";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const manejarEnvio = (e) => {
    e.preventDefault(); // evita que la página se recargue

    const encontrado = usuarios.find(
      (u) => u.usuario === usuario && u.contraseña === contrasena
    );

    if (!encontrado) {
      setError("Usuario o contraseña incorrectos");
      return;
    }

    // Guardar el usuario SIN la contraseña
    const { contraseña, ...usuarioSinContrasena } = encontrado;
    localStorage.setItem("sigoUsuario", JSON.stringify(usuarioSinContrasena));

    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="tarjeta">
      <h2>Iniciar sesión</h2>

      <form className="formulario" onSubmit={manejarEnvio}>
        <label>
          Usuario
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </label>

        <button type="submit">Entrar</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;