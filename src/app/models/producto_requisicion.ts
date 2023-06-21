export class Producto_requisicion{//Modelo de la compra
    constructor(
        public idReq: number,
        public idProducto: number,
        public idProdMedida:number,
        public cantidad: number,
        public igualMedidaMenor: any,
        public updated_at: any,
        /**Se agregan campos extras para mostrar 
         * en la vista de la lista de compras */
        public claveEx: any,
        public descripcion: any,
        public nombreMedida: any
    ){}
}