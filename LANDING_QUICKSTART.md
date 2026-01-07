# 🚀 Quick Start - Landing Page CourseHub

## Archivos Creados

```
Frontend/proyect/src/app/pages/landing/
├── landing.ts                      # Componente
├── landing.html                    # Template
├── landing.css                     # Estilos
├── README.md                       # Guía rápida
├── GUIDE.md                        # Guía detallada
└── DOCUMENTATION.md                # Documentación completa
```

## Cambios en Archivos Existentes

```
Frontend/proyect/src/app/pages/auth/
└── auth.routes.ts                 # Agrega Landing como ruta raíz

Frontend/proyect/src/app/shared/components/header/
├── header.ts                       # Detecta landing page
└── header.html                     # Oculta header en landing
```

## Estructura de la Landing

```
Landing Page (/)
│
├─ NAVBAR
│  ├─ Logo
│  ├─ Navigation Links (smooth scroll)
│  └─ Auth Buttons
│
├─ HERO SECTION
│  ├─ Headline principal
│  ├─ Subtitle
│  ├─ CTA Buttons
│  ├─ Statistics
│  └─ Animated Card
│
├─ FEATURES (6 Cards)
│  ├─ Crear Cursos
│  ├─ Gestionar Contenido
│  ├─ Colaboración
│  ├─ Copiar y Mejorar
│  ├─ Calificaciones
│  └─ Comunidad
│
├─ HOW IT WORKS (3 Steps)
│  ├─ Crea tu Curso
│  ├─ Organiza en Módulos
│  └─ Publica Contenido
│
├─ WORKFLOW (Collaboración)
│  ├─ Bifurca un Curso
│  ├─ Propón Cambios
│  ├─ Revisa & Acepta
│  └─ Beneficios
│
├─ CTA SECTION
│  └─ Call to Action Final
│
└─ FOOTER
   ├─ Links
   ├─ Legal
   └─ Copyright
```

## Colores Usados

```
#050a14 - Fondo primario        🟦 #3B82F6 - Azul CTA
#0d172d - Contenedores          🟩 #00c896 - Verde
#9CA3AF - Gris (muted)          🟪 #a855f7 - Púrpura
#2D3A4F - Bordes                🟨 #fbbf24 - Dorado
```

## Componentes Clave

### 1. Navbar Sticky
- Se queda arriba al scrollear
- Links de navegación rápida
- Botones de login/register

### 2. Hero Section
- Headline con gradiente
- Card animada (flotante)
- Estadísticas de la plataforma
- 2 botones CTA

### 3. Feature Cards (6)
- Icono + Título + Descripción
- Lista de beneficios
- Hover effects (levanta con sombra)
- Diferentes colores de icons

### 4. Steps Section
- 3 pasos numerados
- Iconos descriptivos
- Flechas de conexión

### 5. Workflow Section
- 3 fases del flujo colaborativo
- Beneficios principales
- Cards con background gradiente

### 6. Footer
- Múltiples secciones
- Links navegables
- Legal y copyright

## Responsive Design

### Breakpoints
```
Desktop:  > 1200px   - Todo visible
Tablet:   768-1200px - Features 2 cols
Mobile:   < 768px    - Stack vertical
```

## Animaciones

```css
/* Hero Card Flotante */
@keyframes float { 
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Cards al hover */
transform: translateY(-8px);
box-shadow: 0 20px 50px rgba(59, 130, 246, 0.2);

/* Transiciones suaves */
transition: all 0.3s ease;
```

## Rutas Conectadas

```
/             → Landing (inicio)
/register     → Registrarse
/login        → Iniciar sesión
/dashboard    → Panel principal (auth requerido)
/course/...   → Secciones de cursos
/:username    → Perfil de usuario
```

## Métodos del Componente

```typescript
// Scroll suave a sección
scrollToSection(sectionId: string)

// Navegar a ruta
navigateTo(path: string)
```

## Variables CSS Globales

```css
:root {
  --primary-color: #050a14;
  --secondary-color: #0d172d;
  --primary-button: #3B82F6;
  --muted-text: #9CA3AF;
  --border: #2D3A4F;
  /* ... más variables */
}
```

## Flujo de Usuario Esperado

```
1. Llega a landing page (/)
   ↓
2. Lee características (2-3 min)
   ↓
3. Click "Crear Curso Ahora"
   ↓
4. Redirige a /register
   ↓
5. Completa registro
   ↓
6. Verifica email
   ↓
7. Redirige a /dashboard
   ↓
8. ¡Comienza a crear cursos!
```

## Testing

### Desktop
```bash
npm start
# Navegar a http://localhost:4200
# Probar todos los links y botones
# Verificar que el navbar se queda fijo
```

### Mobile
```bash
npm start -- --host
# Acceder desde teléfono: <tu-ip>:4200
# Verificar responsiveness
# Probar navegación en móvil
```

### Navegadores
- Chrome (✅)
- Firefox (✅)
- Safari (✅)
- Edge (✅)

## Optimizaciones Implementadas

- ✅ CSS puro (sin librerías extra)
- ✅ Material Icons (SVGs livianos)
- ✅ Animaciones GPU-aceleradas
- ✅ Lazy loading de Angular
- ✅ Standalone components
- ✅ Responsive móvil-first

## Cambios de Rutas

Antes:
```typescript
{path: '', component:Dashboard, resolve:{user : UserResolver}}
```

Después:
```typescript
{path: '', component:Landing}
{path: 'dashboard', component:Dashboard, resolve:{user : UserResolver}}
```

## ¿Cómo Customizar?

### Cambiar Headline Principal
En `landing.html` busca:
```html
<h1 class="hero-title">
  <span class="highlight">Crea</span> cursos...
</h1>
```

### Cambiar Colores
En `landing.css` (o /src/styles.css):
```css
--primary-button: #3B82F6; /* Cambiar este valor */
```

### Agregar Estadística Nueva
Copia una card `.stat` y actualiza valores:
```html
<div class="stat">
  <span class="stat-number">TU_NÚMERO</span>
  <span class="stat-label">Tu Label</span>
</div>
```

## Documentación Completa

- 📄 [README.md](./landing/README.md) - Guía rápida
- 📖 [GUIDE.md](./landing/GUIDE.md) - Guía detallada
- 📚 [DOCUMENTATION.md](./landing/DOCUMENTATION.md) - Documentación completa

## ¡Listo para Producción!

```bash
npm run build
# Verifica tamaño del bundle
# Deploy en tu servidor
```

## Soporte Navegadores

| Navegador | Versión | Status |
|-----------|---------|--------|
| Chrome    | 90+     | ✅ |
| Firefox   | 88+     | ✅ |
| Safari    | 14+     | ✅ |
| Edge      | 90+     | ✅ |
| Mobile    | Moderno | ✅ |

---

**Para dudas**: Ver DOCUMENTATION.md en carpeta landing/
