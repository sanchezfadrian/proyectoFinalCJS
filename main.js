//Array para ir guardando las reservas
const reservas = []

//Objeto que me permite guardar todos los datos necesarios para efectuar la reserva
const reserva = {
    idReserva: null,
    idCabaña: null,
    fechaInicio: null,
    fechaFin: null,
    cantidadAdultos: null,
    cantidadMenores: null,
    desayuno: null,
    cochera: null,
    nombre: null,
    email: null,
    cantidadDias: null,
    valorTotal: null
}

//Clase que me permite crear objetos del tipo cabaña con la información de cada una de ellas
class Cabaña {
    constructor(nombre, cantidadAdultos, cantidadMenores, valorNoche) {
        this.nombre = nombre
        this.cantidadAdultos = cantidadAdultos
        this.cantidadMenores = cantidadMenores
        this.valorNoche = valorNoche
    }
}

// Cabañas creadas
const cabaña1 = new Cabaña("Cabaña Estandar S (2 personas)", 2, 0, 15000)
const cabaña2 = new Cabaña("Cabaña Superior S (2 personas)", 2, 0, 20000)
const cabaña3 = new Cabaña("Cabaña Estandar M (4 personas)", 2, 2, 25000)
const cabaña4 = new Cabaña("Cabaña Superior M (6 personas)", 2, 4, 30000)
  
// Array de cabañas compuesto por objetos del tipo cabaña
const cabañas = [cabaña1, cabaña2, cabaña3, cabaña4]

//Obtencion DOM
const fechaInicio = document.getElementById("fechaInicio")
const fechaFin = document.getElementById("fechaFin")
const cantidadAdultos = document.getElementById("cantidadAdultos")
const cantidadMenores = document.getElementById("cantidadMenores")
const desayuno = document.getElementById("desayuno")
const cochera = document.getElementById("cochera")
const nombre = document.getElementById("nombre")
const email = document.getElementById("email")

const cardCabaña1 = document.getElementById("cardCabaña1")
const cardCabaña2 = document.getElementById("cardCabaña2")
const cardCabaña3 = document.getElementById("cardCabaña3")
const cardCabaña4 = document.getElementById("cardCabaña4")

const btnCabaña1 = document.getElementById("btnCabaña1")
const btnCabaña2 = document.getElementById("btnCabaña2")
const btnCabaña3 = document.getElementById("btnCabaña3")
const btnCabaña4 = document.getElementById("btnCabaña4")
const btnReserva = document.getElementById("btnReserva")
const btnRecuperar = document.getElementById("btnRecuperar")
const btnBorrar = document.getElementById("btnBorrar")

btnReserva.addEventListener("click",crearReserva)
btnRecuperar.addEventListener("click",recuperarReserva)
btnBorrar.addEventListener("click",borrarReserva)

btnCabaña1.onclick = () => seleccionCabaña(0)
btnCabaña2.onclick = () => seleccionCabaña(1)
btnCabaña3.onclick = () => seleccionCabaña(2)
btnCabaña4.onclick = () => seleccionCabaña(3)

// En esta funcion se validan los datos que van dentro del objeto reserva para que no haya inconsistencias
function crearReserva(e){
    e.preventDefault()
    if (!validarCabaña()) return false
    if (!validarFecha(fechaInicio)) return false
    if (!validarFecha(fechaFin)) return false
    if (!validarNumero(cantidadAdultos,1,cabañas[reserva.idCabaña].cantidadAdultos)) return false
    if (!validarNumero(cantidadMenores,0,cabañas[reserva.idCabaña].cantidadMenores)) return false
    if (!validarTexto(nombre)) return false
    if (!validarTexto(email)) return false
    reserva.idReserva = generarIdReserva()
    reserva.fechaInicio = fechaInicio.value
    reserva.fechaFin = fechaFin.value
    reserva.cantidadAdultos = cantidadAdultos.value
    reserva.cantidadMenores = cantidadMenores.value
    reserva.desayuno = desayuno.value
    reserva.cochera = cochera.value
    reserva.nombre = nombre.value
    reserva.email = email.value
    reserva.cantidadDias = obtenerDiferenciaDias(new Date(fechaInicio.value),new Date(fechaFin.value))
    reserva.valorTotal =  ObtenerValorTotal(reserva.cantidadDias,cabañas[reserva.idCabaña].valorNoche,0,0)
    guardarStorage(reserva) //guardo en el storage por si se produce un error de conexion con el servidor al momento de ejecutar la reserva
    reservas.push(reserva)
    alert(`La reserva Nº ${reserva.idReserva} se ha ejecutado con exito, Su estadia comienza ${reserva.fechaInicio} y finaliza el ${reserva.fechaFin} con un total de ${reserva.cantidadDias} noche/s. El total a abonar es de $ ${reserva.valorTotal}, los datos de la transferencia seran enviados al correo ${reserva.email}. Muchas gracias`)
    borrarReserva()
}

