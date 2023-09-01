export class Traspaso{//Modelo de la compra
    constructor(
        public idTraspaso: number,
        public folio: number,
        public sucursalE: number,
        public sucursalR: number,
        public idEnvio: number,
        public idEmpleado: number,
        public idStatus: number,
        public observaciones: string,
        public created_at: any,
        public updated_at: any
    ){}
}