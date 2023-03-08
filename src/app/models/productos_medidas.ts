export class Productos_medidas{//Modelo del producto_precio
    constructor(
        public idProdMedida: number,
        public idProducto: number,
        public idMedida: number,
        public unidad: number,
        public preciocompra : number,

        public porcentaje1: number,
        public precio1: number,

        public porcentaje2: number,
        public precio2: number,

        public porcentaje3: number,
        public precio3: number,

        public porcentaje4: number,
        public precio4: number,
        
        public porcentaje5: number,
        public precio5: number,

        public idStatus:number
    ){}
}