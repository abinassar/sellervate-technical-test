# Documento de Decisiones (Plataforma Sellervate QA)

---

## 1. Producto (Product)

### El Problema Real
Sellervate gestiona la experiencia de cliente operando bajo la identidad de la marca contratante. El producto real es la calidad y el tono de las respuestas emitidas por los especialistas. El cuello de botella no radica en la entrega de mensajes, sino en el aseguramiento asíncrono de la calidad: los supervisores carecen de un flujo sistemático para auditar respuestas de forma rápida frente a procedimientos específicos de marca, así como tampoco tener métricas que permitan precisar puntos de mejora donde los especialistas deben enfocarse.

Por otro lado, los especialistas no tienen visibilidad de sus observaciones de mejora, y no existe evidencia cuantitativa para demostrar a los clientes su progreso a lo largo del tiempo.

### Qué se Construyó Primero y Por Qué
Priorizamos el **Flujo Principal de Revisión y Entrenamiento (Coaching)**:
1. **Flujo de Auditoría del Supervisor**: Inspección ágil de conversaciones y respuestas individuales enviadas, permitiendo calificaciones cuantitativas y cualitativas acompañadas de comentarios de feedback.
2. **Panel de Desempeño del Especialista**: Vista privada para que cada especialista consulte sus calificaciones, retroalimentación del supervisor y evolución de métricas.

### Qué se Dejó Fuera y Por Qué

- **Proveedor Pesado de Autenticación (OAuth/SSO)**: Sustituido por un *User Switcher* accesible para pruebas locales que delega la validación estricta de permisos al servidor. Esto dejado fuera por el tiempo de desarrollo que conllevaba.

- **Referencia Procedimental**: Incorporación de manuales de tono y preguntas frecuentes por producto junto a las conversaciones para que la evaluación esté fundamentada en estándares reales.

- **Referencia Documental**: Incorporación de documentación asociada a productos específicos, que oriente al especialista en la comunicación. Se dejó fuera por el tiempo y modificaciones de modelo de datos necesarias para ello.

- **Chat en vivo entre usuarios**: Permitir intercambio de comunicación entre usuarios del sistema, de forma que en tiempo real se puedan solventar dudas en la manera que se maneja una conversación. Dejado fuera por el tiempo que conllevaba el desarrollo.

- **Generación de reportes**: Dar la capacidad de evaluar y exportar métricas de la ponderación de mensajes y conversaciones, de forma que se identifiquen de mejor manera los puntos de mejora según cada especialista. Dejado fuera por el tiempo que conllevaba el desarrollo.

- **Auditoría en bítacora de cambios**: Valiéndose de los roles de sistema, se propone tener una entidad genérica que permita setear los cambios realizados en cada entidad del sistema, para de esta forma tener control de los cambios que se realizan dentro del sistema y poder auditarlos. 

### Dónde Pertenece un Modelo de IA (Visión V2)
En una versión V2, un modelo de IA se ubicaría en puntos como los siguientes:
- **Evaluar flujo de conversaciones**: Analizar respuestas salientes comparándolas con los procedimientos de la marca para alertar anomalías críticas (ej. ofrecer devoluciones sin diagnóstico previo o ignorar el historial de pedidos) y priorizarlas para revisión humana.
- **Agente de documentación**: En base al producto gestionado se puede tener un análisis en base a documentación configurada para asesorar al especialista en caso de tener dudas en su mensaje o procedimiento.

---

## 2. Arquitectura (Architecture)

### Por Qué Esta Estructura
En los siguientes puntos se describe la metodología y principios implementados para la solución:

  - El marco conceptual y metodología "Qué quiero, Qué tengo, Cómo lo hago" en `project-base-concepts.md` detalla el concepto base en el cual se establece la solución. De forma que se simplifica y desglosa en sub-tareas la implementación.
  - El punto anterior también se fundamenta en el entendimiento de la problemática así como del negocio, que si bien parte de algunos conceptos ambiguos permite detectar puntos de mejora, enmarcar las reglas de trabajo del sistema a fin de obtener la información correcta con la cual solventar el problema presentado. 
  - Cada especificación de OpenSpec dentro de /openspec/specs sirve de base para futuras implementaciones.
  - Usado contenedor Docker con PostgreSQL y configuración de dependencias, de forma que facilita la inserción de datos semilla en el proyecto.

