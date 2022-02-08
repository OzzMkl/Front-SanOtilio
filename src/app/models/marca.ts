export class Marca{//Modelo de las marcas aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idMarca: number,
        public nombre: string,
        public updated_at: any
    ){}
}