const API_URL = `${import.meta.env.VITE_API_URL}tipos`;

// Obtener todos los tipos
export const obtenerTipos = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener tipos");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Obtener un tipo por ID
export const obtenerTipoPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener tipo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Crear un nuevo tipo
export const crearTipo = async (tipoData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tipoData),
    });
    if (!response.ok) {
      throw new Error("Error al crear tipo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Actualizar un tipo
export const actualizarTipo = async (id, tipoData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tipoData),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar tipo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Eliminar tipo (eliminación lógica)
export const eliminarTipo = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar tipo");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
