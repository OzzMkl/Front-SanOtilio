export class Departamento{//Modelo del banco aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idDep: number,
        public nombre: string,
        public updated_at: any
    ){}
}