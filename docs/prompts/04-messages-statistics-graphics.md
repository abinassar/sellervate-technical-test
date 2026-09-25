# 04. Estadísticas de Mensajes, Gráficos de Calidad y Feedback del Especialista

## 1. Requerimientos del Prompt

### Para ADMIN / TEAM_LEAD:
* Colocar debajo de las conversaciones:
  * **Recuento total de la cantidad de respuestas en cada Quality Level:** Visualizado como un gráfico de dona (Donut Chart).
  * **Estadística según cada especialista del sistema en base a:**
    * Total de conversaciones asignadas.
    * Promedio de mensajes por conversación.
    * Porcentaje de Quality Level de cada tipo en base a todas sus respuestas.

### Para SPECIALIST:
* Colocar debajo de las conversaciones:
  * **Mismo porcentaje de Quality Level** de cada tipo en base a todas sus respuestas.
  * **Feed de últimas ponderaciones y observaciones:** Permitir visualizar las últimas calificaciones recibidas con la observación asociada y un botón para navegar directamente a la conversación de dicho mensaje.
  * **Componente reusable:** `message-detail.tsx` para presentar las respuestas calificadas y sus observaciones.

---

## 2. Decisiones Técnicas y Arquitectura

1. **Cálculos Server-side y Agregaciones SQL:**
   * Las estadísticas y distribuciones de calidad se consultan directamente en base de datos (`postgres` / Server Components) para abarcar la totalidad de los datos reales del sistema y garantizar alta eficiencia.
2. **Gráficos y Visualización:**
   * Uso de `recharts` (`PieChart`, `Pie`, `Cell`, `Tooltip`, `ResponsiveContainer`) con mapeo semántico de colores para cada nivel de calidad:
     * *Pésimo (0 pts)*: Error / Rojo
     * *Medianamente Deficiente (25 pts)*: Warning / Naranja
     * *Bueno (50 pts)*: Info / Azul
     * *Bastante Bueno (75 pts)*: Primary / Índigo
     * *Excelente (100 pts)*: Success / Verde esmeralda
3. **Componente Reusable `MessageDetail`:**
   * Ubicación: `src/components/conversations/message-detail.tsx`
   * Responsabilidad: Presentar la respuesta del especialista, badge con puntuación, texto de la observación/criterio del supervisor, usuario evaluador, fecha y botón de enlace a `/conversation/[id]`.

---

## 3. Plan de Acción Detallado

### Fase 1: Capa de Datos y Consultas en Repositorios (`src/lib/db/repositories/`)
- `getGlobalQualityLevelCounts()`: Total de respuestas agrupadas por nivel de calidad.
- `getSpecialistsPerformanceStats()`: Listado de especialistas con total de conversaciones, promedio de mensajes por conversación y distribución porcentual por nivel de calidad.
- `getSpecialistQualityDistribution(specialistId)`: Desglose porcentual específico de un especialista.
- `getRecentEvaluatedMessagesBySpecialist(specialistId, limit)`: Últimos mensajes calificados con joins a supervisor y nivel de calidad/observación.

### Fase 2: Componentes UI Reusables
- `src/components/home/quality-donut-chart.tsx`: Gráfico de dona con total central, leyenda interactiva y estados vacíos.
- `src/components/home/specialists-stats-table.tsx`: Tabla y tarjetas responsivas con las métricas y barras de porcentaje por especialista.
- `src/components/conversations/message-detail.tsx`: Tarjeta de detalle de mensaje evaluado con CTA de redirección a la conversación.
- `src/components/home/specialist-quality-breakdown.tsx`: Vista de métricas personales de calidad para el especialista.

### Fase 3: Integración en Vistas de `/home`
- Actualizar `src/app/home/page.tsx` para cargar las métricas en paralelo.
- Actualizar `src/components/home/admin-team-lead-home-view.tsx` para mostrar el gráfico de dona y la tabla de especialistas.
- Actualizar `src/components/home/specialist-home-view.tsx` para mostrar la distribución de calidad personal y la lista de observaciones recientes con `MessageDetail`.

### Fase 4: Verificación
- Verificación de tipos TypeScript, compilación con Next.js y adaptabilidad responsive con DaisyUI/Tailwind CSS.
