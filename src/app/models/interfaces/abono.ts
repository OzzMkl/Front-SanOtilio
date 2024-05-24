export interface abono {
    idAbonoVentas: number;
    idVenta: number;
    abono: number;
    totalAnterior: number;
    totalActualizado: number;
    idEmpleado: number;
    pc: string;
    created_at?: Date;
    updated_at?: Date;
    nombreEmpleado?: string;
  }