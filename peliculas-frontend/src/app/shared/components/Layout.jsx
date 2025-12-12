import SideBar from "./SideBar";

export default function Layout({ children }) {
  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar Desktop - Siempre visible en pantallas grandes */}
      <div className="d-none d-lg-block">
        <SideBar />
      </div>

      {/* Sidebar Mobile - Offcanvas Bootstrap */}
      <div className="d-lg-none">
        <SideBar isOffcanvas={true} />
      </div>

      {/* Contenido principal */}
      <main className="flex-grow-1 bg-light p-4 main-content-responsive">
        {/* Botón hamburger para móviles - Bootstrap navbar-toggler */}
        <button
          className="btn d-lg-none mb-3 navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-controls="sidebarOffcanvas"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {children}
      </main>
    </div>
  );
}
