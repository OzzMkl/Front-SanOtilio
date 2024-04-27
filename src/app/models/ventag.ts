export class Ventag{//Modelo de las medidas aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idVenta: number,
        public idCliente: number,
        public idTipoVenta: number,
        public observaciones: string,
        public idStatusCaja: number,
        public idStatusEntregas: number,
        public fecha: any,
        public idEmpleado: number,
        public subtotal:number,
        public descuento:number,
        public total:number,
        //extras
        public nombreCliente:string,
        public cdireccion: string,
        public idCotiza: number,
        public seEnviap: boolean = false,
    ){}
}