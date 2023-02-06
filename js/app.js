// Declaro nodos
const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('carrito-contenedor')
const botonVaciar = document.getElementById('vaciar-carrito')
const contadorCarrito = document.getElementById('contadorCarrito')
const cantidad = document.getElementById('cantidad')
const precioTotal = document.getElementById('precioTotal')
const cantidadTotal = document.getElementById('cantidadTotal')


//Declaro el "carrito" y el contador de los elementos agregados
let carrito = []
let contadorElementos = 0


//Cuando carga la pagina, levanto del Storage el carrito y el contador de elementos
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        contadorElementos = Number(localStorage.getItem('contadorElementos'))
        actualizarCarrito()                     //Cada vez que hay alguna modificacion, ejecutamos esta funcion que actualiza los datos en pantalla
    }
})


// Al apretar el boton para vaciar, me reinicia contador y carrito
botonVaciar.addEventListener('click', () => {

    
    contadorElementos = 0                       //Pongo en cero el contador general de elementos

    carrito.forEach((elem)=>{                   //Recorro el carrito y reinicio la cantidad de cada elemento (para la ventana modal)           
        elem.cantidad = 1 ;
    })
    carrito.length = 0
    window.location.reload               //Recargo la pagina, porque sino no se reinicia la cantidad de elementos

    localStorage.clear()
    actualizarCarrito()                  //Cada vez que hay alguna modificacion, ejecutamos esta funcion que actualiza los datos en pantalla
})


//Genero los divs levantando el stock mediante un forEach, y les asigno sus clases
stockProductos.forEach((producto) => {
    const div = document.createElement('div')
    if (producto.tipo === "ACTIVIDAD") {                //Con este if else, le doy clases distintas a los divs segun su tipo
        div.classList.add('producto-act')
    }
    else if (producto.tipo === "HFDE"){
        div.classList.add('producto-hfde')
    } else {
    div.classList.add('producto')
    }


    //A cada div le asigno sus h3 y sus p. Cada uno con sus clases e ID
    div.innerHTML = `               
    <h3>${producto.nombre}</h3>
    <p>${producto.desc}</p>
    <p class="precioProducto">Valor: ${producto.valor}</p>
    <button id="agregar${producto.id}" class="boton-agregar"> Agregar <i class="fas fa-wrench"></i></button>` 


//Le aviso al contenedor que generamos los divs (hijos)
    contenedorProductos.appendChild(div)                         


    //Le acabo de asignar un ID a cada btn de agregar, y ahora genero un solo nodo para despues
    // asignarle la misma funcion a todos esos btn
    const boton = document.getElementById(`agregar${producto.id}`)


    //Y ahora agarro ese nodo, y a cada btn de agregar, le digo que ejecute la funcion de agregar al carrito,
    // pero cada uno con su ID correspondiente, usando el paramentro 'producto.id'
    boton.addEventListener('click', () => {
        agregarAlCarrito(producto.id)
    })
})


//Funcion para agragar al carrito
const agregarAlCarrito = (prodId) => {              //Recibo como parametro el ID del elemento segun el click que hicieron

    //Genero 'existe' para ver si ya figura el elemento en la lista
    const existe = carrito.some (prod => prod.id === prodId) //Con 'some' me da TRUE si ya existe, lo corroboro con el ID del click


    //Con este IF, usando MAP, hago que si el producto figura, lo pushee pero no lo agregue nuevamente a la ventana modal, sino
    //que simplemente aumente su cantidad
    if (existe){ 
        const prod = carrito.map (prod => { 
            if (prod.id === prodId){
                prod.cantidad++                         //Incremento el contador especifico de ese elemento
                contadorElementos++                     //Incremento el contador de la totalidad de elementos
                CartelitoToastAgregado()                //Usando la libreria Tostify, cada vez que agregan algo pone un cartelito
            }
        })
    
    
    //Si no encuentra el producto, lo pushea, pero tambien lo agrega a la ventana modal
    } else {                
        const item = stockProductos.find((prod) => prod.id === prodId)
        carrito.push(item)
        contadorElementos++                     //Incremento el contador de la totalidad de elementos
        CartelitoToastAgregado()                //Usando la libreria Tostify, cada vez que agregan algo pone un cartelito
    }

    actualizarCarrito()                     //Cada vez que hay alguna modificacion, ejecutamos esta funcion que actualiza los datos en pantalla
}


//Funcion para eliminar un producto del carrito
const eliminarDelCarrito = (prodId) => {                        //Recibo el ID que me da el usuario con el click
    const item = carrito.find((prod) => prod.id === prodId)                     //Guardo en 'item' el objeto que quiere borrar
    const indice = carrito.indexOf(item)                        //Con idexOf consigo la posicion del objeto
    contadorElementos = contadorElementos - item.cantidad;                      //Resto del contador general, la cantidad de elementos eliminados
    item.cantidad = 1                       //Reinicio el contador del elemento en particular, el que se muestra en la ventana modal
    carrito.splice(indice, 1)                       //Con splice me paro en el indice, y borro ese objeto (y si habian varios iguales, se van tambien)

    actualizarCarrito()                     //Cada vez que hay alguna modificacion, ejecutamos esta funcion que actualiza los datos en pantalla
}


