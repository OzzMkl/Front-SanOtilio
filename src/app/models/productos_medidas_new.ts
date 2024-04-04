export class Productos_medidas_new{
    constructor(
        public noTab: number | null | undefined = null,

        public idProdMedida: number = 0,
        public idProducto: number = 0,
        public idMedida: number = 0,
        public unidad: number = 0,
        public preciocompra : number = 0,

        public porcentaje1: number | null | undefined = null,
        public precio1: number | null | undefined = null,
        public isSelected_precio1: boolean = false,

        public porcentaje2: number | null | undefined = null,
        public precio2: number | null | undefined = null,
        public isSelected_precio2: boolean = false,

        public porcentaje3: number | null | undefined = null,
        public precio3: number | null | undefined = null,
        public isSelected_precio3: boolean = false,

        public porcentaje4: number | null | undefined = null,
        public precio4: number | null | undefined = null,
        public isSelected_precio4: boolean = false,
        
        public porcentaje5: number | null | undefined = null,
        public precio5: number | null | undefined = null,
        public isSelected_precio5: boolean = false,

        public idStatus:number = 0,
    ){}
}