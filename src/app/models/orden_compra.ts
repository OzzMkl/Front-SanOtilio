export class Ordencompra{//Modelo de las medidas aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idOrd: number,
        public idReq: any,
        public idProveedor: number,
        public observaciones: string,
        public fecha: any,
        public idEmpleado: number,
        public idStatus: any,
        public updated_at: any
    ){}
}