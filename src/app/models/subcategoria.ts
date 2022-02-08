export class Subcategoria{//Modelo de la subcategoria aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idCat: number,
        public idSubCat: number,
        public nombre: string,
        public updated_at: any
    ){}
}