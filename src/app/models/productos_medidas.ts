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

    /**
     * @description
     * Compara los precios del 1 al 5, si el p1 < p2
     * retorna No. del precio que esta mal
     * retorna null si los precios son correctos
     * @returns boolean | null
     */
    comparePrices(): number | null {
      // creamos array con los precios
        const precios = [
          this.precio1,
          this.precio2,
          this.precio3,
          this.precio4,
          this.precio5
        ];
    
        //recorremos el array validando que sea menor uno del otro
        for (let i = 1; i < precios.length; i++) {

          // p1 < p2 si entra retornamos el p2
            if (precios[i - 1] < precios[i]) {
            return i+1;
          }
        }
    
        // Si todos los precios son correctos, devuelve null
        return null;
    }
}