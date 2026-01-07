# CourseHub Landing Page - Guía Visual y Estructura

## 📍 Estructura del Sistema Completo

```
Landing Page (/)
├── Navbar
│   ├── Logo + Brand
│   ├── Navigation Links
│   └── Auth Buttons
│
├── Hero Section
│   ├── Headline Principal
│   ├── Subtitle
│   ├── CTA Buttons
│   ├── Statistics
│   └── Animated Card
│
├── Features (6 Cards)
│   ├── Crear Cursos
│   ├── Gestionar Contenido
│   ├── Colaboración
│   ├── Copiar y Mejorar
│   ├── Calificaciones
│   └── Comunidad
│
├── How It Works (3 Steps)
│   ├── Crear tu Curso
│   ├── Organiza en Módulos
│   └── Publica Contenido
│
├── Workflow Section
│   ├── Bifurca un Curso
│   ├── Propón Cambios
│   ├── Revisa & Acepta
│   └── Beneficios
│
├── CTA Section
│   └── Call to Action Final
│
└── Footer
    ├── About
    ├── Features
    ├── Community
    └── Legal
```

## 🎯 Flujo de Usuario

### Usuario No Autenticado (Nuevo)
```
Landing Page
    ↓
Lee características
    ↓
Hace click en "Crear Curso Ahora"
    ↓
Redirige a /register
    ↓
Se registra
    ↓
Verifica email
    ↓
Redirige a /dashboard
```

### Usuario Autenticado
```
Landing Page
    ↓
Navbar muestra opciones adicionales
    ↓
Acceso directo a /dashboard
```

## 🎨 Paleta de Colores Implementada

| Color | Uso | Hex |
|-------|-----|-----|
| Fondo Primario | Background principal | #050a14 |
| Fondo Secundario | Cards y containers | #0d172d |
| Azul Primario | Botones CTA | #3B82F6 |
| Verde Éxito | Checkmarks, validaciones | #00c896 |
| Púrpura | Feature icon colaboración | #a855f7 |
| Verde Claro | Feature icon mejorar | #22c55e |
| Dorado | Feature icon ratings | #fbbf24 |
| Texto Gris | Textos secundarios | #9CA3AF |
| Borde | Dividers | #2D3A4F |

## 📊 Tipografía

```css
Headings (H1): 56px, 800 weight, -1px letter-spacing
Headings (H2): 48px, 800 weight, -0.5px letter-spacing
Headings (H3): 20px, 700 weight
Body Text: 15px, 400 weight
Small Text: 14px, 400 weight
Muted Text: 18px, 400 weight, #9CA3AF
```

## 🔄 Integración con Sistema Existente

### Rutas Conectadas
```typescript
// Landing → Autenticación
/register       // Nueva cuenta
/login         // Acceso existente
/dashboard     // Panel principal (protegido)

// Desde Dashboard
/course/create      // Crear nuevo curso
/course/detail/:id  // Ver detalles de curso
/:username         // Perfil de usuario
```

### Navegación Disponible
- Botones de login/register en navbar
- Enlaces smooth scroll a secciones
- Botones CTA principales dirigidos a autenticación
- Footer con links contextuales

## 💡 Características Implementadas

### ✅ Responsive Design
- Mobile first approach
- Media queries optimizadas
- Layouts adaptables

### ✅ Animaciones
- Hero card flotante (3s loop)
- Hover effects en cards
- Transiciones suaves (0.3s)
- Transform effects en botones

### ✅ Accesibilidad
- Contraste de colores WCAG A
- Material Icons accesibles
- Estructura semántica
- Links navegables

### ✅ Performance
- CSS puro (sin librerías adicionales)
- Angular standalone component
- Lazy loading en rutas
- Optimización de imágenes

## 🚀 Uso de la Landing Page

### Instalación
Ya está integrada en la aplicación. Solo accede a `/`

### Customización

#### Cambiar Estadísticas
```html
<div class="stat">
  <span class="stat-number">AQUÍ_TU_NÚMERO</span>
  <span class="stat-label">Tu Label</span>
</div>
```

#### Agregar Sección Nueva
1. Copia estructura de una sección existente
2. Dale un ID único: `id="nueva-seccion"`
3. Agregal al navbar: `<a href="#nueva-seccion" ...>`
4. Aplica los estilos de `section-header` y contenido

#### Cambiar Colores
Modifica en `/src/styles.css`:
```css
:root {
  --primary-button: #3B82F6; /* Cambiar este */
  --primary-color: #050a14;
}
```

## 📱 Breakpoints Responsive

```css
Desktop:  > 1200px  (100% features)
Tablet:   768px - 1200px  (2 columns)
Mobile:   < 768px   (1 column)
```

## 🔒 Seguridad

- No hay datos sensibles expuestos
- Links de autenticación seguros
- CORS configurado en backend
- Tokens JWT validados

## 📈 Analytics Sugeridos

Considera agregar:
- Google Analytics para tracking
- Conversión de registros desde landing
- Bounce rate por sección
- Click tracking en CTAs
- Tiempo en página

## 🎓 Educación para Usuarios

La landing page comunica:

1. **Propósito del Sistema**
   - Es una plataforma de cursos colaborativa
   - Similar a GitHub pero para educación

2. **Valor Principal**
   - Control de versiones para cursos
   - Colaboración entre educadores
   - Sistema de mejora continua

3. **Funcionalidades Clave**
   - Crear y organizar cursos
   - Múltiples tipos de contenido
   - Colaboración mediante pull requests
   - Calificaciones y feedback

4. **Viaje del Usuario**
   - Nuevo → Registrarse → Crear Curso
   - Explorar → Marcar favoritos → Aprender
   - Copiar → Mejorar → Contribuir cambios
