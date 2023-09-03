const valorDesayuno = 2
const valorCochera = 5

const reservas = []

const datosReserva = {
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

class Cabaña {
    constructor(nombre, cantidadAdultos, cantidadMenores, valorNoche){
        this.nombre = nombre
        this.cantidadAdultos = cantidadAdultos
        this.cantidadMenores = cantidadMenores
        this.valorNoche = valorNoche
    }
}

const cabaña1 = new Cabaña("Cabaña Estandar S (2 personas)", 2, 0, 75)
const cabaña2 = new Cabaña("Cabaña Superior S (2 personas)", 2, 0, 150)
const cabaña3 = new Cabaña("Cabaña Estandar M (4 personas)", 2, 2, 100)
const cabaña4 = new Cabaña("Cabaña Superior M (6 personas)", 2, 4, 200)
  
const cabañas = [cabaña1, cabaña2, cabaña3, cabaña4]

const fechaInicio = document.getElementById("fechaInicio")
const fechaFin = document.getElementById("fechaFin")
const cantidadAdultos = document.getElementById("cantidadAdultos")
const cantidadMenores = document.getElementById("cantidadMenores")
const desayuno = document.getElementById("desayuno")
const cochera = document.getElementById("cochera")
const nombre = document.getElementById("nombre")
const email = document.getElementById("email")
const valor = document.getElementById("valor")

const btnBorrar = document.getElementById("btnBorrar")
const btnRecuperar = document.getElementById("btnRecuperar")
const btnReserva = document.getElementById("btnReserva")
const btnVerificar = document.getElementById("btnVerificar")
const formulario = document.getElementById("formulario")

const botonesCabaña = document.querySelectorAll('.btnCabaña')
const tarjetasCabaña = document.querySelectorAll('.tarjetaCabaña')

btnReserva.addEventListener("click",crearReserva)
btnBorrar.addEventListener("click",borrarDatos)
btnRecuperar.addEventListener("click",recuperarDatos)

setTimeout(()=> {
    Swal.fire({
        title: "Disfruta de nuestros servicios",
        html: "<br>Sala de masajes con un amplio menú de masajes y terapias naturales.",
        imageUrl: "img/servicios.jpg",
        imageHeight: 200,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3500
    })
   }, 2000)

function seleccionCabaña(numeroTarjeta) {
    datosReserva.idCabaña = numeroTarjeta
    tarjetasCabaña.forEach((tarjeta, index) => {
        tarjeta.classList.remove('seleccionado')
        if (index === numeroTarjeta) {
            tarjeta.classList.add('seleccionado')
        }
    })
}

botonesCabaña.forEach((button, index) => {
    button.addEventListener('click', () => {
        seleccionCabaña(index)
    })
})

async function crearReserva(e) {
    e.preventDefault()
    if (validarDatos()) {
        cargarDatos()
        const esValida = await validarReserva()
        if (esValida) {
            guardarStorage(datosReserva)
            reservas.push(datosReserva)
            console.log(reservas)
            mensajeAlerta("Reserva efectuada exitosamente", "success")
            borrarDatos()
        }
    }
}

btnVerificar.addEventListener('click', function() {
    Swal.fire({
        title: 'Reserva',
        input: 'text',
        inputLabel: 'Valor:',
        inputPlaceholder: 'Ingrese el codigo de reserva proporcionado',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'Debe ingresar un valor'
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const idBuscado = result.value
            const indice = reservas.findIndex(obj => obj.idReserva === idBuscado)

            if (indice !== -1) {
                Swal.fire({
                    title: 'Valor encontrado',
                    html: `<h2># ${reservas[indice].idReserva}</h2><br><b>Ingreso:</b> ${reservas[indice].fechaInicio} - <b>Egreso:</b> ${reservas[indice].fechaFin}<br><b>Cantidad de dias</b> ${reservas[indice].cantidadDias} - <b>Adultos:</b> ${reservas[indice].cantidadAdultos} - <b>Menores:</b> ${reservas[indice].cantidadMenores}<br><b>Cochera:</b> ${reservas[indice].cochera} - <b>Desayuno:</b> ${reservas[indice].desayuno}<br><b>Nombre:</b> ${reservas[indice].nombre} - <b>Correo:</b> ${reservas[indice].email}<br><br><h3>Valor total: US$ ${reservas[indice].valorTotal}`,
                    icon: 'success'
                })
            } else {
                Swal.fire({
                    title: 'Valor no encontrado',
                    text: `El valor "${idBuscado}" no se encuentra, contactenos para verificar el problema.`,
                    icon: 'error'
                })
            }
        }
    })
})

function validarDatos(){
    if (!validarCabaña()) return false
    if (!validarFechas(fechaInicio,fechaFin)) return false
    if (!validarNumero(cantidadAdultos,cabañas[datosReserva.idCabaña].cantidadAdultos)) return false
    if (!validarNumero(cantidadMenores,cabañas[datosReserva.idCabaña].cantidadMenores)) return false
    if (!validarSeleccion(desayuno)) return false
    if (!validarSeleccion(cochera)) return false
    if (!validarTexto(nombre)) return false
    if (!validarTexto(email)) return false
    return true
}

function cargarDatos(){
    datosReserva.idReserva = generarIdReserva()
    datosReserva.fechaInicio = fechaInicio.value
    datosReserva.fechaFin = fechaFin.value
    datosReserva.cantidadAdultos = parseInt(cantidadAdultos.value)
    datosReserva.cantidadMenores = parseInt(cantidadMenores.value)
    datosReserva.desayuno = desayuno.value
    datosReserva.cochera = cochera.value
    datosReserva.nombre = nombre.value
    datosReserva.email = email.value
    datosReserva.cantidadDias = obtenerIntervalo(new Date(fechaInicio.value),new Date(fechaFin.value))
    datosReserva.valorTotal =  obtenerValorTotal()
}

