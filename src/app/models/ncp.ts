export class Ncp{//Modelo del empleado aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idProveedor: number,
        public idncp: number,
        public ncuenta: string,
        public idBanco: number,
        public titular: string,
        public clabe: string,
        public updated_at: any
    ){}
}