import { useEffect, useState } from "react";

const API = "http://localhost:4000/expedientes";
const BOLETA = "0531"; // últimos 4 dígitos de la boleta (folios EXP-0531-###)
const PATRON_FOLIO = new RegExp(`^EXP-${BOLETA}-\\d{3}$`);

const vacio = {
  folio: "",
  nombreOperativo: "",
  tipoIncidente: "",
  zona: "",
  fecha: "",
  descripcion: "",
};

// Sugiere el siguiente folio libre: EXP-0531-001, EXP-0531-002...
function siguienteFolio(expedientes) {
  const numeros = expedientes
    .map((e) => Number(String(e.folio).split("-")[2]))
    .filter((n) => Number.isFinite(n));
  const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1;
  return `EXP-${BOLETA}-${String(siguiente).padStart(3, "0")}`;
}

function Expedientes() {
  const [expedientes, setExpedientes] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");
  const [recarga, setRecarga] = useState(0);

  // GET al cargar el componente (y cada vez que cambia "recarga")
  useEffect(() => {
    let activo = true;
    fetch(API)
      .then((res) => res.json())
      .then((datos) => {
        if (!activo) return;
        setExpedientes(datos);
        setError("");
      })
      .catch(() => {
        if (activo) {
          setError(
            "No se pudo conectar con el servidor. ¿Está corriendo en el puerto 4000 (npm run dev)?"
          );
        }
      });
    return () => {
      activo = false;
    };
  }, [recarga]);

  const refrescar = () => setRecarga((n) => n + 1);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError("");

    const folio = form.folio.trim();
    if (!PATRON_FOLIO.test(folio)) {
      setError(`El folio debe tener el formato EXP-${BOLETA}-### (ej. EXP-${BOLETA}-001)`);
      return;
    }

    try {
      // Crear = POST /expedientes · Editar = PUT /expedientes/:folio
      const res = await fetch(editando ? `${API}/${folio}` : API, {
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, folio }),
      });
      if (!res.ok) {
        const datos = await res.json().catch(() => ({}));
        setError(datos.error || "No se pudo guardar el expediente");
        return;
      }
      setForm(vacio);
      setEditando(false);
      refrescar();
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  const editar = (exp) => {
    setForm({ ...vacio, ...exp });
    setEditando(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelar = () => {
    setForm(vacio);
    setEditando(false);
    setError("");
  };

  const eliminar = async (folio) => {
    if (!window.confirm(`¿Eliminar el expediente ${folio}? Se borrará el archivo del servidor.`)) {
      return;
    }
    try {
      const res = await fetch(`${API}/${folio}`, { method: "DELETE" });
      if (!res.ok) {
        const datos = await res.json().catch(() => ({}));
        setError(datos.error || "No se pudo eliminar el expediente");
        return;
      }
      if (editando && form.folio === folio) cancelar();
      refrescar();
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="tarjeta tarjeta-ancha">
      <h2>Expedientes</h2>

      <form className="formulario formulario-grid" onSubmit={guardar}>
        <h3 className="formulario-titulo">
          {editando ? `Editando ${form.folio}` : "Nuevo expediente"}
        </h3>

        <label>
          Folio
          <input
            name="folio"
            value={form.folio}
            onChange={cambiar}
            placeholder={siguienteFolio(expedientes)}
            disabled={editando}
            required
          />
        </label>
        <label>
          Nombre del operativo
          <input name="nombreOperativo" value={form.nombreOperativo} onChange={cambiar} required />
        </label>
        <label>
          Tipo de incidente
          <input name="tipoIncidente" value={form.tipoIncidente} onChange={cambiar} required />
        </label>
        <label>
          Zona
          <input name="zona" value={form.zona} onChange={cambiar} required />
        </label>
        <label>
          Fecha
          <input name="fecha" type="date" value={form.fecha} onChange={cambiar} required />
        </label>
        <label className="campo-ancho">
          Descripción
          <textarea name="descripcion" rows="3" value={form.descripcion} onChange={cambiar} />
        </label>

        <div className="formulario-botones campo-ancho">
          <button type="submit">{editando ? "Guardar cambios" : "Crear expediente"}</button>
          {editando && (
            <button type="button" className="btn-secundario" onClick={cancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Operativo</th>
              <th>Incidente</th>
              <th>Zona</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {expedientes.length === 0 && (
              <tr>
                <td colSpan="7" className="tabla-vacia">
                  No hay expedientes todavía. Crea el primero con el formulario.
                </td>
              </tr>
            )}
            {expedientes.map((exp) => (
              <tr key={exp.folio}>
                <td>{exp.folio}</td>
                <td>{exp.nombreOperativo}</td>
                <td>{exp.tipoIncidente}</td>
                <td>{exp.zona}</td>
                <td>{exp.fecha}</td>
                <td>{exp.descripcion}</td>
                <td>
                  <div className="tabla-acciones">
                    <button type="button" onClick={() => editar(exp)}>
                      Editar
                    </button>
                    <button type="button" className="btn-peligro" onClick={() => eliminar(exp.folio)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expedientes;
