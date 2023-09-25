export class Sucursal{//Modelo de las medidas aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idSuc: number,
        public nombre: string,
        public direccion: string,
        public horario: string,
    ){}
}