function borrarDatos(e){
    formulario.reset()
    seleccionCabaña(-1)
}

function validarCabaña(){
    if(datosReserva.idCabaña !== null) return true
    mensajeAlerta('Debe seleccionar una cabaña para continuar','error')
    return false
}

function validarFechas(fechaInicio, fechaFin){
    const fechaInicioValue = Date.parse(fechaInicio.value)
    const fechaFinValue = Date.parse(fechaFin.value)
    const fechaActual = new Date()
    if (!fechaInicioValue) {
        fechaInicio.focus()
        mensajeAlerta('Debe seleccionar una fecha de Chek-In válida', 'error')
        return false
    }
    if (fechaInicioValue <= fechaActual) {
        fechaInicio.focus()
        mensajeAlerta('Debe seleccionar una fecha Chek-In mayor a la fecha actual', 'error')
        return false
    }
    if (!fechaFinValue) {
        fechaFin.focus()
        mensajeAlerta('Debe seleccionar una fecha de Chek-Out válida', 'error')
        return false
    }
    if (fechaFinValue <= fechaInicioValue) {
        fechaFin.focus()
        mensajeAlerta('Debe seleccionar una fecha de Check-out mayor a la fecha de inicio', 'error')
        return false
    }
    return true
}

function validarNumero(numero,maximo) {
    let cantidad = parseInt(numero.value)
    if(cantidad<= maximo) return true
    numero.focus()
    mensajeAlerta('Maximo de ocupantes para esta cabaña superado, seleccione otra cabaña','error')
    return false
}

function validarTexto(texto) {
    if ((texto.value).trim() !== "") return true
    texto.focus()
    mensajeAlerta('Por favor ingrese un valor valido para este campo','error')
    return false
}

function validarSeleccion(seleccion) {
    if(seleccion.value !== "") return true
    seleccion.focus()
    mensajeAlerta('Por favor seleccione un valor valido para este campo','error')
    return false
}

async function validarReserva() {
    try {
        const valorDolar = await obtenerValorDolar()
        const result = await Swal.fire({
            title: 'Validacion de datos',
            html: `<h2># ${datosReserva.idReserva}</h2><br><b>Ingreso:</b> ${datosReserva.fechaInicio} - <b>Egreso:</b> ${datosReserva.fechaFin}<br><b>Cantidad de dias</b> ${datosReserva.cantidadDias} - <b>Adultos:</b> ${datosReserva.cantidadAdultos} - <b>Menores:</b> ${datosReserva.cantidadMenores}<br><b>Cochera:</b> ${datosReserva.cochera} - <b>Desayuno:</b> ${datosReserva.desayuno}<br><b>Nombre:</b> ${datosReserva.nombre} - <b>Correo:</b> ${datosReserva.email}<br><br><h3>Valor total: US$ ${datosReserva.valorTotal}</h3><h5>Valor total: $ ${datosReserva.valorTotal * valorDolar}</h5><br><i>La información para realizar la transferencia será enviada al correo indicado</i>`,
            icon: 'info',
            showDenyButton: true,
            confirmButtonText: 'Confirmar reserva',
            denyButtonText: `Cancelar`,
        })
        
        if (result.isConfirmed) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error("Ocurrió un error:", error)
        return false
    }
}

function obtenerIntervalo(fechaInicio,fechaFin) {
    const diaMilisegundos = 24 * 60 * 60 * 1000
    const diferenciaMilisegundos = fechaFin - fechaInicio
    const cantidadDias = Math.floor(diferenciaMilisegundos / diaMilisegundos)
    return cantidadDias
}

function obtenerValorTotal() {
    const totalCochera = 0
    const totalDesayuno = 0
    const cantidadDias = datosReserva.cantidadDias
    const desayuno = datosReserva.desayuno
    const cochera = datosReserva.cochera
    const valorNoche = cabañas[datosReserva.idCabaña].valorNoche
    const cantidadPersonas = datosReserva.cantidadAdultos + datosReserva.cantidadMenores

    if(desayuno === "SI") totalDesayuno = valorDesayuno * cantidadDias * cantidadPersonas
    if(cochera === "SI") totalCochera = valorCochera * cantidadDias
    return (valorNoche * cantidadDias + totalDesayuno + totalCochera)
}

function generarIdReserva() {
    return "RES" + Math.floor(Math.random() * (9999 - 1000)) + 1000
}

function guardarStorage(datosReserva){
    const reservaJson = JSON.stringify(datosReserva)
    localStorage.setItem("datosReserva",reservaJson)
}

function recuperarDatos(e) {
    const reservaJson = localStorage.getItem("datosReserva")
    const reservaParseada = JSON.parse(reservaJson)
    fechaInicio.value = reservaParseada.fechaInicio
    fechaFin.value = reservaParseada.fechaFin
    cantidadAdultos.value = reservaParseada.cantidadAdultos
    cantidadMenores.value = reservaParseada.cantidadMenores
    desayuno.value = reservaParseada.desayuno
    cochera.value = reservaParseada.cochera
    nombre.value = reservaParseada.nombre
    email.value = reservaParseada.email
    seleccionCabaña(parseInt(reservaParseada.idCabaña))
}

function mensajeAlerta(mensaje,icono) {
    Swal.fire({
        text: mensaje,
        icon: icono,
        confirmButtonText: 'OK'
    })
}

function obtenerValorDolar() {
    return fetch("https://api.bluelytics.com.ar/v2/latest")
        .then(response => response.json())
        .then(data => {
            const resultado = data.oficial
            const valorCompra = resultado.value_buy
            return valorCompra
        })
        .catch(error => {
            console.error("Ocurrió un error:", error)
            throw error
        })
}