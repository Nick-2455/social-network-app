# **Plan de Trabajo – Social Network App (React Native)**

**Equipo:**  
- **Nick** (PM / Integrador)  
- **Felipe** (Auth + CRUD)  
- **Uziel** (UI + Perfil)  
- **Jorge** (Social + QA)

**Entrega oficial:** 30 de noviembre  
**Meta interna:** 24 de noviembre  

---
<img width="767" height="672" alt="Captura de pantalla 2025-11-05 a la(s) 9 56 31 p m" src="https://github.com/user-attachments/assets/667cbf22-1a5d-4c6b-9ae1-9f1cc907974c" />


##  Arquitectura del Proyecto

Este proyecto sigue una **arquitectura monolítica modular (MVC)**, ideal para equipos pequeños y desarrollo ágil.  
Todo el backend se maneja dentro de una sola aplicación estructurada por módulos (Auth, Usuarios, Posts, etc.), conectada a una base de datos común.

---

###  Estructura general

```
red-social/
│
├── frontend/                 # Interfaz del usuario (React / React Native / Flutter)
│
├── backend/
│   ├── src/
│   │   ├── app.js            # Configuración principal (Express)
│   │   ├── routes/           # Definición de rutas y endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── post.routes.js
│   │   │   └── comment.routes.js
│   │   ├── controllers/      # Lógica de cada endpoint
│   │   ├── models/           # Modelos (ORM / esquema de DB)
│   │   ├── services/         # Reglas de negocio y funciones auxiliares
│   │   ├── middlewares/      # Autenticación, validaciones, permisos
│   │   └── config/           # Configuración de base de datos y variables de entorno
│   │
│   ├── package.json
│   └── ...
│
└── database/
└── red_social.sql (o scripts de migración)
```

---

### Buenas prácticas

- Uso de variables de entorno (`.env`) para credenciales y claves.
- Endpoints documentados con Swagger o Postman.
- Ramas por funcionalidad en Git (ej. `feature/auth`, `feature/posts`).
- Archivo `README.md` con instrucciones de instalación y ejecución.
- Código limpio y organizado por capas (MVC).


---

¿Quieres que te agregue al bloque también una **sección de instalación y ejecución** (comandos para levantar el backend y frontend)?
Así lo puedes pegar al final del README y quedaría completo.


## **📅 Cronograma General**

| Semana | Objetivo general | Enfoque de cada integrante |
|:--|:--|:--|
| **5–9 nov** | Setup, arquitectura y pruebas base | Nick y Uziel → estructura del proyecto + UI inicial. <br>Felipe → endpoints de auth (signup/login). <br>Jorge → pruebas con API (likes/follows dummy) y testing de requests. |
| **10–14 nov** | Feed y CRUD de posts | Nick → Feed general y componente PostCard. <br>Felipe → CRUD (create/update/delete). <br>Uziel → navegación y diseño de pantallas (Feed + PostEditor). <br>Jorge → testing de likes reales con posts creados. |
| **15–19 nov** | Perfil, follows y feed de usuarios seguidos | Uziel → Perfil de usuario + posts por usuario. <br>Jorge → Follow/Unfollow funcional. <br>Nick → Feed personalizado (`/api/feed`). <br>Felipe → soporte de endpoints y corrección de auth. |
| **20–24 nov** | Integración final y pruebas cruzadas | Todos prueban módulos ajenos, corrigen errores y documentan. <br>Nick → documentación y demo final. |
| **25–30 nov** | Colchón y entrega final | QA, revisión visual, pulido y entrega en Canvas. |

---

## **👥 Roles y Responsabilidades**

