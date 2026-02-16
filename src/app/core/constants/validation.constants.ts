export const VALIDATION_RULES = {
  ID: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 10,
    REQUIRED: true
  },
  NAME: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
    REQUIRED: true
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 200,
    REQUIRED: true
  },
  LOGO: {
    REQUIRED: true
  },
  DATE_RELEASE: {
    REQUIRED: true
  },
  DATE_REVISION: {
    REQUIRED: true
  }
};

export const VALIDATION_MESSAGES = {
  ID: {
    REQUIRED: 'ID es requerido!',
    MIN_LENGTH: 'ID debe tener mínimo 3 caracteres!',
    MAX_LENGTH: 'ID debe tener máximo 10 caracteres!',
    ALREADY_EXISTS: 'Este ID ya existe!'
  },
  NAME: {
    REQUIRED: 'Nombre es requerido!',
    MIN_LENGTH: 'Nombre debe tener mínimo 5 caracteres!',
    MAX_LENGTH: 'Nombre debe tener máximo 100 caracteres!'
  },
  DESCRIPTION: {
    REQUIRED: 'Descripción es requerida!',
    MIN_LENGTH: 'Descripción debe tener mínimo 10 caracteres!',
    MAX_LENGTH: 'Descripción debe tener máximo 200 caracteres!'
  },
  LOGO: {
    REQUIRED: 'Logo es requerido!'
  },
  DATE_RELEASE: {
    REQUIRED: 'Fecha de liberación es requerida!',
    INVALID_DATE: 'Fecha de liberación debe ser igual o mayor a la fecha actual!'
  },
  DATE_REVISION: {
    REQUIRED: 'Fecha de revisión es requerida!',
    INVALID_DATE: 'Fecha de revisión debe ser exactamente un año posterior a la fecha de liberación!'
  }
};