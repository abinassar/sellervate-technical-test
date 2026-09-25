Necesito implementar la siguiente funcion:

1. Dividir el contenido de las ventanas de home para el rol ADMIN, TEAM_LEAD Y SPECIALIST. Haz esto en base a los codigos de cada rol y de la forma mas generica posible.

2. Diseño base de la ventana de inicio del ADMIN/TEAM_LEAD:

2.1 De inicio debe mostrar las últimas 3 conversaciones, con un componente reusable conversation-card que muestre una lista de tarjetas con el titulo y descripcion de cada una de esas 3 conversacion. Con una separacion a la izquierda del titulo y la descripcion de la conversacion, se muestran hasta 10 mensajes de la conversacion. Si la conversacion tiene mas de 10 mensajes se muestra un boton de Ver Conversación Completa, este botón redirije a una Ventana /conversation/id.

2.2 Dentro de esa Ventana se tiene el mismo componente reusable conversation-card, pero aqui el componente tiene las siguientes diferencias:

* Mostrará la conversación completa, en desktop debe ampliarse el alto del componente al maximo que pueda abarcar en la pantalla para que puedan verse la mayor cantidad de mensajes posibles. En movil manten el titulo y descripcion de la conversacion sticky en la parte superior, de forma que el usuario pueda hacer scroll y verla completamente.

* Al lado derecho de las respuestas del usuario SPECIALIST, cosa que se puede validar en base al id del usuario del mensaje, se debe colocar un icono de comment, que permita colocar una ponderación/qualityLevel de una lista select al mensaje junto con una observacion (Esto ajustado al qualitylevel), esto debe hacerse en un formulario dentro de un modal.


3. Se debe tener data seed para distintos QualityLevel, los mismos seran:

- name: Pésimo
- description: Mensaje sin sentido o incluso fuera de lugar, no ajustado al estándar técnico y profesional de trabajo.
- level: 0

- name: Medianamente Deficiente
- description: Mensaje o conversación con contenido vago, reflejando carencia de conocimiento técnico sobre el producto en cuestión.
- level: 25

- name: Bueno
- description: Mensaje o conversación que refleja la respuesta a la inquietud o duda reflejada por el cliente, sin embargo, deja puntos abiertos a más dudas o no expresa de forma explícita toda la idea necesaria para solventar la duda. De forma que, un cliente con algo de conocimiento podrá entenderlo pero otro sin conocimiento absoluto quedará aún con dudas.
- level: 50

- name: Bastante Bueno
- description: Mensaje o conversación que refleja la respuesta a la inquietud o duda reflejada por el cliente, incluyendo explicación digerible por parte del mismo, dado prioridad y dirección a solventar únicamente la duda, sin dejar espacio a siguientes dudas. Teniendo la única carencia en falta de ejemplos, estructurar pasos para el usuario o entregar recursos que sirvan de apoyo al cliente para terminar la guía.
- level: 75

- name: Excelente
- description: Mensaje o conversación que solventa por complete la inquietud o duda reflejada por el cliente, incluyendo explicación digerible por parte del mismo, dado prioridad y dirección a solventar únicamente la duda, además reflejando la implementación de ejemplos, pasos estructurados para el usuario o el envío de recursos que sirvieron de apoyo al cliente para terminar la guía.
- level: 100

4. Recuerda colocar botones de retorno (fleche hacia la izquierda) en la Ventana de /conversation, para poder retornar a la Ventana principal.

Dejame saber si tienes dudas sobre la implementación o sobre puntos que no estoy considerando.s