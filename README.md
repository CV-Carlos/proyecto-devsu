# Sistema de Gestión de Productos Financieros

## 📋 Requisitos previos

- Node.js v24.13.1 o superior
- npm v10.9.2 o superior

## 🔧 Instalación y ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor de desarrollo
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### 3. Iniciar el backend (en otra terminal)

El backend debe estar corriendo en `http://localhost:3002`
```bash
cd backend
npm install
npm run start:dev
```

## 🧪 Ejecutar tests

### Tests unitarios
```bash
npm test
```

### Coverage
```bash
npm run test:coverage
```

**Coverage actual:** 84.24% (objetivo: 70%)

## 🏗️ Estructura del proyecto
```
src/
├── app/
│   ├── core/              # Servicios, modelos, constantes
│   ├── features/          # Funcionalidades por módulo
│   └── shared/            # Componentes y utilidades compartidas
```

## 🛠️ Scripts disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm test` - Ejecuta los tests
- `npm run test:coverage` - Genera reporte de cobertura
- `npm run build` - Compila la aplicación para producción

## 📝 Notas

- La aplicación usa un proxy configurado para el backend (`/bp` → `http://localhost:3002`)
- Las fechas se muestran en formato dd/MM/yyyy
- El sistema valida que el ID del producto sea único consultando el backend
