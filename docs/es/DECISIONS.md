# Documento de Decisiones (Plataforma Sellervate QA)

---

## 1. Producto (Product)

### El Problema Real
Sellervate gestiona la experiencia de cliente operando bajo la identidad de la marca contratante. El producto real es la calidad y el tono de las respuestas emitidas por los especialistas. El cuello de botella no radica en la entrega de mensajes, sino en el aseguramiento asíncrono de la calidad: los supervisores carecen de un flujo sistemático para auditar respuestas frente a procedimientos específicos de marca, los especialistas no tienen visibilidad de sus observaciones de mejora, y no existe evidencia cuantitativa para demostrar a los clientes su progreso trimestre a trimestre.

### Qué se Construyó Primero y Por Qué
Priorizamos el **Flujo Principal de Revisión y Entrenamiento (Coaching)**:
1. **Flujo de Auditoría del Supervisor**: Inspección ágil de conversaciones y respuestas individuales enviadas, permitiendo calificaciones cuantitativas y cualitativas acompañadas de comentarios de feedback.
2. **Panel de Desempeño del Especialista**: Vista privada para que cada especialista consulte sus calificaciones, retroalimentación del supervisor y evolución de métricas.
3. **Contexto de Marca y Referencia Procedimental**: Incorporación de manuales de tono y preguntas frecuentes por producto junto a las conversaciones para que la evaluación esté fundamentada en estándares reales.

### Qué se Dejó Fuera y Por Qué
- **Helpdesk en Vivo / Mensajería con Clientes**: Este sistema es estrictamente de auditoría post-hoc. Integrar un chat en vivo desviaría el foco del valor principal de evaluación.
- **Scoring Automático con IA en V1**: Según las directrices del ejercicio, implementar un modelo en tiempo de ejecución crea una aproximación frágil del juicio humano y consume tiempo crítico que debe dedicarse a la autorización y al flujo de revisión.
- **Proveedor Pesado de Autenticación (OAuth/SSO)**: Sustituido por un *User Switcher* accesible para pruebas locales que delega la validación estricta de permisos al servidor.

### Dónde Pertenece un Modelo de IA (Visión V2)
En una versión V2, un modelo LLM se ubicaría como un **filtro asíncrono de triaje en cola**:
- **Rol**: Analizar respuestas salientes comparándolas con los procedimientos de la marca para alertar anomalías críticas (ej. ofrecer devoluciones sin diagnóstico previo o ignorar el historial de pedidos) y priorizarlas para revisión humana.
- **Requisitos de Confianza**: Alta precisión / baja tasa de falsos positivos, calibración de confianza, validación humana previa y ausencia de penalizaciones automáticas.

### Preguntas para los Stakeholders antes de una V2
1. ¿Qué protocolos de ingestión o webhooks se utilizarán para conectar directamente con plataformas como Zendesk, Gorgias o Front?
2. ¿Qué umbrales de SLA y matrices de ponderación ponderada existen entre marcas de consumo masivo y marcas técnicas?
3. ¿Deberían los especialistas poder responder o abrir un hilo de discusión sobre las observaciones recibidas?

---

## 2. Arquitectura (Architecture)

### Por Qué Esta Estructura
Se seleccionó Next.js 16 (App Router) con TypeScript, Tailwind CSS, daisyUI y PostgreSQL mediante Supabase. El uso de Server Components y Server Actions proporciona una arquitectura declarativa y funcional, restringiendo el acceso a la base de datos exclusivamente a capas seguras en el servidor.

### Diseño del Modelo de Datos
El esquema relacional separa el aislamiento multimarca y la operativa:
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

### Qué Falla Primero al Escalar
- **Agregación de Métricas en Tiempo Real**: Con cientos de miles de registros, las consultas agregadas al vuelo requerirán vistas materializadas o trabajos en segundo plano (cron rollups).
- **Tasa de Ingestión Multicanal**: La recepción masiva de webhooks externos requerirá un broker de mensajes asíncrono (ej. Redis / BullMQ) para desacoplar la cola de procesamiento.

---

## 3. IA (Proceso de Desarrollo)

### Cómo Trabajamos con IA
El desarrollo se realizó bajo una metodología de pair-programming agéntico con Google Antigravity y OpenSpec. La definición previa de especificaciones y contratos de comportamiento guió de forma precisa cada artefacto de código.

### Aciertos de la IA vs. Ajustes Manuales
- **Aciertos de la IA**: Generación rápida de modelos relacionales, componentes visuales declarativos y creación de datos semilla realistas con tonos diferenciados y fallas procedimentales deliberadas.
- **Ajustes Manuales**: Restricción del alcance en tiempo de ejecución (evitando scoring automático prematuro), blindaje de la autorización en servidor y aplicación estricta de patrones declarativos de Next.js Server Components.

### Extracto de Prompt Destacado
```markdown
"Genera datos semilla realistas para 2 marcas distintas: 'Apex Scooters' (exige diagnóstico técnico previo a devoluciones) y 'Nova Packaging' (exige respuestas concisas y rápidas en 3 líneas). Incluye al menos 6 conversaciones, 3 especialistas y 2 supervisores, con fallas deliberadas (ej. no revisar historial de órdenes) para evaluar el flujo de QA."
```

---

## 4. Estado (Status)

### Estado Actual de la Implementación
- **Completado**:
  - Marco conceptual y metodología "Qué quiero, Qué tengo, Cómo lo hago" en `project-base-concepts.md`.
  - Documento de Decisiones bilingüe (`docs/en/DECISIONS.md` y `docs/es/DECISIONS.md`).
  - Especificaciones OpenSpec para `project-documentation` y `core-qa-domain`.
  - Estructura base del proyecto, contenedor Docker con PostgreSQL y configuración de dependencias.
- **Siguiente Orden de Prioridad**:
  1. Esquema de base de datos y políticas de RLS en Supabase (`SLLVT-002`/`SLLVT-004`).
  2. Inserción de dataset semilla realista multimarca.
  3. Interfaz del flujo de revisión para supervisores y panel de coaching para especialistas.
  4. Gráficos de tendencias y métricas de calidad con Recharts.

### Elemento Notificado en el Repositorio / Compromiso Asumido
- **Elemento Destacado**: Implementación de *User Switcher* basado en cookies en lugar de integración completa con JWT Supabase Auth.
- **Justificación**: Permitió concentrar el tiempo disponible en el modelado de dominio, la autorización forzada en servidor y la experiencia de usuario de QA sin sobrecargar el proyecto con configuraciones de proveedores de autenticación.

