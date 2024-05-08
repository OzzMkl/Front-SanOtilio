export class Requisicion{//Modelo de la compra
    constructor(
        public idReq: number,
        public idProveedor: number,
        public observaciones: string,
        public idEmpleado: number,
        public idStatus: number,
        public idOrd: any,
        public updated_at: any
    ){}
}