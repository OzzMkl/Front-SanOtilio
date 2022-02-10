export class Compra{//Modelo de la compra
    constructor(
        public idCompra: number,
        public idOrd: any,
        public idPedido: any,
        public idProveedor: number,
        public folioProveedor: number,
        public subtotal: number,
        public total: number,
        public idEmpleadoR: number,
        public estado: string,
        public fechaRecibo: any,
        public observaciones: string,
        public updated_at: any
    ){}
}