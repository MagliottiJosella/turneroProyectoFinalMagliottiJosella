
// variables globales

let monthNames=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
let diaSeleccionado
let dia
let horario
let nombre
let turnos=[]
let turnosConfirmado=""
let reservas=[]
let yaHabiaReservado=false


// fecha actual con uso de DATE
let currentDate= new Date()
let currentDay=currentDate.getDate() // da el dia actual
let monthNumber=currentDate.getMonth() // da un numero: siendo 0 enero y 11 diciembre !! IMPORTANTE.
let currentYear=currentDate.getFullYear() // nos da el año actual


// variables  DOM
let dates=document.getElementById("dates")
let month=document.getElementById("month")
let year=document.getElementById("year")
let prevMonthDOM=document.getElementById("prevMonth") // flecha mes anterior
let nextMonthDOM=document.getElementById("nextMonth") // flecha mes posterior



// PARTE 1: ARMADO DEL CALENDARIO.

// mes y año actual , presentados en el "titulo" del calendario
month.textContent=monthNames[monthNumber]
year.textContent=currentYear.toString()   // currenteYear es un numero, y lo paso a string para evitar posibles errores 

// EVENTO SOBRE LAS FLECHAS DE CAMBIO DE MES
prevMonthDOM.addEventListener("click",()=>lastMonth())
nextMonthDOM.addEventListener("click",()=>nextMonth())

// EVENTO PARA LEER EL CLICK EN LA ELECCION DEL DIA
dates.addEventListener("click",(e)=>{   
    diaSeleccionado=e.target // me da el nodo. No me da un valor
    controlDia()
 })  

// FUNCION PARA SOLO DEJAR SELECCIONAR UN DIA
function controlDia() {
  const seleccionadoAnterior = document.querySelector(".diaseleccionado");
  if (seleccionadoAnterior) {
    //remuevo la clase si es que existe
    seleccionadoAnterior.className = "";
  }
  dia = diaSeleccionado.innerHTML.toString().trim(); // es un string!!
  const nuevaFecha = new Date(`${currentYear}-${monthNumber + 1}-${dia}`);
  if (nuevaFecha - new Date() > 0) {
    // si no existe entonces le doy la clase diaseleccionado
    diaSeleccionado.className = "diaseleccionado";
    //valor a la variable global
    alert(
      "el dia elegido es :" + dia + "/" + (monthNumber + 1) + "/" + currentYear
    );
  } else {
    alert("fecha invalida");
  }
}

// FUNCIONES PARA EL ARMADOS DEL CALENDARIO
// para escribir el mes
writeMonth(monthNumber)
function writeMonth(month){

    for (let i = startDay(); i> 0; i--) {
        dates.innerHTML += ` <div class="calendarDay calendarItem calendarLast "> ${getTotalDays(monthNumber-1)-(i-1)}</div>`            
     }
    for (let i = 1; i <= getTotalDays(month); i++) {
        if (i=== currentDay) {
            dates.innerHTML += ` <div class="calendarDay calendarItem calendarToday"> ${i} </div>`     

        } else{
            dates.innerHTML += ` <div class="calendarDay calendarItem"> ${i} </div>`     
        }      
    }  
}

// para calcular el numero total de dias del mes
function getTotalDays(month){
  if(month === -1){ month=11}
  if( (month === 0) ||(month ===2)  || (month ===4) || (month === 6) || (month === 7) || (month === 9) || (month === 11)){
    return 31
  }
  else if( (month === 3) ||(month === 5) || (month === 8)|| (month === 10)){
    return 30
  } else{
     return isLeap() ? 29:28 ;
  }    
}

// para calcular si es año bisiesto o no. Devuelve un Booleano ( true or false)
function isLeap(){
  return  ((currentYear % 100 !== 0) && (currentYear % 4 === 0)|| (currentYear % 400 === 0)) 
}

// para calcular donde colocar el primer dia del mes
function startDay(){
     let start=new Date(currentYear,monthNumber,1)
     return ((start.getDay()-1 === -1)) ? 6 : start.getDay()-1

}

