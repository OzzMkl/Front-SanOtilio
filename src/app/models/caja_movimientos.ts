export class Caja_movimientos{//Modelo de la tabla cajas
    constructor(
        public idCaja: number,
        public idMovCaja: any,
        public totalNota: number,
        public idTipoMov: number,
        public idTipoPago: number,
        public pagoCliente:number,
        public cambioCliente:number,
        public idOrigen: number,
        public autoriza: any,
        public observaciones: string

    ){}
}