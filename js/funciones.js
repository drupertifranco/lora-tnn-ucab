//funcion de Impresion
function imprSelec(nombre){
var tabla = document.getElementById(nombre);
var ventimp = window.open(' ','impresion','no','no','50','no','no','no','no','no','no','no','no','50');
ventimp.document.write(tabla.innerHTML );
ventimp.document.close();
ventimp.print( );
ventimp.close();
}

