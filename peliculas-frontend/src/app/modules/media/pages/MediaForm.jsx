// src/app/components/medias/MediaForm.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { crearMedia, actualizarMedia } from "../../../services/mediaServices";
import { obtenerGeneros } from "../../../services/generoServices";
import { obtenerDirectores } from "../../../services/directorServices";
import { obtenerProductoras } from "../../../services/productoraServices";
import { obtenerTipos } from "../../../services/tipoServices";

export default function MediaForm({ media, onClose }) {
  const [formData, setFormData] = useState({
    serial: "",
    titulo: "",
    sinopsis: "",
    url_pelicula: "",
    imagen_portada: "",
    anio_estreno: "",
    genero: "",
    director: "",
    productora: "",
    tipo: "",
  });

  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (media) {
      setFormData({
        serial: media.serial || "",
        titulo: media.titulo || "",
        sinopsis: media.sinopsis || "",
        url_pelicula: media.url_pelicula || "",
        imagen_portada: media.imagen_portada || "",
        anio_estreno: media.anio_estreno || "",
        genero: media.genero?._id || "",
        director: media.director?._id || "",
        productora: media.productora?._id || "",
        tipo: media.tipo?._id || "",
      });
    }
    cargarDatos();
  }, [media]);

  const cargarDatos = async () => {
    try {
      const [gen, dir, prod, tip] = await Promise.all([
        obtenerGeneros(),
        obtenerDirectores(),
        obtenerProductoras(),
        obtenerTipos(),
      ]);
      setGeneros(gen);
      // Filtrar solo directores activos
      setDirectores(dir.filter((director) => director.estado === "Activo"));
      setProductoras(prod);
      setTipos(tip);
    } catch (err) {
      console.error("Error cargando catálogos", err);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.serial.trim())
      nuevosErrores.serial = "El serial es obligatorio";
    if (!formData.titulo.trim())
      nuevosErrores.titulo = "El título es obligatorio";
    if (!formData.url_pelicula.trim())
      nuevosErrores.url_pelicula = "La URL es obligatoria";
    if (!formData.genero) nuevosErrores.genero = "Debe seleccionar un género";
    if (!formData.director)
      nuevosErrores.director = "Debe seleccionar un director";
    if (!formData.productora)
      nuevosErrores.productora = "Debe seleccionar una productora";
    if (!formData.tipo) nuevosErrores.tipo = "Debe seleccionar un tipo";

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    setError(null);

    try {
      if (media) {
        await actualizarMedia(media._id, formData);
      } else {
        await crearMedia(formData);
      }
      onClose();
    } catch (err) {
      setError(
        media ? "Error al actualizar la media" : "Error al crear la media"
      );
      console.error("Error al guardar la media", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className="modal d-block" tabIndex="-1" onClick={handleBackdropClick}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center gap-2">
              {media ? "✏️ Editar Media" : "➕ Crear Nueva Media"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="row g-3">
              {/* Serial */}
              <div className="col-md-6">
                <label className="form-label">Serial</label>
                <input
                  type="text"
                  name="serial"
                  className={`form-control ${
                    errors.serial ? "is-invalid" : ""
                  }`}
                  value={formData.serial}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.serial && (
                  <div className="invalid-feedback">{errors.serial}</div>
                )}
              </div>

              {/* Titulo */}
              <div className="col-md-6">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  name="titulo"
                  className={`form-control ${
                    errors.titulo ? "is-invalid" : ""
                  }`}
                  value={formData.titulo}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.titulo && (
                  <div className="invalid-feedback">{errors.titulo}</div>
                )}
              </div>

              {/* Sinopsis */}
              <div className="col-md-12">
                <label className="form-label">Sinopsis</label>
                <textarea
                  name="sinopsis"
                  className="form-control"
                  value={formData.sinopsis}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* URL */}
              <div className="col-md-6">
                <label className="form-label">URL Película</label>
                <input
                  type="url"
                  name="url_pelicula"
                  className={`form-control ${
                    errors.url_pelicula ? "is-invalid" : ""
                  }`}
                  value={formData.url_pelicula}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.url_pelicula && (
                  <div className="invalid-feedback">{errors.url_pelicula}</div>
                )}
              </div>

              {/* Imagen */}
              <div className="col-md-6">
                <label className="form-label">Imagen Portada (URL)</label>
                <input
                  type="text"
                  name="imagen_portada"
                  className="form-control"
                  value={formData.imagen_portada}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Año */}
              <div className="col-md-4">
                <label className="form-label">Año Estreno</label>
                <input
                  type="number"
                  name="anio_estreno"
                  className="form-control"
                  value={formData.anio_estreno}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Genero */}
              <div className="col-md-4">
                <label className="form-label">Género</label>
                <select
                  name="genero"
                  className={`form-select ${errors.genero ? "is-invalid" : ""}`}
                  value={formData.genero}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Seleccione...</option>
                  {generos.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
                {errors.genero && (
                  <div className="invalid-feedback">{errors.genero}</div>
                )}
              </div>

              {/* Director */}
              <div className="col-md-4">
                <label className="form-label">Director</label>
                <select
                  name="director"
                  className={`form-select ${
                    errors.director ? "is-invalid" : ""
                  }`}
                  value={formData.director}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Seleccione...</option>
                  {directores.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.nombres}
                    </option>
                  ))}
                </select>
                {errors.director && (
                  <div className="invalid-feedback">{errors.director}</div>
                )}
              </div>

              {/* Productora */}
              <div className="col-md-6">
                <label className="form-label">Productora</label>
                <select
                  name="productora"
                  className={`form-select ${
                    errors.productora ? "is-invalid" : ""
                  }`}
                  value={formData.productora}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Seleccione...</option>
                  {productoras.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
                {errors.productora && (
                  <div className="invalid-feedback">{errors.productora}</div>
                )}
              </div>

              {/* Tipo */}
              <div className="col-md-6">
                <label className="form-label">Tipo</label>
                <select
                  name="tipo"
                  className={`form-select ${errors.tipo ? "is-invalid" : ""}`}
                  value={formData.tipo}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Seleccione...</option>
                  {tipos.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
                {errors.tipo && (
                  <div className="invalid-feedback">{errors.tipo}</div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {media ? "Actualizando..." : "Creando..."}
                </>
              ) : media ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
