export class Producto_orden{//Modelo de la compra
    constructor(
        public idOrd: number,
        public idProducto: number,
        public cantidad: number,
        /**Se agregan campos extras para mostrar en la vista de la lista de compras */
        public claveEx: string,
        public nombreMedida: string,
        public descripcion: string

    ){}
}