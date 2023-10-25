export class Producto_traspaso{//Modelo de la compra
    constructor(
        public idTraspaso: number,
        public idProducto: number,
        public descripcion: any,
        public claveEx: any,
        public idProdMedida:number,
        public cantidad: number,
        public precio: number,
        public subtotal: any,
        public igualMedidaMenor: any,
        public updated_at: any,
        /**Se agregan campos extras para mostrar 
         * en la vista de la lista de compras */
        public nombreMedida: any
    ){}
}