### Diseño del Modelo de Datos
El esquema relacional separa el aislamiento multimarca y la operativa:
- **Estructura Base `BaseEntity`**: Todas las tablas de entidades y modelos heredan identificador primario y metadatos de auditoría canónicos: `id` (UUID), `created_at` / `updated_at` / `deleted_at` (`TIMESTAMPTZ`), y `created_by` / `updated_by` / `deleted_by` (`UUID NULL`). De forma que se simplifica la implementacion de futuras entidades.
  - Disparador (trigger) automatizado `BEFORE UPDATE` en PostgreSQL que garantiza la exactitud de `updated_at`.
  - Estrategia de borrado lógico (soft delete) que aísla los registros activos (`WHERE deleted_at IS NULL`) preservando el historial de auditoría.
  - Mapeadores bidireccionales que concilian `snake_case` de SQL con propiedades de dominio `camelCase` en TypeScript.
- **`roles` y `users`**: Base canónica de control de accesos basada en roles (RBAC) heredando de `BaseEntity`. `roles` define códigos únicos del sistema (`SPECIALIST`, `TEAM_LEAD`, `ADMIN`); `users` define los datos de identidad (`name`, `lastname`) asociados a `idRole` (`role_id`) con funciones guardianas declarativas para discriminación en servidor y UI.
- **`brands` y `brand_assignments`**: Configuración de marcas y vinculación de supervisores/especialistas autorizados.
- **`products` y `procedures`**: Catálogo jerárquico de productos con guías de tono, procedimientos y FAQs.
- **`conversations` y `messages`**: Historial de hilos entre cliente y especialista con marcas de tiempo.
- **`evaluations` y `evaluation_comments`**: Evaluaciones vinculadas a nivel de conversación y mensaje con notas cualitativas.

### Cómo se Hace Cumplir la Autorización
- **Control en Servidor**: La sesión activa (simulada vía cookie segura) se resuelve en el servidor.
- **Reglas de Aislamiento**:
  - Los especialistas solo pueden consultar sus propias conversaciones, mensajes y evaluaciones. Cualquier intento de acceder a datos de otro especialista o de marcas no asignadas es rechazado por el servidor con error de autorización.
  - Los supervisores tienen acceso únicamente a las marcas que tienen asignadas.
- **Evolución a Autenticación Real**: En producción, el resolver de sesión se conecta directamente a tokens JWT de Supabase Auth (`auth.uid()`) sin modificar la lógica de autorización en la base de datos.

---

## 3. IA (Proceso de Desarrollo)

### Cómo Trabajamos con IA
El desarrollo se realizó bajo una metodología de pair-programming agéntico con Google Antigravity y OpenSpec. La definición previa de especificaciones y contratos de comportamiento guió de forma precisa cada artefacto de código.

### Aciertos de la IA vs. Ajustes Manuales
- **Beneficio de partir con especificaciones**: La inversión de tiempo en los spec principales como el concepto principal de la solucion o la estructura base del proyecto permitieron prevenir inconsistencias y errores en las funcionalidades siguientes.
- **Aciertos de la IA**: Generación rápida de modelos relacionales, componentes visuales declarativos y creación de datos semilla realistas con tonos diferenciados y fallas procedimentales deliberadas.
- **Ajustes Manuales**: Testing de la autorización en servidor y aplicación estricta de patrones declarativos de Next.js Server Components. Validacción de cada funcinalidad realizada.

---

## 4. Estado (Status)

### Estado Actual de la Implementación
- **Completado**:
  - Visualización de mensajería y conversaciones.
  - Servicios de ponderación de conversaciones y mensajes.
  - División de roles en el sistema.
  - Interfaz de inicio base.
  - Navegación base con validación de roles en rutas.
- **Siguiente Orden de Prioridad**:
  1. Ponderación de conversaciones en UI.
  2. Generación de reportes para obtener métricas.
  3. Agregar configuración de documentación y preguntas frecuentes.

