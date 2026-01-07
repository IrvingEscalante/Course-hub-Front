# CourseHub - Landing Page

## Descripción

La landing page es la puerta de entrada a CourseHub, diseñada para presentar la plataforma a usuarios nuevos y motivarlos a crear una cuenta.

## Secciones

### 1. **Navbar (Barra de Navegación)**
- Logo y nombre de la marca
- Links de navegación rápida
- Botones de Login y Register

### 2. **Hero Section (Sección Principal)**
- Headline impactante: "Crea cursos colaborativos, propone mejoras, colabora en línea"
- Subtítulo explicativo
- Call-to-action principal: "Crear Curso Ahora"
- Estadísticas: Cursos creados, colaboradores, estudiantes
- Tarjeta visual animada mostrando estructura de módulos

### 3. **Features Section (Características)**
6 características principales presentadas en cards:

1. **Crear Cursos**
   - Estructura modular
   - Portadas personalizadas
   - Descripciones detalladas

2. **Gestionar Contenido**
   - Soporte multimedia (videos, PDFs, PPTs, notas)
   - Organización por módulos
   - Gestión de versiones

3. **Colaboración en Tiempo Real**
   - Pull Requests
   - Control de cambios
   - Historial de versiones

4. **Copiar y Mejorar**
   - Bifurcación de cursos
   - Propuestas de cambio
   - Historial de modificaciones

5. **Calificaciones y Reseñas**
   - Sistema de estrellas
   - Análisis de calificaciones
   - Comentarios educativos

6. **Comunidad Global**
   - Perfiles de usuarios
   - Sistema de seguimiento
   - Descubrimiento de cursos

### 4. **How It Works (Cómo Funciona)**
Proceso de 3 pasos:
1. Crea tu Curso
2. Organiza en Módulos
3. Publica Contenido

### 5. **Collaboration Workflow (Flujo de Colaboración)**
Explica el sistema de bifurcación y pull requests:
1. Bifurca un Curso
2. Propón Cambios
3. Revisa & Acepta

Incluye beneficios de la colaboración:
- Control Total
- Historial Completo
- Comunidad Activa

### 6. **CTA Section (Llamada a la Acción)**
Sección de conversión:
- Headline: "¿Listo para revolucionar la educación?"
- Botones principales de registro y login

### 7. **Footer**
- Información de la marca
- Links de navegación
- Información legal
- Derechos de autor

## Diseño

La landing page sigue el diseño del sistema CourseHub:

### Colores
- **Primario**: #050a14 (Fondo oscuro)
- **Secundario**: #0d172d (Contenedores)
- **Acentos**: 
  - Azul: #3B82F6
  - Verde: #00c896
  - Púrpura: #a855f7
  - Dorado: #fbbf24

### Tipografía
- Font: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Headings: 800 de peso (bold)
- Body: 400 de peso (normal)

### Características de Diseño
- Gradientes suaves
- Transiciones y animaciones fluidas
- Cards con hover effects
- Responsivo (Desktop, Tablet, Mobile)
- Dark mode por defecto

## Componentes Técnicos

### TypeScript Component
```typescript
export class Landing {
  router = inject(Router);

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
```

### Funcionalidades
- Navegación smooth scroll a secciones
- Redirección a páginas de autenticación
- Interfaz responsive
- Animaciones CSS3

## Integración en Rutas

La landing page está configurada como la ruta raíz (`/`):

```typescript
{path: '', component:Landing},
```

Usuarios autenticados pueden navegar a:
- `/dashboard` - Panel principal
- `/course/create` - Crear curso
- `/course/detail/:id` - Ver detalle del curso

## Animaciones

- **Float**: Animación de flotación en hero card (3s loop)
- **Hover Effects**: 
  - Cards suben al pasar el ratón (transform: translateY)
  - Cambios de color en bordes
  - Sombras dinámicas

## Responsive Design

### Desktop (>1200px)
- Todas las secciones visibles
- Grid layouts completos
- Navbar con links completos

### Tablet (768px - 1200px)
- Grid ajustado (2 columnas en features)
- Navbar adaptada
- Padding reducido

### Mobile (<768px)
- Grid de 1 columna
- Navbar simplificada (sin links)
- Botones apilados
- Tipografía ajustada
- Padding mínimo

## Futuras Mejoras

- [ ] Carrusel de testimonios de usuarios
- [ ] Números dinámicos (estadísticas en tiempo real)
- [ ] Video explicativo del sistema
- [ ] Chat de soporte en tiempo real
- [ ] Sección de precios/planes
- [ ] Integración con redes sociales
