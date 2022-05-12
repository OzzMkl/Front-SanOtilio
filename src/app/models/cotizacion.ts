export class Cotizacion{//Modelo
    constructor(
        public idCotiza: number,
        public idCliente: number,
        public cdireccion: string,
        public idEmpleado: number,
        public idStatus: number,
        public observaciones: string,
        public subtotal:number,
        public descuento:number,
        public total:number,
        //extras
        public nombreCliente:string,
    ){}
}