// escribe el mes anterior
function lastMonth(){
    if(monthNumber !==0){
        monthNumber -- 
    }
    else{
        monthNumber=11
        currentYear --
    }
    setnewDate()
}

// escribe el mes posterior
function nextMonth(){    
    if(monthNumber !== 11){
    monthNumber ++ 
    }
    else{
    monthNumber=0
    currentYear ++
   }
setnewDate()   
}

function setnewDate(){
    currentDate.setFullYear(currentYear,monthNumber,currentDay)
    month.textContent = monthNames[monthNumber]
    year.textContent=currentYear.toString()
    dates.textContent=""
    writeMonth(monthNumber)
}


// PARTE 2 : LECTURA DEL HORARIO ELEGIDO.

hours.addEventListener("change",() => {
    horario=hours.value
    horario.className="horarioSeleccionado"
    alert("el horario seleccionado es " + horario + "hs")

  })


// PARTE 3 : LECTURA DATOS DEL USUARIO

const botonreserva=document.getElementById("reservar")

botonreserva.addEventListener("click", (e) => {
      e.preventDefault()

      nombre=(document.getElementById("nombreCliente").value).toLowerCase()  

      obtenerDatos()

      const turnosLS = localStorage.getItem("turnos") || [];
      turnos = JSON.parse(turnosLS)    

      if (turnos.some((turnos) => nombre.toLowerCase() === turnos.clienteNombre.toLowerCase())) {
        yaHabiaReservado = true
      }  

      if (!yaHabiaReservado) {
        //objeto Turno con todos los datos obtenidos previamente
        turnos.push({
          clienteNombre: nombre,
          horaTurno: horario,
          diaTurno: dia,
          mesTurno: monthNumber + 1,
          anioTurno: currentYear
        });
        localStorage.setItem("turnos", JSON.stringify(turnos)); // GUARDADO LOCAL DE LOS DATOS DE RESERVA
  
     }
     limpiarForm()} // limpiado del formulario
 )

 


  
// Funciones del formulario   

async function obtenerDatos(){

  const response = await  fetch('https://jsonplaceholder.typicode.com/users')
  const clientes = await response.json()

  yaTieneReserva(clientes, nombre)
  }

    

function yaTieneReserva(clientes, nombre) {
    const existeNombre = clientes.some((elemento) => elemento.name.toLowerCase() === nombre)  
    if (!existeNombre && nombre.trim()!=="" && (!yaHabiaReservado)){
     { Swal.fire({
        title: "TURNO RESERVADO",
        text: (" Gracias " + nombre + " la fecha reservada es :" + dia+ "/"+ (monthNumber+1)+"/"+(currentYear)+ " en el horario(hs) "+horario),
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'confirmar'
        }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Reservado',
            'Cualquier consulta estamos a disposicion',
            'success'
          )
        }
        })
      }}
      else if(((existeNombre)||(yaHabiaReservado))&&(nombre.trim() !== "")){

        Swal.fire({
          title: 'ya tienes un turno reservado. Deseas cambiarlo?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Si',
          denyButtonText: `No`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
         if (result.isConfirmed) {

            Swal.fire({
              title: "TURNO RESERVADO",
              text: (" Gracias " + nombre + " la fecha reservada es :" + dia+ "/"+ (monthNumber+1)+"/"+(currentYear)+ " en el horario(hs) "+horario),
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'confirmar'
              }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire(
                  'Reservado',
                  'Cualquier consulta estamos a disposicion',
                  'success'
                )
              }
              })
            
          } else if (result.isDenied) {
            Swal.fire('Se mantiene el turno ya reservado! Cualquier consulta quedamos a disposicion. Gracias por contactarnos')
          }
        })

      } else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Faltan completar datos para la reserva',
          
        })
      }
}
    


function limpiarForm(){

  const limpiarFormulario=document.getElementById("datosCliente")
  limpiarFormulario.reset()

 
}

 