function borrarReserva(e){
    cardCabaña0.classList.remove("unSelect")
    cardCabaña1.classList.remove("unSelect")
    cardCabaña2.classList.remove("unSelect")
    cardCabaña3.classList.remove("unSelect")
    reserva.idCabaña = null
}

// Validamos si se ha seleccionado una cabaña
function validarCabaña(){
    if(reserva.idCabaña !== null) return true
    alert(`Debe seleccionar una cabaña para continuar`)
    return false
}

// Validamos el formato de fecha correcto
function validarFecha(fecha){
    if (!isNaN(Date.parse(fecha.value))) return true
    fecha.focus()
    alert(`La fecha ingresada no es válida. Intente nuevamente`)
    return false
}

// Validamos que el formato sea numerico y que este entre un maximo y un minimo
function validarNumero(numero,minimo,maximo){
    let cantidad = parseInt(numero.value)
    if(cantidad>=minimo && cantidad<= maximo) return true
    numero.focus()
    alert(`Ingrese un valor numerico valido entre ${minimo} y ${maximo}`)
    return false
}

// Validamos si existe un valor distinto de vacio
function validarTexto(texto){
    if ((texto.value).trim() !== "") return true
        texto.focus()
        alert("Por favor ingrese un valor valido para este campo")
        return false
}

//Obtenemos la diferencia de dias entre el inicio y fin
function obtenerDiferenciaDias(fechaInicio,fechaFin) {
    const diaMilisegundos = 24 * 60 * 60 * 1000
    const diferenciaMilisegundos = fechaFin - fechaInicio
    const cantidadDias = Math.floor(diferenciaMilisegundos / diaMilisegundos)
    return cantidadDias
}

//Obtenemos el valor total (el desayuno y la cochera lo dejamos con un valor fijo en esta entrega)
function ObtenerValorTotal(dias, valor, desayuno, cochera){
    return dias * (valor + desayuno + cochera)
}


function generarIdReserva(){
    return Math.floor(Math.random() * (9999 - 1000)) + 1000
}

function guardarStorage(reserva){
    const reservaJson = JSON.stringify(reserva)
    localStorage.setItem("reserva",reservaJson)
}

function recuperarReserva(e){
    e.preventDefault()
    const reservaJson = localStorage.getItem("reserva")
    const reservaParseada = JSON.parse(reservaJson)
    fechaInicio.value = reservaParseada.fechaInicio
    fechaFin.value = reservaParseada.fechaFin
    cantidadAdultos.value = reservaParseada.cantidadAdultos
    cantidadMenores.value = reservaParseada.cantidadMenores
    cochera.value = reservaParseada.cochera
    nombre.value = reservaParseada.nombre
    email.value = reservaParseada.email
    seleccionCabaña(parseInt(reservaParseada.idCabaña))
}

function seleccionCabaña(idCabaña){
    reserva.idCabaña = idCabaña
    cardCabaña0.classList.remove("unSelect")
    cardCabaña1.classList.remove("unSelect")
    cardCabaña2.classList.remove("unSelect")
    cardCabaña3.classList.remove("unSelect")
    switch (idCabaña) {
        case 0:
            cardCabaña1.classList.add("unSelect")
            cardCabaña2.classList.add("unSelect")
            cardCabaña3.classList.add("unSelect")
            break
        case 1:
            cardCabaña0.classList.add("unSelect")
            cardCabaña2.classList.add("unSelect")
            cardCabaña3.classList.add("unSelect")
            break
        case 2:
            cardCabaña0.classList.add("unSelect")
            cardCabaña1.classList.add("unSelect")
            cardCabaña3.classList.add("unSelect")
            break
        case 3:
            cardCabaña0.classList.add("unSelect")
            cardCabaña1.classList.add("unSelect")
            cardCabaña2.classList.add("unSelect")
            break
      }
}