export class Medida{//Modelo de las medidas aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idMedida: number,
        public nombre: string,
        public updated_at: any
    ){}
}