export class Caja_movimientos{//Modelo de la tabla cajas
    constructor(
        public idCaja: number,
        public idMovCaja: any,
        public dinero: number,
        public idTipoMov: number,
        public idTipoPago: number,
        public idOrigen: number,
        public autoriza: any,
        public observaciones: string

    ){}
}