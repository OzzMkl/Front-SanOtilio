export class Proveedor{//Modelo del empleado aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idProveedor: number,
        public rfc: string,
        public nombre: string,
        public pais: string,
        public estado: string,
        public ciudad: string,
        public cpostal: string,
        public colonia: string,
        public calle: string,
        public numero: string,
        public telefono: string,
        public creditoDias: number,
        public creditoCantidad: number,
        public idStatus: number,
        public updated_at: any,
        public nombreCon: string,
        public emailCon: string,
        public telefonoCon: string,
        public puestoCon: string,
        public ncuenta: string,
        public idBanco: string,
        public titular: string,
        public clabe: string
    ){}
}