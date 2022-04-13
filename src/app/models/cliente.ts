export class Cliente{//Modelo de cliente
    constructor(
        public idCliente: number,
        public nombre: string,
        public aPaterno: string,
        public aMaterno: string,
        public rfc: string,
        public correo: string,
        public credito: number,
        public idStatus: number,
        public idTipo: number
    ){}
}