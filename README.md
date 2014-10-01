# stt_cards

Stt_cards pretende facilitar, mediante el dictado, la tarea de pasar datos escritos a mano distribuidos en campos a formato digital. Por ejemplo fichas de clientes en los que tenemos campos que se repiten: nombre, apellidos, localidad, provincia, etc. 

Stt_cards usa "HTML5 Speech Recognition API". Hasta la fecha me parece que el único explorador web que lo soporta es [Chrome](//www.google.com/chrome)
En dispositivos móviles con Chrome también funciona.

<h2>Instalación:</h2>

Clona stt_cards en tu servidor web:

`$ git clone https://github.com/carvilsi/stt_cards.git`

<h2>Uso:</h2>

* Escribe en recuadro de texto los campos que quieres rellenar. Cada uno de ellos en una línea. Los campos pueden estar formados como máximo por dos palabras.
* Crea los Campos
* Empieza. El explorador te pedirá permisos para activar el micro. El dictado debe de empezar por el nombre del campo en el que se quiere escribir y sin pausa (de manera fluida) se deben de decir los datos asociados. Antes de seguir con el siguiente campo realiza una pequeña pausa (como un punto y aparte). Si vas a enumerar los campos hazlo con números, por ejemplo "dirección 1", "dirección 2", etc.
* Para.
* Datos Ok. Sólo si están correctos, puedes modificar la transcripción antes de realizar esta acción. Los datos se guardan en el localStorage del navegador.
* Ya puedes Exportar Datos o Empezar de nuevo para añadir más datos. La exportación se realiza en formato csv (que lo puedes importar, por ejemplo a una excel). La cabecera del csv está formada por los nombres de los campos. 
