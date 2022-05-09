export class Producto_ventasg{//Modelo de la compra
    constructor(
        public idVenta: number,
        public idProducto: number,
        public descripcion:  string,
        public cantidad: number,
        public precio: number,
        public descuento: number,
        //extras
        public claveEx:string,
        public nombreMedida:string,
        public precioMinimo:number,
        public subtotal:number,
        public tieneStock: boolean
    ){}
}