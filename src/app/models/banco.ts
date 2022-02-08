export class Banco{//Modelo del banco aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idBanco: number,
        public banco: string,
        public updated_at: any
    ){}
}