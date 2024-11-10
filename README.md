# red-social-3
Este proyecto consiste en el desarrollo de una red social simple como parte de una actividad educativa. La aplicación permite gestionar usuarios, publicaciones, comentarios y solicitudes de amistad. El sistema está desarrollado en Node.js utilizando Express para manejar el enrutamiento y gestionar las rutas HTTP, y ahora incluye una base de datos MySQL para la persistencia de datos.

## Características
- Gestión de usuarios: Registro, actualización y eliminación de perfiles de usuario.
- Gestión de publicaciones: Creación, visualización, edición y eliminación de publicaciones.
- Publicación de comentarios: Los usuarios pueden agregar comentarios en las publicaciones de otros.
- Solicitud y gestión de amistades: Envío y aceptación de solicitudes de amistad, y visualización de amigos.
- Visualización del feed: Muestra las publicaciones realizadas por los amigos del usuario.

## Tecnologías utilizadas
- Node.js
- Express.js
- MySQL
- EJS (para las vistas)
- CSS

## Instalación
- **1.** Clona el repositorio:
```
git clone https://github.com/Mendozafj/red-social-3.git
```
- **2.**  Ingresa al directorio del proyecto:
```
cd red-social-2
```
- **3.**  Instala las dependencias:
```
npm install
```

## Uso
- **1.** Ejecuta la aplicación: 
```
npm start
```
- **2.**  El servidor estará escuchando en el puerto `3000`:
```
http://localhost:3000/
```
- **3.**  Utiliza las rutas y métodos HTTP definidos en el servidor para interactuar con la Red Social, además puedes utilizar las vistas del sistema para una mejor experiencia.
