// Usuario
export interface Usuario {
  id: number;
  cedula: string;
  password?: string;
  nombres: string;
  apellidos: string;
  direccion?: string;
  telefono?: string;
  rol: 'admin' | 'cliente';
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UsuarioSinPassword extends Omit<Usuario, 'password'> {}

// Crédito
export type FrecuenciaPago = 'diario' | 'semanal' | 'quincenal' | 'mensual';
export type EstadoCredito = 'activo' | 'completado' | 'cancelado';

export interface Credito {
  id: number;
  cliente_id: number;
  monto_total: number;
  cuota_valor: number;
  numero_cuotas: number;
  frecuencia: FrecuenciaPago;
  fecha_inicio: Date;
  fecha_fin?: Date;
  estado: EstadoCredito;
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreditoConCliente extends Credito {
  cliente_nombre: string;
  cliente_apellido: string;
  cliente_cedula: string;
}

// Pago
export type EstadoPago = 'pendiente' | 'pagado' | 'parcial' | 'mora';
export type MetodoPago = 'efectivo' | 'transferencia' | 'otro';

export interface Pago {
  id: number;
  credito_id: number;
  numero_pago: number;
  fecha_programada: Date;
  cuota_valor: number;
  monto_pagado: number;
  abono: number;
  saldo_restante: number;
  estado: EstadoPago;
  fecha_pago?: Date;
  metodo_pago: MetodoPago;
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PagoConCredito extends Pago {
  cliente_nombre: string;
  cliente_cedula: string;
  monto_total_credito: number;
}

// Transacción
export type TipoTransaccion = 'pago' | 'abono' | 'ajuste';

export interface Transaccion {
  id: number;
  pago_id: number;
  monto: number;
  tipo: TipoTransaccion;
  usuario_id: number;
  observaciones?: string;
  created_at: Date;
}

// DTOs para formularios
export interface CrearUsuarioDTO {
  cedula: string;
  nombres: string;
  apellidos: string;
  direccion?: string;
  telefono?: string;
  rol?: 'admin' | 'cliente';
}

export interface CrearCreditoDTO {
  cliente_id: number;
  monto_total: number;
  cuota_valor: number;
  numero_cuotas: number;
  frecuencia: FrecuenciaPago;
  fecha_inicio: Date | string;
  observaciones?: string;
}

export interface RegistrarPagoDTO {
  pago_id: number;
  monto: number;
  metodo_pago: MetodoPago;
  observaciones?: string;
  usuario_id: number;
}

// Respuestas API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Estadísticas
export interface EstadisticasDashboard {
  total_clientes: number;
  creditos_activos: number;
  cobros_hoy: number;
  cobros_manana: number;
  total_prestado: number;
  total_cobrado: number;
  total_pendiente: number;
  tasa_morosidad: number;
}

// Filtros
export interface FiltrosPagos {
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: EstadoPago;
  cliente_id?: number;
  credito_id?: number;
}