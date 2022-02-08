export class Almacen{//Modelo de las medidas aqui asignamos todas las variables de acuerdo a la tabla que se tiene en la base de datos
    constructor(
        public idAlmacen: number,
        public nombre: string,
        public idEmpleado: number,
        public direccion: string,
        public updated_at: any

    ){}
}