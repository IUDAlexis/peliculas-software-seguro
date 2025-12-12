import { useState, useEffect } from "react";
import {
  obtenerGeneros,
  eliminarGenero,
} from "../../../services/generoServices";
import GeneroForm from "./GeneroForm";
import "./Genero.css";

export default function GeneroList() {
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [generoSeleccionado, setGeneroSeleccionado] = useState(null);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  useEffect(() => {
    cargarGeneros();
  }, []);

  const cargarGeneros = async () => {
    try {
      setLoading(true);
      const data = await obtenerGeneros();
      setGeneros(data);
    } catch (err) {
      setError("Error al cargar los géneros");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este género?")) {
      try {
        await eliminarGenero(id);
        await cargarGeneros(); // Recargar la lista
      } catch (err) {
        setError("Error al eliminar el género");
        console.error("Error:", err);
      }
    }
  };

  const handleEditar = (genero) => {
    setGeneroSeleccionado(genero);
    setShowModal(true);
  };

  const handleNuevo = () => {
    setGeneroSeleccionado(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setGeneroSeleccionado(null);
    cargarGeneros(); // Recargar la lista cuando se cierre el modal
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  const generosFiltrados = mostrarInactivos
    ? generos
    : generos.filter((genero) => genero.estado !== "Inactivo");

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="text-center">
          <div className="spinner-border text-secondary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="fs-5 text-muted">Cargando géneros...</div>
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
            <h1 className="h2 fw-bold text-dark mb-2">Géneros</h1>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <button
                onClick={() => setMostrarInactivos(!mostrarInactivos)}
                className="btn btn-outline-secondary btn-sm"
              >
                <span className="d-none d-sm-inline">
                  {mostrarInactivos ? "Ocultar inactivos" : "Mostrar inactivos"}
                </span>
                <span className="d-sm-none">
                  {mostrarInactivos ? "Ocultar" : "Mostrar"} inactivos
                </span>
              </button>
              <span className="text-muted small">
                <span className="d-none d-sm-inline">Total: </span>
                {generosFiltrados.length} género
                {generosFiltrados.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-md-end">
            <button
              onClick={handleNuevo}
              className="btn generos-btn d-flex align-items-center gap-2 w-100 w-md-auto"
            >
              <button className="btn btn-primary d-none d-sm-inline">
                <span>➕</span>Crear género
              </button>
              <button className="btn btn-primary d-sm-none">Nuevo</button>
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="d-none d-lg-block">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="fw-semibold text-uppercase small">
                    Nombre
                  </th>
                  <th scope="col" className="fw-semibold text-uppercase small">
                    Estado
                  </th>
                  <th scope="col" className="fw-semibold text-uppercase small">
                    Fecha de creación
                  </th>
                  <th scope="col" className="fw-semibold text-uppercase small">
                    Fecha de actualización
                  </th>
                  <th scope="col" className="fw-semibold text-uppercase small">
                    Descripción
                  </th>
                  <th scope="col" className="fw-semibold text-uppercase small">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {generosFiltrados.map((genero) => (
                  <tr key={genero._id}>
                    <td className="fw-medium text-dark">{genero.nombre}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          genero.estado === "Activo"
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {genero.estado}
                      </span>
                    </td>
                    <td className="text-muted">
                      {formatearFecha(genero.fecha_creacion)}
                    </td>
                    <td className="text-muted">
                      {formatearFecha(genero.fecha_actualizacion)}
                    </td>
                    <td style={{ maxWidth: "200px" }}>
                      <span
                        className="text-muted text-truncate d-inline-block"
                        style={{ maxWidth: "180px" }}
                      >
                        {genero.descripcion}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          onClick={() => handleEditar(genero)}
                          className="btn btn-outline-primary btn-sm"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        {genero.estado === "Activo" && (
                          <button
                            onClick={() => handleEliminar(genero._id)}
                            className="btn btn-outline-danger btn-sm"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tablet Table */}
        <div className="d-none d-md-block d-lg-none">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="fw-semibold text-uppercase small">
                    Nombre
                  </th>
                  <th scope="col" className="fw-semibold text-uppercase small">
                    Estado
                  </th>
                  <th scope="col" className="fw-semibold text-uppercase small">
                    Descripción
                  </th>
                  <th scope="col" className="fw-semibold text-uppercase small">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {generosFiltrados.map((genero) => (
                  <tr key={genero._id}>
                    <td className="fw-medium text-dark">{genero.nombre}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          genero.estado === "Activo"
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {genero.estado}
                      </span>
                    </td>
                    <td style={{ maxWidth: "150px" }}>
                      <span
                        className="text-muted text-truncate d-inline-block"
                        style={{ maxWidth: "130px" }}
                      >
                        {genero.descripcion}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          onClick={() => handleEditar(genero)}
                          className="btn btn-outline-primary btn-sm"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        {genero.estado === "Activo" && (
                          <button
                            onClick={() => handleEliminar(genero._id)}
                            className="btn btn-outline-danger btn-sm"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="d-md-none">
          {generosFiltrados.map((genero) => (
            <div
              key={genero._id}
              className="card mb-3 border-start border-3"
              style={{
                borderLeftColor:
                  genero.estado === "Activo" ? "#198754" : "#dc3545",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="card-title fw-bold mb-0 text-dark">
                    {genero.nombre}
                  </h6>
                  <span
                    className={`badge rounded-pill ${
                      genero.estado === "Activo"
                        ? "text-bg-success"
                        : "text-bg-danger"
                    }`}
                  >
                    {genero.estado}
                  </span>
                </div>
                <p className="card-text text-muted small mb-2">
                  {genero.descripcion}
                </p>
                <div className="row text-muted small mb-3">
                  <div className="col-6">
                    <div>
                      <strong>Creado:</strong>
                    </div>
                    <div>{formatearFecha(genero.fecha_creacion)}</div>
                  </div>
                  <div className="col-6">
                    <div>
                      <strong>Actualizado:</strong>
                    </div>
                    <div>{formatearFecha(genero.fecha_actualizacion)}</div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleEditar(genero)}
                    className="btn btn-outline-primary btn-sm flex-grow-1"
                  >
                    ✏️ Editar
                  </button>
                  {genero.estado === "Activo" && (
                    <button
                      onClick={() => handleEliminar(genero._id)}
                      className="btn btn-outline-danger btn-sm flex-grow-1"
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {generosFiltrados.length === 0 && (
          <div className="text-center py-5">
            <div className="text-muted fs-5">
              {mostrarInactivos
                ? "No hay géneros registrados"
                : "No hay géneros activos"}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <GeneroForm genero={generoSeleccionado} onClose={handleModalClose} />
        )}
      </div>
    </div>
  );
}
