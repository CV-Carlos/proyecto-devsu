export const API_CONFIG = {
  BASE_URL: 'http://localhost:3002',
  ENDPOINTS: {
    PRODUCTS: '/bp/products',
    VERIFICATION: '/bp/products/verification'
  }
};

export const API_MESSAGES = {
  PRODUCT_CREATED: 'Producto creado exitosamente',
  PRODUCT_UPDATED: 'Producto actualizado exitosamente',
  PRODUCT_DELETED: 'Producto eliminado exitosamente',
  ERROR_GENERIC: 'Ha ocurrido un error. Por favor intente nuevamente.',
  ERROR_NETWORK: 'Error de conexión. Verifique su conexión a internet.',
  ERROR_ID_EXISTS: 'El ID del producto ya existe',
  ERROR_NOT_FOUND: 'Producto no encontrado'
};