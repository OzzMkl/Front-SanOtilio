export class Empresa{//Modelo de las medidas aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idSuc: number,
        public nombreCorto: string,
        public nombreLargo: string,
        public calle: string,
        public numero: string,
        public colonia: string,
        public cp: string,
        public ciudad: string,
        public estado: string,
        public pais: string,
        public telefono: string,
        public telefono2: string,
        public rfc: string,
        public correo1: string,
        public correo2: string,
    ){}
}