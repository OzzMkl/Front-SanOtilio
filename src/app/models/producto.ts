export class Producto{//Modelo del producto
    constructor(
        public idProducto: number,
        public idMarca: number,
        public idDep: number,
        public idCat: number,
        public claveEx: string,
        public cbarras: number,
        public descripcion: string,
        public stockMin: number,
        public stockMax: number,
        public imagen: string,
        public statuss: number,
        public ubicacion: string,
        public claveSat: string,
        public tEntrega: any,
        public idAlmacen: number,
        public existenciaG: number
    ){}
}