import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { obtenerGeneros } from "../../services/generoServices";
import { obtenerTipos } from "../../services/tipoServices";
import { obtenerProductoras } from "../../services/productoraServices";
import { obtenerDirectores } from "../../services/directorServices";

export default function Home() {
  const [stats, setStats] = useState({
    media: 0,
    directores: 0,
    series: 0,
    generos: 0,
    tipos: 0,
    productoras: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar datos en paralelo
      const [generosData, tiposData, productorasData, directoresData] =
        await Promise.all([
          obtenerGeneros().catch(() => []),
          obtenerTipos().catch(() => []),
          obtenerProductoras().catch(() => []),
          obtenerDirectores().catch(() => []),
        ]);

      // Filtrar solo activos
      const generosActivos = generosData.filter((g) => g.estado !== "Inactivo");
      const tiposActivos = tiposData.filter((t) => t.estado !== "Inactivo");
      const productorasActivas = productorasData.filter(
        (p) => p.estado !== "Inactivo"
      );
      const directoresActivos = directoresData.filter(
        (d) => d.estado !== "Inactivo"
      );
      // Contar tipos específicos
      const media = tiposActivos.filter(
        (t) =>
          t.nombre.toLowerCase().includes("película") ||
          t.nombre.toLowerCase().includes("pelicula")
      ).length;

      const series = tiposActivos.filter((t) =>
        t.nombre.toLowerCase().includes("serie")
      ).length;

      setStats({
        media: media > 0 ? media : tiposActivos.length, // Fallback al total si no hay tipos específicos
        series: series,
        directores: directoresActivos.length,
        generos: generosActivos.length,
        tipos: tiposActivos.length,
        productoras: productorasActivas.length,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Medias",
      count: loading ? "..." : stats.media.toString(),
      colorClass: "media-color",
      borderClass: "border-media",
    },
    {
      title: "Directores",
      count: loading ? "..." : stats.directores.toString(),
      colorClass: "directores-color",
      borderClass: "border-directores",
    },
    {
      title: "Tipos",
      count: loading ? "..." : stats.tipos.toString(),
      colorClass: "tipos-color",
      borderClass: "border-tipos",
    },
    {
      title: "Géneros",
      count: loading ? "..." : stats.generos.toString(),
      colorClass: "generos-color",
      borderClass: "border-generos",
    },
    {
      title: "Productoras",
      count: loading ? "..." : stats.productoras.toString(),
      colorClass: "productoras-color",
      borderClass: "border-productoras",
    },
    {
      title: "Total Activos",
      count: loading
        ? "..."
        : (
            stats.tipos +
            stats.generos +
            stats.productoras +
            stats.directores
          ).toString(),
      colorClass: "total-color",
      borderClass: "border-total",
    },
  ];

  const quickAccessItems = [
    {
      title: "Gestionar Tipos",
      description: "Añadir, editar o eliminar tipos de contenido audiovisual.",
      link: "/tipos",
      category: "TIPOS",
      colorClass: "tipos-bg",
      categoryColorClass: "tipos-color",
      icon: "📺",
    },
    {
      title: "Gestionar Géneros",
      description: "Añadir, editar o eliminar géneros de la base de datos.",
      link: "/generos",
      category: "GÉNEROS",
      colorClass: "generos-bg",
      categoryColorClass: "generos-color",
      icon: "🎭",
    },
    {
      title: "Gestionar Productoras",
      description: "Añadir, editar o eliminar productoras de la base de datos.",
      link: "/productoras",
      category: "PRODUCTORAS",
      colorClass: "productoras-bg",
      categoryColorClass: "productoras-color",
      icon: "🏢",
    },
    {
      title: "Gestionar Directores",
      description: "Añadir, editar o eliminar directores de la base de datos.",
      link: "/directores",
      category: "DIRECTORES",
      colorClass: "directores-bg",
      categoryColorClass: "directores-color",
      icon: "🎥",
    },
    {
      title: "Gestionar Medios",
      description:
        "Administrar películas, series y demás contenido audiovisual.",
      link: "/media",
      category: "MEDIOS",
      colorClass: "total-bg",
      categoryColorClass: "total-color",
      icon: "🎬",
    },
  ];

  return (
    <div className="container-fluid">
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="display-4 fw-bold text-dark mb-2">Stream Legal</h1>
          <p className="text-muted mb-0 fs-6">
            {loading
              ? "Cargando estadísticas..."
              : "Estadísticas actualizadas en tiempo real"}
          </p>
        </div>
        <button
          onClick={cargarDatos}
          className={`btn btn-secondary d-flex align-items-center gap-2 ${
            loading ? "disabled" : ""
          }`}
          disabled={loading}
        >
          🔄 {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </header>

      {/* Stats Cards */}
      <section className="mb-5">
        <div className="row g-3">
          {statsCards.map((stat, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-3">
              <div
                className={`card h-100 text-center stat-card ${
                  stat.borderClass
                } ${loading ? "loading" : ""}`}
              >
                <div className="card-body">
                  <h3 className="card-subtitle mb-3 text-muted text-uppercase fw-medium small">
                    {stat.title}
                  </h3>
                  <p
                    className={`card-text display-4 fw-bold mb-0 ${stat.colorClass} d-flex align-items-center justify-content-center`}
                    style={{ minHeight: "3rem" }}
                  >
                    {loading ? (
                      <span className="loading-dots">•••</span>
                    ) : (
                      stat.count
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <h2 className="h2 fw-bold text-dark mb-4">Accesos Rápidos</h2>

        <div className="row g-4">
          {quickAccessItems.map((item, index) => (
            <div key={index} className="col-12 col-lg-6">
              <Link
                to={item.link}
                className="card text-decoration-none h-100 quick-access-card"
              >
                <div className="card-body">
                  <div className="d-flex align-items-start">
                    <div
                      className={`rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 me-3 ${item.colorClass}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        fontSize: "1.5rem",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-grow-1">
                      <div
                        className={`small fw-bold text-uppercase mb-2 ${item.categoryColorClass}`}
                      >
                        {item.category}
                      </div>
                      <h3 className="h5 fw-bold text-dark mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted mb-0 small lh-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
