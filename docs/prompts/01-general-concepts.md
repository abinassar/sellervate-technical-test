# Descripción general

En base al documento de la prueba tecnica situada en docs\technical-test\Sellervate-Technical-Exercise.pdf quiero establecer y dejar claras las bases de conocimiento sobre las que funcionará el sistema a implementar.

## Metodologia para la implementacion (Esto debe incluirse en la carpeta /docs/general-prompts/project-base-concepts.md y en DECISIONS.md en la seccion que corresponda)

Para esta implementacion se propone simplificar los objetivos en base a 3 interrogantes sencillas, pero que compactan/aclaran el camino hacia la solucion:

1. Que quiero?

2. Que tengo?

3. Como lo hago?

Responder cada pregunta se establecera las bases para la solucion propuesta.

1. Que quiero?

Como administrador/supervisor:

Tener una Plataforma practica que permita la visualizacion, analisis y ponderacion de las conversaciones y respuestas por parte de especialistas a inquietudes/dudas de clientes de distintos productos, de distintas marcas y categorias. Es importante incluir la capacidad de agregar comentarios que acompañe la ponderación colocada, para establecer feedback e intercambio de comentarios entre administrador/supervisor y especialista.

Establecer/configurar preguntas o dudas comunes por cada producto asi como la respuesta a las mismas, esto para que los especialistas se apoyen en ellas al momento de fundamentar una respuesta.

Establecer/configurar procedimientos especificos de forma documental asociados a cada producto que ayude a los especialistas en la documentacion de sus respuestas.

Obtener metricas para saber que tan efectivas, precisas y alineadas a cada marca son las respuestas de soporte por parte de cada especialista.

Calcular metricas de mejora en cuanto a la calidad de respuestas por parte de cada especialista.

Obtener metricas de tiempo promedio de respuestas por parte de cada especialista.

Como especialista:

Tener un panel donde validar mis respuestas y mis conversaciones, asi como la ponderacion y observaciones que mi supervisor me ha dado tanto a respuestas como a conversaciones.

Ver las estadisticas asociadas a mis respuestas/conversaciones, de forma que pueda ver:

* Porcentaje de respuestas con x ponderacion.
* Porcentaje de conversaciones con x ponderacion.
* Estadisticas asociadas estos datos en un tiempo dado (por mes por ejemplo)

2. Que tengo?

Conocimiento de que la gestion de conversaciones entre cliente y especialista se hace en base a un producto que pertenece a:

Una marca.

Una categoria.

Un procedimiento para poder tener preguntas frecuentes y procedimientos de uso asociado a cada producto.

Toda la data (Seed) referente a las conversaciones de distintos especialistas sobre varios productos, asi como el intercambio de mensajes entre las ambas partes.

Estados de ponderacion y observaciones con respecto a cada conversacion y respuesta.

3. Como lo hago?

Designar datos de productos, conversaciones, mensaje, usuarios y demás en data seed.

Aplicar librerias de graficos compatibles con Nextjs.

Calculo de metricas en backend asociadas a la cantidad de datos creada.

Designacion de ponderaciones que puede tener una conversacion.

Aplicar configuracion de las ponderaciones, con su descripcion respectiva, estas ponderaciones serviran tanto para conversaciones como para respuestas.

## Declaración final

En base a estos puntos necesito tu analisis de como lo estoy planteando abordarlo, dame feedback de funcionalidades o modificaciones que nutran tambien esta implementacion, asi como puntos que no este tomando en cuenta y a los que deba prestar atencion en la estructura de base de datos o funcionalidades a implementar.

Necesito que crees el archivo DECISIONS.md en la carpeta docs/es y docs/en. El DECISIONS.md debe estar estructurado con las secciones: Product, Architecture, AI, y Status. Toma en cuenta el procedimiento "que tengo, que quiero y como lo hago" para colocarlo en ese archivo además de las consideraciones clave que tengo planteadas.