| Integrante | Rol | Responsabilidades | Entregables |
|:--|:--|:--|:--|
| **Nick** | PM / Integrador | • Coordinar versiones, revisiones y merges.<br>• Implementar feed global y personalizado.<br>• Crear componentes comunes (PostCard, headers).<br>• Consolidar documentación. | - `/api/posts` y `/api/feed` funcionales.<br>- Componente PostCard.js.<br>- README técnico y plan de entrega. |
| **Felipe** | Auth + CRUD | • Desarrollar Login y Signup (tokens JWT).<br>• CRUD completo de posts.<br>• Validar endpoints y flujos de autenticación. | - Pantallas Login/Signup funcionales.<br>- Crear/Editar/Borrar posts.<br>- Auth integrado globalmente. |
| **Uziel** | UI + Perfil | • Definir navegación general (stack, tabs).<br>• Desarrollar pantalla de perfil.<br>• Integrar `/api/users/:id` y `/api/users/:id/posts`. | - Perfil funcional con sus posts.<br>- AppNavigator.js operativo.<br>- Diseño uniforme entre pantallas. |
| **Jorge** | Social + QA | • Implementar likes y follows/unfollows.<br>• Testing general de endpoints y bugs.<br>• Crear botones dinámicos (estado visual de like/follow). | - Like/Unlike y Follow/Unfollow.<br>- Reporte de pruebas.<br>- Ajustes de validación de API. |

---

## **🧩 División de Servicios y Deadlines**

| Servicio | Endpoint | Responsable | Fecha límite |
|:--|:--|:--|:--|
| Signup | `/api/auth/signup` | Felipe | **8 nov** |
| Login | `/api/auth/login` | Felipe | **8 nov** |
| Feed general | `/api/posts?page=1&limit=10` | Nick | **11 nov** |
| Feed de seguidos | `/api/feed` | Nick | **17 nov** |
| Crear post | `POST /api/posts` | Felipe | **12 nov** |
| Editar/Borrar post | `PATCH/DELETE /api/posts/:id` | Felipe | **14 nov** |
| Likes | `PUT/DELETE /api/posts/:id/like` | Jorge | **13 nov** |
| Follow/Unfollow | `PUT/DELETE /api/users/:id/follow` | Jorge | **18 nov** |
| Perfil usuario | `GET /api/users/:id` | Uziel | **15 nov** |
| Posts de usuario | `GET /api/users/:id/posts` | Uziel | **15 nov** |

---

## **🔗 Dependencias Técnicas**

| Módulo | Depende de | Responsable previo |
|:--|:--|:--|
| Feed general (`/api/posts`) | API activa + Auth funcional | Felipe |
| Feed personalizado (`/api/feed`) | Follow funcional | Jorge |
| Perfil de usuario | Auth activo | Felipe |
| Likes / Follows | CRUD de posts funcional | Felipe |
| Testing final | Todos los módulos integrados | Equipo completo |

---

## **🗂️ Estructura del Proyecto (Asignada)**

```

/social-network-app
├── /src
│   ├── /screens
│   │   ├── LoginScreen.js          ← Felipe
│   │   ├── SignupScreen.js         ← Felipe
│   │   ├── FeedScreen.js           ← Nick
│   │   ├── ProfileScreen.js        ← Uziel
│   │   └── PostEditorScreen.js     ← Felipe
│   ├── /components
│   │   ├── PostCard.js             ← Nick
│   │   ├── LikeButton.js           ← Jorge
│   │   ├── FollowButton.js         ← Jorge
│   │   └── Header.js               ← Nick
│   ├── /api
│   │   ├── auth.js                 ← Felipe
│   │   ├── posts.js                ← Nick
│   │   └── users.js                ← Uziel
│   └── AppNavigator.js             ← Uziel
├── package.json
├── README.md
└── .env

```

---

## **✅ Checkpoints de Avance**

| Fecha | Revisión | Objetivo |
|:--|:--|:--|
| **8 nov** | Checkpoint 1 | Login y Signup operativos con token. |
| **13 nov** | Checkpoint 2 | CRUD de posts y likes integrados. |
| **17 nov** | Checkpoint 3 | Feed personalizado y perfil funcional. |
| **22 nov** | Checkpoint 4 | Testing, fixes y documentación. |
| **24 nov** | Versión final interna | Demo funcional lista. |

---

## **🧭 Criterios de Éxito**

- Todas las rutas del API responden correctamente desde la app.  
- Navegación fluida entre pantallas.  
- Acciones protegidas con token JWT.  
- Interfaz coherente (mismo diseño y estilo).  
- Sin errores críticos ni crashes durante el demo.

---

**Última actualización:** 5 de noviembre de 2025  
```

---

¿Quieres que te lo prepare también en una **versión visual Gantt (barra de tiempos con dependencias)** en Markdown o prefieres que te genere un **.png tipo diagrama** para añadir al repo (en `/docs/`)?
