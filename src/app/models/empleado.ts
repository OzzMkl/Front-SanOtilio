export class Empleado{//Modelo del empleado aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idEmpleado: number,
        public nombre: string,
        public aPaterno: string,
        public aMaterno: string,
        public estado: string,
        public ciudad: string,
        public colonia: string,
        public calle: string,
        public numExt: string,
        public numInt: string,
        public cp: string,
        public celular: string,
        public telefono: string,
        public email: string,
        public idRol: number,
        public idSuc: number,
        public idStatus: number,
        public fechaAlta: any,
        public password: string,
        public licencia: string,
        public fNacimiento: any,
        public updated_at: any
    ){}
}