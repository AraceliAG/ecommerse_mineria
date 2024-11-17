var con = require('../config/conection')
var producto = require('../model/querys')
module.exports={


    //- FUNCION PARA MOSTRAR EL LOGIN PRINCIAPAL 
    login:function(req, res){
        
        res.render('login')
    },

    //- VERIFICACION SI EXISTE EL USUARIO
    inicio:function(req, res) {
        const inicio = req.body; //*ESTO ES EL DATO QUE SE MANDA DEL FORMULARIO DE LA VISTA
        console.log(req.body);
    
        producto.inicioSesion(con, inicio.correo, inicio.contrasenia, function(err, datos) {
    
            console.log("datos: ", datos);
            console.log("correo dentro de la función:", inicio.correo);
            console.log("contraseña dentro de la función:", inicio.contrasenia);
            
            if (err) {
                console.error("Error en la consulta: ", err);
                return res.status(500).send('Error en el servidor');
            }
            
            if (!datos.length) { //SI NO SE ENCUENTRAN LOS DATOS REGRESA EL MENSAJE
                return res.status(401).send('Correo o contraseña incorrectos');
            }

            

            const datosUsuario = datos[0];
            console.log("se va enviar este dato: ", datosUsuario)
            req.session.usuario = datosUsuario;
            
            //SI EXISTE REDIREDIGE AL INDEX
            res.redirect('index');
        });
    },
    

    //- FUNCION PARA MOSTRAR LOS PRODUCTOS POR DEPARTAMENTO EN EL INICIO

    index:function(req, res){ //VISUALIZACIÓN DE NUSTRO HOME PRINCIPAL
        //PARA REALIZAR MÁS DE UNA CONSULTAS SE TIENEN QUE AGREGAR COMO SE VE AQUI PRODUCTO>PRODUCTO>PRODUCTO Y SE MANDAN
        const usuario = req.session.usuario;
        console.log("hola acabo de llegar xD: ", usuario  )
        
        producto.obtener(con, function(err, datos){ 

        producto.obtener2(con, function(err, datos2){

        producto.veterinaria(con, function(err, datos3){
            
        producto.salud(con, function(err, datos4){

        producto.alimento(con, function(err, datos5){
            res.render('index', {title:'Aplication', productos:datos, productos2:datos2, veterinaria:datos3, salud:datos4, alimento:datos5}) //PURO VER

        })

        
        })
        
        })
        
       
        
        })
    })

    },
    

    //-PARA VER NUESTRA VISTA DE DESCRIP PRODUCTO AL MOMENTO DE SELECCIONAR UN PRODUCTO EN EL INICIO
    seleccion:function(req, res){ 
        const usuario = req.session.usuario;
        
        const data = req.body
        console.log("hola acabo de llegar xD descripsion: ", usuario  )
        console.log("envio de: ", data)
        // Guarda productoId en la sesión como un entero
        req.session.productoId = parseInt(data.productoId, 10);
        res.redirect("descripcion")
        
    },

    //-AQUI SE MUESTRA LOS DATOS DEL PRODUCTO SELECCIONADO 
    descrip:function(req,res){
        //* RECUPETRAMOS LOS DATOS
        const productoId = req.session.productoId;


        console.log("Datos recuperados: ", productoId);

        producto.descripcionn(con, { id_productos: productoId }, function(err, datos) {

            console.log("datos: ", datos)

            res.render("descripcion", {productos:datos})

        })
            

    },

    // - AQUI ES PARA VER LOS FAVORITOS DEL USAURIO 
    verFavoritos:function(req, res){
        const usuario = req.session.usuario;
        console.log("hola acabo de llegar xD favoritos: ", usuario  )

        const id = usuario[0]
        console.log("este es el id ", usuario.id_usuario)
        producto.verFav(con, usuario.id_usuario, function(err,datos){

            console.log(datos)
            res.render("favoritos", {productos:datos})

        })

        
        
    }, 

    // - AGREGAR FAVORITOS
    agregar_fav:function(req, res){

        res.render("descripcion")
    },


    // - VER CARRITO PARA CPNFIRMAR COMPRA
    ver_carrito:function(req, res){

        res.render("carrito")
    }
    

    
}