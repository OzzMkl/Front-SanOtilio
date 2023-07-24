export class Producto_ventasg{//Modelo de la compra
    constructor(
        public idVenta: number,
        public idProducto: number,
        public descripcion:  string,
        public idProdMedida: number,
        public cantidad: number,
        public precio: number,
        public descuento: number,
        public total: number,
        //extras
        public claveEx:string,
        public nombreMedida:string,
        public precioCompra:number,
        public subtotal:number,
        public tieneStock: boolean
    ){}
}