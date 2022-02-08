export class Categoria{//Modelo de las categorias aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idCat: number,
        public idDep: number,
        public nombre: string,
        public updated_at: any
    ){}
}