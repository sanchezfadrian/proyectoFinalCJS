let continuar = true

//Objeto que me permite guardar todos los datos necesarios para efectuar la reserva

const reserva = {
    idCabaña: null,
    fechaInicio: null,
    fechaFin: null,
    adultos: null,
    ninios: null
  }

//Clase que me permite crear objetos del tipo cabaña con la información de cada una de ellas

class Cabaña {
    constructor(nombre, cantidadAdultos, cantidadNinios, valorNoche) {
      this.nombre = nombre;
      this.cantidadAdultos = cantidadAdultos;
      this.cantidadNinios = cantidadNinios;
      this.valorNoche = valorNoche;
    }
  }

  // Cabañas creadas

  const cabaña1 = new Cabaña("Cabaña Estandar S (2 personas) ", 2, 0, 15000);
  const cabaña2 = new Cabaña("Cabaña Superior S (2 personas)", 2, 0, 20000);
  const cabaña3 = new Cabaña("Cabaña Estandar M (4 personas)", 2, 2, 30000);
  const cabaña4 = new Cabaña("Cabaña Superior M (4 personas)", 2, 2, 40000);
  const cabaña5 = new Cabaña("Cabaña Estandar L (8 personas)", 4, 4, 60000);
  const cabaña6 = new Cabaña("Cabaña Superior L (8 personas)", 4, 4, 80000);
  
// Array de cabañas compuesto por objetos del tipo cabaña

  const cabañas = [cabaña1, cabaña2, cabaña3, cabaña4];

// Menu del programa, me permite generar una reserva, ver la ultima reserva o terminar la ejecucion del programa

while(continuar){
    let opcion = prompt("Bienvenido al sistema de reserva de cabañas, \n 1- Generar reserva \n 2- Ver ultima reserva \n 3- Salir")
    switch(opcion){
        case "1":
            generarReserva()
            break
        case "2":
            ultimaReserva()
            break
        case "3":
            continuar = false
            break
    }
}

// En esta funcion se validan los datos que van dentro de la objeto reserva para que no haya inconsistencias

function generarReserva(){
    do{
        const fechaInicioString = prompt("Ingrese la fecha de inicio de su estadia (formato: yyyy-mm-dd)")
        reserva.fechaInicio = new Date(fechaInicioString)
    } while (!validarFecha(reserva.fechaInicio))

    do {
        const fechaFinString = prompt("Ingrese la fecha de finalización de su estadia (formato: yyyy-mm-dd)")
        reserva.fechaFin = new Date(fechaFinString)
    } while (!validarFecha(reserva.fechaFin))

    if (reserva.fechaInicio > reserva.fechaFin){
        alert("La fecha de inicio debe ser anterior a la fecha de finalización")
        generarReserva()
        return
    }

    do{
        reserva.adultos =  prompt("Ingrese la cantidad de adultos (1-5)")
        reserva.adultos = parseInt(reserva.adultos,10)
    }while(validarNumero(reserva.adultos,1,5)==false)
    
    do{
        reserva.ninios =  prompt("Ingrese la cantidad de niños (0-5)")
        reserva.ninios = parseInt(reserva.ninios,10)
    }while(validarNumero(reserva.ninios,0,5)==false)
    
    do{
        reserva.idCabaña = prompt("Seleccione la cabaña deseada (0-3) :\n" + cabañas.map(cabaña => cabaña.nombre).join("\n"));
        reserva.idCabaña = parseInt(reserva.idCabaña,10)
    }while(!validarNumero(reserva.idCabaña,0,3))

    if(validarCapacidad(reserva.idCabaña,reserva.adultos,reserva.ninios)){
        alert("Reserva efectuada exitosamente, muchas gracias")
    }
    else{
        alert("La reserva no pudo ser efectuada")
        generarReserva()
        return
    }
}

// Esta funcion nos muestra el ultimo registro de reserva

function ultimaReserva(){
    if(reserva.fechaInicio===null){
        alert("No hay ninguna reserva registrada aun")
    }
    else{
        alert("La ultima reserva generada contiene la siguiente información: \n Fecha Inicio: " + reserva.fechaInicio + "\n Fecha Fin: " + reserva.fechaFin + "\n Cantidad de noches: " + obtenerDiferenciaDias(reserva.fechaInicio,reserva.fechaFin) + "\n Cabaña: " + cabañas[reserva.idCabaña].nombre + "\n Adultos: " + reserva.adultos + "\n Niños: " + reserva.ninios + "\n Cantidad total de personas: " + sumar(reserva.adultos,reserva.ninios) + "\n Valor por noche: " + cabañas[reserva.idCabaña].valorNoche + "\n\n Valor total: " + multiplicar(obtenerDiferenciaDias(reserva.fechaInicio,reserva.fechaFin),cabañas[reserva.idCabaña].valorNoche))
    }
}

// Esta funcion valida si la capacidad de la cabaña seleccionada es apta para la cantidad de personas seleccionadas

function validarCapacidad(idCabaña,adultos,ninios){
    if(cabañas[idCabaña].cantidadAdultos >= adultos && cabañas[idCabaña].cantidadNinios >= ninios){
        return true
    }
    else{
        alert("Capacidad superada, seleccione una cabaña mas grande para el numero de personas o divida la reserva")
        return false
    }
}

// Esta funcion valida el formato de ingreso de fechas

function validarFecha(fecha){
    if (isNaN(fecha)) {
      alert("La fecha ingresada no es válida. Intente nuevamente.");
      return false;
    }
    return true;
}

// Esta funcion valida si el numero esta dentro de un minimo y un maximo

function validarNumero(numero,minimo,maximo){
    if(numero>=minimo && numero<= maximo ){
        return true
    }
    alert("Ingrese un valor numerico valido entre " + minimo + " - " + maximo)
    return false
}

// Esta funcion nos permite obtener el costo total de la estadia en base al precio y cantidad de noches

function multiplicar(num1,num2) {
    return num1 * num2
  }

// Esta funcion obtiene la diferencia de dias entre la fecha de inicio y la de fin

function obtenerDiferenciaDias(fechaInicio,fechaFin) {
    const diaMilisegundos = 24 * 60 * 60 * 1000;
    const diferenciaMilisegundos = fechaFin - fechaInicio;
    const cantidadDias = Math.floor(diferenciaMilisegundos / diaMilisegundos) + 1;
    return cantidadDias;
}

// Esta funcion nos permite realizar la suma de dos valores

function sumar(num1,num2)
{
    return num1 + num2
}