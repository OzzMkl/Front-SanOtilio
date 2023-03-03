export class Producto_compra{//Modelo de la compra
    constructor(
        public idCompra: number,
        public idProducto: number,
        public idProdMedida:number,
        public cantidad: number,
        public precio: number,
        public idImpuesto: number,
        public subtotal: any,
        public updated_at: any,
        /**Se agregan campos extras para mostrar 
         * en la vista de la lista de compras */
        public claveEx: any,
        public NombreImpuesto: any,
        public valorImpuesto: any,
        public descripcion: any,
        public nombreMedida: any,
        public caducidad: any
    ){}
}