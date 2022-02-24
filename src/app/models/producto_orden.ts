export class Producto_orden{//Modelo de la compra
    constructor(
        public idOrd: number,
        public idProducto: number,
        public cantidad: number,
        public updated_at: any,
        /**Se agregan campos extras para mostrar en la vista de la lista de compras */
        public claveEx: any,
        public descripcion: any,
        public nombreMedida: any

    ){}
}