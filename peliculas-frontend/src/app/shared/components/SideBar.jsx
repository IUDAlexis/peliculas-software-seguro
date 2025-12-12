import { Link, useLocation } from "react-router-dom";
import "./SideBar.css";

export default function SideBar({ isOffcanvas = false }) {
  const location = useLocation();
  
  const menuItems = [
    { path: "/", label: "Inicio", icon: "🏠" },
    { path: "/media", label: "Películas", icon: "🎬" },
    { path: "/generos", label: "Géneros", icon: "🎭" },
    { path: "/productoras", label: "Productoras", icon: "🏢" },
    { path: "/directores", label: "Directores", icon: "🎥" },
    { path: "/tipos", label: "Tipos", icon: "📺" }
  ];

  const SidebarContent = () => (
    <div className="d-flex flex-column h-100">
      {/* Header */}
      <div className="border-bottom p-3 mb-3">
        <h2 className="h4 fw-semibold text-dark mb-0">Stream Legal</h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-grow-1 px-3">
        <ul className="nav nav-pills flex-column">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className="nav-item mb-1">
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center py-2 px-3 rounded-2 sidebar-nav-link ${
                    isActive ? 'active' : ''
                  }`}
                  {...(isOffcanvas && { 'data-bs-dismiss': 'offcanvas' })}
                >
                  <span className="me-3" style={{ fontSize: '1.1rem', width: '20px', textAlign: 'center' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  // Versión Offcanvas para móviles
  if (isOffcanvas) {
    return (
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-semibold" id="sidebarOffcanvasLabel">
            Panel de Control
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          <SidebarContent />
        </div>
      </div>
    );
  }

  // Versión estática para desktop
  return (
    <div className="bg-white border-end shadow-sm sidebar-desktop">
      <SidebarContent />
    </div>
  );
}
