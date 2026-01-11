# ConnectU

## 📋 Descripción

ConnectU es una red social moderna y completa donde los usuarios pueden conectarse, compartir contenido y mantenerse al día con las publicaciones de las personas que siguen. La plataforma permite crear posts con texto e imágenes, gestionar tu perfil personalizado y construir una red de seguidores.

## 🚀 Características

- 👤 **Gestión de usuarios**: Registro, inicio de sesión y edición de perfiles
- 📝 **Publicaciones**: Crea posts con texto e imágenes
- 🖼️ **Soporte multimedia**: Sube y comparte imágenes en tus posts (1mb máximo)
- 👥 **Sistema de seguimiento**: Sigue a otros usuarios y construye tu red
- 📰 **Feed personalizado**: Visualiza las publicaciones de usuarios que sigues
- 🔍 **Exploración**: Descubre contenido de otros usuarios
- ✏️ **Edición de perfil**: Personaliza tu información y foto de perfil
- 📱 **Diseño responsivo**: Interfaz adaptable a todos los dispositivos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **JavaScript** - Lógica de aplicación
- **CSS/SCSS/Less** - Estilos y diseño
- **React** - Librería de UI (si aplica)
- **Axios** - Cliente HTTP para consumir la API

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Multer** - Gestión de carga de imágenes
- **JWT** - Autenticación y autorización

## 📁 Estructura del Proyecto

```
connectu/
├── frontend/              # Aplicación cliente
│   ├── src/              # Código fuente del frontend
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── services/     # Servicios y llamadas a API
│   │   └── styles/       # Estilos globales
│   ├── public/           # Archivos estáticos
│   └── ...
├── backend/              # Servidor y API
│   ├── models/          # Modelos de datos (User, Post, etc.)
│   ├── routes/          # Rutas de la API
│   ├── controllers/     # Controladores de lógica de negocio
│   ├── middleware/      # Middlewares (auth, upload, etc.)
│   ├── config/          # Configuración de DB
│   └── ...
└── .gitignore
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn
- MongoDB instalado y configurado

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Joaaan09/connectu.git
cd connectu
```

2. **Instalar dependencias del Backend**
```bash
cd backend
npm install
```

3. **Instalar dependencias del Frontend**
```bash
cd ../frontend
npm install
```

4. **Configurar MongoDB**

Asegúrate de tener MongoDB instalado y ejecutándose en tu sistema:

```bash
# En Windows (si usas MongoDB Community Edition)
mongod

# En macOS/Linux
sudo systemctl start mongod
# o
brew services start mongodb-community
```

MongoDB debe estar corriendo en `mongodb://localhost:27017` (puerto por defecto)

## 🚀 Ejecución

### Prerrequisitos para ejecutar
Antes de iniciar la aplicación, asegúrate de que **MongoDB esté corriendo** en tu sistema.

### Modo Desarrollo

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en:
- Frontend: `http://localhost:3000` (o el puerto configurado)
- Backend: `http://localhost:5000` (o el puerto configurado)
- MongoDB: `mongodb://localhost:27017`

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener perfil de usuario por ID
- `PUT /api/users/:id` - Actualizar perfil de usuario
- `DELETE /api/users/:id` - Eliminar cuenta de usuario

### Seguimiento
- `POST /api/users/:id/follow` - Seguir a un usuario
- `DELETE /api/users/:id/unfollow` - Dejar de seguir a un usuario
- `GET /api/users/:id/followers` - Obtener seguidores de un usuario
- `GET /api/users/:id/following` - Obtener usuarios que sigue

### Posts
- `GET /api/posts` - Obtener todos los posts (feed general)
- `GET /api/posts/feed` - Obtener posts de usuarios seguidos
- `GET /api/posts/:id` - Obtener post por ID
- `GET /api/posts/user/:userId` - Obtener posts de un usuario específico
- `POST /api/posts` - Crear nuevo post (con o sin imagen)
- `PUT /api/posts/:id` - Editar post
- `DELETE /api/posts/:id` - Eliminar post

### Imágenes
- `POST /api/upload` - Subir imagen para post o perfil

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Añade nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 👥 Autores

- **Joan** - [Joaaan09](https://github.com/Joaaan09)
