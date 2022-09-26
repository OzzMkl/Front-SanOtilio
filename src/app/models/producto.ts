export class Producto{//Modelo del producto
    constructor(
        public idProducto: number,
        public idMedida: number,
        public idMarca: number,
        public idDep: number,
        public idCat: number,
        public idSubCat: number,
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
        public idProductoS: any,
        public factorConv: number,
        public existenciaG: number
    ){}
}