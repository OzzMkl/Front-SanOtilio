export class Ventag{//Modelo de las medidas aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idVenta: number,
        public idCliente: number,
        public idTipoVenta: number,
        public idTipoPago: number,
        public observaciones: string,
        public idStatus: number,
        public fecha: any,
        public idEmpleado: number,
        //extras
        public nombreCliente:string,
        public dirCliente: string
    ){}
}