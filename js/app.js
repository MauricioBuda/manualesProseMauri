// Declaro nodos
const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('carrito-contenedor')
const botonVaciar = document.getElementById('vaciar-carrito')
const contadorCarrito = document.getElementById('contadorCarrito')
const cantidad = document.getElementById('cantidad')
const precioTotal = document.getElementById('precioTotal')
const cantidadTotal = document.getElementById('cantidadTotal')
const manito = document.getElementById('manito')
const pTotal = document.getElementById('pTotal')
const opciones = document.getElementById("filtroTipo")
const vaciarContenedorProductosParaFiltrar = document.getElementById("contenedor-productos")


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
    //window.location.reload()             //Recargo la pagina, porque sino no se reinicia la cantidad de elementos
    CartelitoToastCarritoVaciado ()             // Cartelito de que vaciaste el carrito
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

    //Elimino todo lo que se estaba viendo por pantalla
    contenedorCarrito.innerHTML = ""                        


    //Vuelvo a generar divs con un forEach, pero esta vez le asigno clases distintas. Es para generar la ventana modal
    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Valor: ${prod.valor}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `

        //Le aviso al contenedor que generé los divs
        contenedorCarrito.appendChild(div)                          
        

        //Es estas dos lineas, guardo el carrito y contador en Storage
        localStorage.setItem('contadorElementos', Number(contadorElementos))
        localStorage.setItem('carrito', JSON.stringify(carrito))                   
    })


    //Actualizo la cantidad de elementos. Es informacion que levanto del Storage (En las primeras lineas)
    contadorCarrito.innerText = Number(contadorElementos)


    //Calculo el total de la suma de los elementos. Lo guardo en esa variable para despues usarla para poner la manito
    const paraPonerManito = precioTotal.innerText =  (carrito.reduce((acc, prod) => acc + prod.cantidad * prod.valor, 0)).toFixed(2)


    //Con este if, dependiendo el puntaje total, le pongo manito de "bien" o de "mal". Es un proyecto para poder usar en mi trabajo, y
    //nos exigen puntos por dia, por eso tomo esos valores. Las manitos son iconos de BS
if (paraPonerManito >= 9) {
    manito.innerHTML = `<span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
  </svg> </span>`
  pTotal.appendChild(manito)
} else if (paraPonerManito < 9 || paraPonerManito === 0 || paraPonerManito === null){
    manito.innerHTML = `<span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
    <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
  </svg> </span>`
  pTotal.appendChild(manito)
} 
}




//Funcion para el filtro (change)
const filtrarDivs = () => {

    //Primero borro todo lo del contenedor, para que no se concatene con lo que voy a filtrar
    while (vaciarContenedorProductosParaFiltrar.firstChild) {
        vaciarContenedorProductosParaFiltrar.removeChild(vaciarContenedorProductosParaFiltrar.firstChild);
    }


    //En respuestaFiltro guardo lo que eligió el usuario, usando "value"
    let respuestaFiltro = document.getElementById("filtroTipo").value;


    //En divsFiltrados genero un array nuevo, usando filter, en el que uso la respuesta del usuario para saber que elementos hay que 
    //incluir en el array nuevo
    const divsFiltrados =  stockProductos.filter((element)=>element.tipo === respuestaFiltro);


    //Dependiendo lo que haya elegido el usuario, imprimo en pantalla las cards. Si puso todo, imprimo igual que al principio, pero si
    // eligió algun filtro, va al case 2, en el que solo imprime lo filtrado.
    //(Lo que se hace en los 'case' no lo explico porque es lo mismo que antes, cuando imprimimos por primera vez todo en el DOM)
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
            const boton = document.getElementById(`agregar${producto.id}`)
            boton.addEventListener('click', () => {
                agregarAlCarrito(producto.id)
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
            const boton = document.getElementById(`agregar${producto.id}`)
            boton.addEventListener('click', () => {
                agregarAlCarrito(producto.id)
            })
        })
        break;
}

}


//Le asigno el evento y la funcion a ejecutar, al boton del <select>
opciones.addEventListener("change",filtrarDivs)



//Funcion de la libreria Tostify para mostrar el cartelito cada vez que se agrega un elemento
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


//Funcion de la libreria Tostify para mostrar el cartelito cada vez que se vacia el "carrito"
function CartelitoToastCarritoVaciado () {
    Toastify({
        text: "Eliminaste todo",
        duration: 2000,
        gravity: "top",
        position: "left",
        style:{
            display: "flex",
            textAlign: "center",
            fontSize:"5vw",
            background: "rgb(255, 0, 0, 0.8)",
            color:"white",
            width:"auto",
            heigth:"auto"
        }
    }).showToast()
}

function CartelitoToastMontaje () {
    Toastify({
        text: "Pasaste los 15 puntos, ganaste ",
        duration: 2000,
        gravity: "top",
        position: "left",
        style:{
            display: "flex",
            textAlign: "center",
            fontSize:"5vw",
            background: "rgb(255, 0, 0, 0.8)",
            color:"white",
            width:"auto",
            heigth:"auto"
        }
    }).showToast()
}

