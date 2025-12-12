import { useState, useEffect } from "react";
import {
  obtenerMedias,
  eliminarMedia,
} from "../../../services/mediaServices";
import MediaForm from "./MediaForm";

export default function MediaList() {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mediaSeleccionada, setMediaSeleccionada] = useState(null);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  useEffect(() => {
    cargarMedias();
  }, []);

  const cargarMedias = async () => {
    try {
      setLoading(true);
      const data = await obtenerMedias();
      setMedias(data);
    } catch (err) {
      setError("Error al cargar las películas/medias");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta media?")) {
      try {
        await eliminarMedia(id);
        await cargarMedias();
      } catch (err) {
        setError("Error al eliminar la media");
        console.error("Error:", err);
      }
    }
  };

  const handleEditar = (media) => {
    setMediaSeleccionada(media);
    setShowModal(true);
  };

  const handleNuevo = () => {
    setMediaSeleccionada(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setMediaSeleccionada(null);
    cargarMedias();
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  const mediasFiltradas = mostrarInactivos
    ? medias
    : medias.filter((m) => m.estado !== "Inactivo");

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <div className="text-center">
          <div className="spinner-border text-secondary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="fs-5 text-muted">Cargando películas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {/* Header */}
        <div className="row g-3 align-items-center mb-4">
          <div className="col-12 col-md-8">
            <h1 className="h2 fw-bold text-dark mb-2">Películas / Medias</h1>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <button
                onClick={() => setMostrarInactivos(!mostrarInactivos)}
                className="btn btn-outline-secondary btn-sm"
              >
                {mostrarInactivos ? "Ocultar inactivos" : "Mostrar inactivos"}
              </button>
              <span className="text-muted small">
                Total: {mediasFiltradas.length}
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-start ">
            <button
              onClick={handleNuevo}
              className="btn btn-primary d-flex align-items-left gap-2  w-md-auto"
            >
              <span>➕</span>
              <span className="d-none d-sm-inline">Nueva Media</span>
              <span className="d-sm-none">Nuevo</span>
            </button>
          </div>
        </div>

        {/* Tabla Desktop */}
        <div className="d-none d-lg-block">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Título</th>
                  <th>Año</th>
                  <th>Director</th>
                  <th>Género</th>
                  <th>Productora</th>
                  <th>Tipo</th>
                  <th>Fecha creación</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mediasFiltradas.map((m) => (
                  <tr key={m._id}>
                    <td>{m.titulo}</td>
                    <td>{m.anio_estreno}</td>
                    <td>{m.director?.nombres}</td>
                    <td>{m.genero?.nombre}</td>
                    <td>{m.productora?.nombre}</td>
                    <td>{m.tipo?.nombre}</td>
                    <td>{formatearFecha(m.fecha_creacion)}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() => handleEditar(m)}
                          className="btn btn-outline-primary btn-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleEliminar(m._id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards Mobile */}
        <div className="d-lg-none">
          {mediasFiltradas.map((m) => (
            <div key={m._id} className="card mb-3 border-start border-3">
              <div className="card-body">
                <h5 className="card-title">{m.titulo}</h5>
                <p className="card-text small text-muted">{m.sinopsis}</p>
                <p>
                  🎬 <strong>Director:</strong> {m.director?.nombre} <br />
                  🎭 <strong>Género:</strong> {m.genero?.nombre} <br />
                  🏢 <strong>Productora:</strong> {m.productora?.nombre}
                </p>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleEditar(m)}
                    className="btn btn-outline-primary btn-sm flex-grow-1"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(m._id)}
                    className="btn btn-outline-danger btn-sm flex-grow-1"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty */}
        {mediasFiltradas.length === 0 && (
          <div className="text-center py-5 text-muted">
            No hay películas registradas
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <MediaForm media={mediaSeleccionada} onClose={handleModalClose} />
        )}
      </div>
    </div>
  );
}
