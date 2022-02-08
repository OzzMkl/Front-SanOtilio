export class Contacto{//Modelo del empleado aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idContacto: number,
        public idProveedor: number,
        public nombre: string,
        public email: string,
        public telefono: string,
        public puesto: string,
        public updated_at: any
    ){}
}