# OmniVision: Resumen del Sistema y Landing Page

## 1. Visión General del Programa (El Sistema)

**OmniVision** es una plataforma orientada a centros de control, seguridad, logística e instalaciones críticas. Combina el procesamiento de **visión por computador en el Edge** (en el sitio) con un **Panel Operativo Multicanal**.

### Arquitectura Técnica del Frontend
- **Framework Principal**: Construido con [Next.js](https://nextjs.org/) (versión 16.2.3) utilizando el App Router (`/app`).
- **Librerías Base**: React 19, TypeScript.
- **Estilos**: Tailwind CSS v4 para diseño altamente personalizable y adaptable.
- **Rutas Principales**:
  - `/` (Landing Page)
  - `/login` (Autenticación y acceso al panel)
  - `/dashboard` (Panel de control interactivo para operadores)
  - `/api-backend` / `/api-panel` (Secciones relacionadas con el ecosistema de APIs)

### El Pipeline del Sistema (Cómo funciona)
El sistema está diseñado en una arquitectura de **6 etapas** que minimiza la latencia y maximiza la privacidad:
1. **Cámara IP**: Ingreso de la señal de vídeo en vivo (24/7).
2. **Vision-Box (Hardware Edge)**: Un dispositivo basado en la placa *D-Robotics RDK X5* con NPU integrada. Recibe el vídeo y lo decodifica sin sacarlo a internet.
3. **Motor de Visión**: Procesa con **OpenCV** y modelos **YOLOv8** detectando eventos en tiempo real.
4. **Gemini LLM**: Al detectar una alerta, un modelo de lenguaje de IA describe los clips generados.
5. **API + BFF (Backend for Frontend)**: Capas FastAPI y NestJS que coordinan los datos, métricas y usuarios.
6. **Panel Next.js**: La interfaz final (frontend) donde el operador visualiza KPIs, streams de video con bounding boxes e incidentes descritos.

---

## 2. Estructura de la Landing Page (`app/page.tsx`)

La página principal está diseñada para comunicar el valor del producto técnico de manera directa, manteniendo una estética moderna (modo oscuro, rejillas "HUD", y animaciones de tipo escáner). Está dividida en las siguientes secciones (o anclas):

### 🔸 A. Cabecera (Header)
- **Logotipo**: OmniVision.
- **Navegación Rápida**: Qué es, Arquitectura, Vision-Box, Características, Consultas.
- **Acciones (CTAs)**: Botón modal de "Contáctanos" y botón destacado "Iniciar sesión" que dirige a `/login`.

### 🔸 B. Hero Section (Inicio)
- **Mensaje Principal**: *"Vídeo por canal, análisis por fotograma y decisiones en un solo panel."*
- **Visual**: Panel interactivo simulando el entorno de trabajo real.
- **Características Destacadas Rápidas**:
  - **Edge**: Baja latencia y red local segura.
  - **YOLOv8**: Análisis de fotograma a fotograma.
  - **Alertas**: Priorización de riesgos y contexto.
  - **Privacidad**: Datos sensibles no van a la nube sin necesidad.

### 🔸 C. ¿De qué se trata OmniVision? (`#que-es`)
- Explicación narrativa que resalta cómo una cámara convencional se convierte en un detector anticipado usando hardware local.
- Incluye fotografía temática representativa de una sala de control con monitores y analíticas.

### 🔸 D. Arquitectura del Sistema (`#arquitectura`)
- Un diagrama paso a paso estructurado con **6 tarjetas numeradas**, desde la Cámara IP hasta el Panel Next.js, explicando el flujo de trabajo (Pipeline).
- Resumen adicional dividido en 3 capas fundamentales:
  - **Capa 1 (Edge)**: Captura e ingesta.
  - **Capa 2 (Servicios)**: Análisis y coordinación.
  - **Capa 3 (Experiencia)**: Interfaz del operador.

### 🔸 E. Hardware: Vision-Box (`#vision-box`)
- Detalla el "cerebro" físico del sistema: la carcasa de aluminio.
- **Conectividad**: Entradas BNC (4 cámaras), Gigabit Ethernet, USB-C, HDMI.
- **Por dentro**: Componentes de la placa SBC *D-Robotics RDK X5* (SoC con acelerador de IA/NPU integrada, diseño sin ventiladores, 40-pin GPIO).
- Justificación de la decisión por hardware Edge (Latencia mínima, datos protegidos y despliegue modular).

### 🔸 F. Características Principales (`#caracteristicas`)
Una cuadrícula con 6 pilares operativos del software:
1. **Análisis en tiempo real**
2. **Detección configurable**
3. **Vistas previas anotadas**
4. **Multicanal** (múltiples cámaras en paralelo)
5. **Panel operativo unificado**
6. **Edge computing**

### 🔸 G. Consultas Habituales (`#consultas` - FAQ)
Preguntas frecuentes sobre el uso práctico:
- *¿Qué entra por el canal?* (Secuencias e imágenes analizadas).
- *¿Se puede cambiar el modelo de detección?* (Sí, es adaptable).
- *¿Qué ocurre si no hay señal en una cámara?* (Muestra una vista previa neutra sin romper el layout).
- *¿Dónde veo las alertas?* (Directamente en el tablero junto al vídeo, sin cambiar de app).

### 🔸 H. Pie de Página (Footer)
- Derechos de autor, y enlaces directos clave al Login y la sección de dudas. Incluye navegación con scroll suavizado para desplazarse por la página.
