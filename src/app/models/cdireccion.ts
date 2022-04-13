export class Cdireccion{//Modelo de cliente
    constructor(
        public idCliente: number,
        public pais: string,
        public estado: string,
        public ciudad: string,
        public colonia: string,
        public calle: string,
        public entreCalles: string,
        public numExt: string,
        public numInt: string,
        public cp: string,
        public referencia: string,
        public telefono: string,
        public idZona: string
    ){}
}