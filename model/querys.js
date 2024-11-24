//CONEXIÓN A NUESTRA BD
/* EL MODELO NOS PERMITE ACCEDER A LA INFORMACION DE LA BASE DE DATOS, ES DECIR TRABAJAR CON SENTENCIAS PARA
INTERACTUAR CON LOS REGISTROS*/

module.exports = {

    //-INICIO DE SESION
    inicioSesion:function(conexion, correo, contrasenia, funcion){
        conexion.query("select id_usuario, nombre from usuario where correo=? and contrasenia=?",[correo,contrasenia], funcion );
    },

    // -----------------------------------------------------------------------------------------------------------------
    // - APARTADO PARA MOSTRAR LOS ARTICULOS EN EL INICIO 
      //*alimento
    obtener:function(conexion, funcion){
        conexion.query("SELECT id_productos,nombre, imagen,precio FROM productos WHERE categoria='Higiene Personal'", funcion);
    },
      //*alimento
    obtener2:function(conexion, funcion){
        conexion.query("SELECT id_productos,nombre, imagen,precio FROM productos WHERE categoria='Videojuegos'", funcion);
    },
    //*VETERINARIA
    veterinaria:function(conexion, funcion){
        conexion.query("SELECT id_productos, nombre, categoria, precio, imagen, descripcion FROM productos where categoria='veterinaria'", funcion);
    },
 //*salud
    salud:function(conexion, funcion){
        conexion.query("SELECT id_productos, nombre, categoria, precio, imagen, descripcion FROM productos where categoria='salud'", funcion);
    },
 //*alimento
 alimento:function(conexion, funcion){
    conexion.query("SELECT id_productos, nombre, categoria, precio, imagen, descripcion FROM productos where categoria='alimentos'", funcion);
},

// -----------------------------------------------------------------------------------------------------------------

//-AQUI AL MOMENTO DE SELECCIONAR UN PRODUCTO CREA LA CONSULTA PARA MOSTRAR DETALLES DEL PRODUCTO
descripcionn:function(conexion, id, funcion){
    conexion.query("SELECT id_productos, nombre, categoria, precio, imagen, descripcion FROM productos where id_productos=?",[id.id_productos],funcion);
},

// -----------------------------------------------------------------------------------------------------------------

//-VER FAVORITOS DEL USUARIO

verFav:function(conexion, id_usuario, funcion){

    conexion.query("select p.nombre, p.imagen from favoritos as f join usuario as u on u.id_usuario = f.id_usuario join productos as p on p.id_productos = f.id_productos where u.id_usuario=?",[id_usuario],funcion)
},

//-- AGREGAR FAVORITOS
agregar_fav:function(conexion, id_usuario, id_productos){
    conexion.query("insert into favoritos (id_usuario, id_productos) values(?,?)",[id_usuario,id_productos])

},
// -----------------------------------------------------------------------------------------------------------------

// -VER MI CARRITO PARA CONFIRMACION DE COMPRAS

verCarr:function(conexion,id_usuario, funcion){
    conexion.query("select p.nombre, p.precio, p.imagen from usuario as u join carrito as c on c.id_usuario = u.id_usuario join carrito_producto as cp on cp.id_carrito = c.id_carrito join productos as p on p.id_productos = cp.id_productos where u.id_usuario=?",[id_usuario],funcion)

},


// - TRANSACCION PARA AGREGAR AL CARRITO 

insertarCarrito: function (conexion, id_usuario, callback) {
    const query = "INSERT INTO carrito (id_usuario) VALUES (?)";
    conexion.query(query, [id_usuario], (err, result) => {
        if (err) {
            console.error("Error al insertar en carrito:", err); 
            return callback(err); //* DEVUELVE EL ERROR AL CALLBACK
        }
        console.log("Resultado de insertarCarrito:", result); //* VERIFICACION DE RESULTADO EN CONSOLA
        callback(null, result); //* PASAMOS EL RESULTADO AL CALLBACK
    });
},


insertarCarritoProducto: function(conexion, id_carrito, id_productos, callback) {
    const query = "INSERT INTO carrito_producto (id_carrito, id_productos) VALUES (?, ?)";
    conexion.query(query, [id_carrito, id_productos], (err, result) => {
        if (err) {
            return callback(err); //* DEVUELVE EL ERROR AL CALLBACK
        }
        callback(null, result); //* PASAMOS EL RESULTADO AL CALLBACK
    });
},

obtenerTransacciones2: function(conexion,id_usuario, callback) {
    const query = `
        SELECT id_usuario, GROUP_CONCAT(id_productos) as productos 
        FROM carrito_producto 
        JOIN carrito ON carrito_producto.id_carrito = carrito.id_carrito 
        WHERE id_usuario=?
    `
    conexion.query(query, [id_usuario], callback);
},
obtenerTransacciones: function(conexion,id_usuario, callback) {
    const query = `
        SELECT t.id_transaccion, GROUP_CONCAT(pt.id_productos) AS productos
        FROM transacciones2 t
        JOIN productos_transaccion2 pt ON t.id_transaccion = pt.id_transaccion
        WHERE t.id_usuario = ?
        GROUP BY t.id_transaccion;
    `
    conexion.query(query, [id_usuario], callback);
},




}
