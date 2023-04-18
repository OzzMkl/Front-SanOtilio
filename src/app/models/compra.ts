export class Compra{//Modelo de la compra
    constructor(
        public idCompra: number,
        public idOrd: any,
        public idProveedor: number,
        public folioProveedor: number,
        public subtotal: number,
        public total: number,
        public idEmpleadoR: number,
        public idStatus: number,
        public fechaRecibo: any,
        public observaciones: string,
        public facturable: any,
        public updated_at: any
    ){}
}