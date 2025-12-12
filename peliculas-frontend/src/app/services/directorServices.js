const API_URL = `${import.meta.env.VITE_API_URL}directores`;

// Obtener todos los directores
export const obtenerDirectores = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener directores');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Obtener un director por ID
export const obtenerDirectorPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener director');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Crear un nuevo director
export const crearDirector = async (directorData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(directorData),
    });
    if (!response.ok) {
      throw new Error('Error al crear director');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Actualizar un director
export const actualizarDirector = async (id, directorData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(directorData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar director');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Eliminar director (eliminación lógica)
export const eliminarDirector = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar director');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
