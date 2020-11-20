# Wellness TechGroup - API

Para iniciar el repositorio:

### Clone GitHub

`git clone git@github.com:OneLifeDesigning/wellness-api.git`

### Install dependences

`npm install`

### Run Test

`npm run test`
Ejecuta el modo test y ejecuta test muy básicos.

### Run seeds

`npm run seeds`

Ejecuta el sistema de carga y conversión de datos a partir de csv de la carpeta bin/csv y los inyecta en la base de datos.

### Run Dev

`npm run dev`

Ejecuta el modo desarrollo y usa el host:puerto: [http://localhost:3010](http://localhost:3010).

### Descripción

Demo de API basada en NodeJs, ExpressJs y MongoDB que nos permite realizar operaciones sencillas de CRUD.

`**Requerimiento**`
`Importar valores desde un fichero CSV, con columnas y datos ficticios, y almacenarlo en BBDD (NoSQL)`

## Solución

Creo un script que se encarga de obtener todos los ficheros de una carpeta y convertirlos a objeto JSON para poder manipularlos e inyectarlos en la base de datos.

`**Requerimiento**`
`Backend NodeJS: encargado de importar los datos y exponerlos en una API que permita hacer operaciones CRUD sobre los datos`

## Solución

Creo los endpoints necesarios para la obtención y edición de los datos (CRUD) en el archivo config/routes.js el cual llama al middledware controlador que realiza la operación correspondiente y retorna un json o un error.

Todos los endpoints son testeados de forma automática ejecutando `npm run test` o con la herramienta Postman de forma manual.

#### Environment

`/Wellness.postman_environment.json`

#### Collection

`/Wellness Api.postman_collection`
