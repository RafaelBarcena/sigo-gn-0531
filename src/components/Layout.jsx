import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>SIGO-GN · Unidad 31</h1>
        <nav className="layout-nav">
          <Link to="/">Inicio</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main className="layout-contenido">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;