//Funcion para actualizar todo, cada vez que se modifica algo
const actualizarCarrito = () => {

    contenedorCarrito.innerHTML = ""                        //Elimino todo lo que se estaba viendo por pantalla
    //3 - TERCER PASO. AGREGAR AL MODAL. Recorremos sobre el array de carrito.

    //Por cada producto creamos un div con esta estructura y le hacemos un append al contenedorCarrito (el modal)
    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Valor: ${prod.valor}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `

        contenedorCarrito.appendChild(div)
        
        localStorage.setItem('contadorElementos', Number(contadorElementos))
        localStorage.setItem('carrito', JSON.stringify(carrito))

    })
    //SEPTIMO PASO
    contadorCarrito.innerText = Number(contadorElementos) // actualizamos con la longitud del carrito.
    //OCTAVO PASO
    precioTotal.innerText =  (carrito.reduce((acc, prod) => acc + prod.cantidad * prod.valor, 0)).toFixed(2)
    //Por cada producto q recorro en mi carrito, al acumulador le suma la propiedad precio, con el acumulador
    //empezando en 0.

}

let opciones = document.getElementById("filtroTipo")
let vaciarContenedorProductos = document.getElementById("contenedor-productos")


const filtrarDivs = () => {
    while (vaciarContenedorProductos.firstChild) {
        vaciarContenedorProductos.removeChild(vaciarContenedorProductos.firstChild);
    }

    let respuestaFiltro = document.getElementById("filtroTipo").value;
    const divsFiltrados =  stockProductos.filter((element)=>element.tipo === respuestaFiltro);

switch (respuestaFiltro) {
    case "TODO":
        stockProductos.forEach((producto) => {
            const div = document.createElement('div')
            if (producto.tipo === "ACTIVIDAD") {
                div.classList.add('producto-act')
            }
            else if (producto.tipo === "HFDE"){
                div.classList.add('producto-hfde')
            } else {
            div.classList.add('producto')
            }
            div.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>${producto.desc}</p>
            <p class="precioProducto">Valor: ${producto.valor}</p>
            <button id="agregar${producto.id}" class="boton-agregar"> Agregar <i class="fas fa-wrench"></i></button>
            ` 
            contenedorProductos.appendChild(div)
        
            //2 - SEGUNDO PASO, LUEGO DE QUE INSERTEMOS EL HTML EN EL DOM:
            const boton = document.getElementById(`agregar${producto.id}`)
            //Por cada elemento de mi array, creo un div, lo cuelgo, le pongo un id particular, una vez colgado
            //le hago un get element by id (el de agregar) Obtengo el elemento y a dicho elemento le agregamos
            //el add event listener
        
            boton.addEventListener('click', () => {
                //esta funcion ejecuta el agregar el carrito con la id del producto
                agregarAlCarrito(producto.id)
                //
            })
        })
        break;
    case respuestaFiltro:
        divsFiltrados.forEach((producto) => {
            const div = document.createElement('div')
            if (producto.tipo === "ACTIVIDAD") {
                div.classList.add('producto-act')
            }
            else if (producto.tipo === "HFDE"){
                div.classList.add('producto-hfde')
            } else {
            div.classList.add('producto')
            }
            div.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>${producto.desc}</p>
            <p class="precioProducto">Valor: ${producto.valor}</p>
            <button id="agregar${producto.id}" class="boton-agregar"> Agregar <i class="fas fa-wrench"></i></button>
            ` 
            contenedorProductos.appendChild(div)
        
            //2 - SEGUNDO PASO, LUEGO DE QUE INSERTEMOS EL HTML EN EL DOM:
            const boton = document.getElementById(`agregar${producto.id}`)
            //Por cada elemento de mi array, creo un div, lo cuelgo, le pongo un id particular, una vez colgado
            //le hago un get element by id (el de agregar) Obtengo el elemento y a dicho elemento le agregamos
            //el add event listener
        
            boton.addEventListener('click', () => {
                //esta funcion ejecuta el agregar el carrito con la id del producto
                agregarAlCarrito(producto.id)
                //
            })
        })
        break;
}

}

opciones.addEventListener("change",filtrarDivs)


function CartelitoToastAgregado () {
    Toastify({
        text: "Agregado",
        duration: 2000,
        gravity: "top",
        position: "left",
        style:{
            fontSize:"5vw",
            background: "rgb(67, 77, 114,0.9)",
            color:"white",
            width:"30%",
            heigth:"auto"
        }
    }).showToast()
}

function CartelitoToastCarritoVaciado () {
    Toastify({
        text: "Eliminaste todo",
        duration: 3000,
        gravity: "top",
        position: "left",
        style:{
            fontSize:"5vw",
            background: "rgb(67, 77, 114,0.9)",
            color:"white",
            width:"30%",
            heigth:"auto"
        }
    }).showToast()
}