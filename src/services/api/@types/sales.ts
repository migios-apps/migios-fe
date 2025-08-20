import { ApiTypes, MetaApi } from './api'

export type ItemType = 'package' | 'product' | 'freeze'
export type DurationType = 'day' | 'month' | 'year'
export type DiscountType = 'percent' | 'nominal'
export type PaymentStatus = 0 | 1 | 2 | 3 // 0 = belum bayar, 1 = bayar semua, 2 = bayar sebagian. 3 = bayar sebagian dan aktifkan member package jika terdapat package
export type PackageType = 'membership' | 'pt_program' | 'class'

export interface SalesItem {
  item_type: ItemType
  trainer_id?: number
  package_id?: number
  product_id?: number
  name?: string
  quantity: number
  price: number
  sell_price?: number
  discount_type?: DiscountType | null
  discount?: number | null
  duration?: number | null
  duration_type?: DurationType | null
  session_duration?: number | null
  extra_session?: number | null
  extra_day?: number | null
  start_date?: string | null
  end_date?: string | null
  notes?: string | null

  // custom fields
  is_promo?: number
  loyalty_point?: number
  package_type?: PackageType | null
}

interface Payment {
  amount: number
  id: number
  //   reference_no: string
  //   notes?: string
  //   payment_date: string
}

interface RefundFromItem {
  id: number
  amount: number
  //   notes?: string
}

export interface CheckoutRequest {
  club_id: number
  member_id?: number
  discount_type: DiscountType
  discount?: number
  tax_rate?: number
  is_paid: PaymentStatus
  due_date?: string
  notes?: string
  items: SalesItem[]
  payments: Payment[]
  refund_from: RefundFromItem[]
}

export interface SalesType {
  id: number
  code: string
  member_id: number
  club_id: number
  type: string
  sale_type?: string | null
  subtotal: number
  discount_type: string
  discount_amount: number
  discount: number
  tax_rate: number
  tax_amount: number
  amount: number
  status: string
  flag?: string | null
  due_date?: string | null
  notes: string
  billing_address?: string | null
  shipping_address?: string | null
  created_at: string
  updated_at: string
  member: {
    id: number
    name: string
  }
  fstatus: string
  fsubtotal: string
  fdiscount_amount: string
  ftax_amount: string
  famount: string
  total_payments: number
  ftotal_payments: string
}

export type SalesTypeListResponse = Omit<ApiTypes, 'data'> & {
  data: { data: SalesType[]; meta: MetaApi }
}

// sales detail
export interface SalesDetailType {
  id: number
  code: string
  member_id: number
  club_id: number
  type: string
  sale_type: string | null
  subtotal: number
  discount_type: string
  discount_amount: number
  discount: number
  tax_rate: number
  tax_amount: number
  amount: number
  status: string
  is_paid: number
  is_refunded: number
  flag: string | null
  due_date: string
  notes: string | null
  billing_address: string | null
  shipping_address: string | null
  created_at: string
  updated_at: string
  invoice_id: number
  invoice_code: string
  total_payments: number
  total_refunds: number
  outstanding_amount: number
  return_amount: number
  grand_total: number
  fsubtotal: string
  famount: string
  fgrand_total: string
  fdiscount: string
  ftax_amount: string
  ftotal_payments: string
  ftotal_refunds: string
  foutstanding_amount: string
  freturn_amount: string
  member: {
    id: number
    code: string
    name: string
    address: string
    gender: string
    phone: string
    photo: string | null
    email: string
  }
  items: {
    id: number
    sales_id: number
    product_id: number | null
    package_id: number | null
    item_type: 'package' | 'product'
    name: string
    description: string | null
    quantity: number
    price: number
    subtotal: number
    discount_type: string
    discount: number
    total: number
    notes: string
    trs_discount_type: string
    trs_discount: number
    trs_tax_rate: number
    trs_tax_amount: number
    trs_amount: number
    created_at: string
    updated_at: string
    duration: number
    duration_type: string
    extra_day: number
    extra_session: number
    session_duration: number
    fprice: string
    fsubtotal: string
    fdiscount: string
    ftotal: string
    ftrs_discount: string
    ftrs_tax_amount: string
    ftrs_amount: string
    fduration: string
    start_date: string
    end_date: string
    product?: {
      id: number
      name: string
      photo: string | null
    } | null
    package?: {
      id: number
      name: string
      duration_type: string
      duration: number
      session_duration: number
      photo: string | null
      type: PackageType
    } | null
    trainer?: {
      id: number
      name: string
      photo: string
    } | null
  }[]
  payments: {
    id: number
    sales_id: number
    amount: number
    rekening_id: number
    status: string
    reference_no: string | null
    notes: string | null
    date: string
    created_at: string
    updated_at: string
    rekening_name: string
    famount: string
  }[]
  refunds: {
    id: number
    sales_id: number
    amount: number
    rekening_id: number
    status: string
    reference_no: string | null
    notes: string | null
    date: string
    created_at: string
    updated_at: string
  }[]
  club: {
    name: string
    domain: string
    address: string
    photo: string
    phone: string
    email: string
    country: string
    country_code: string
    state: string
    city: string
    village: string
    zip_code: string
  }
}

export type SalesDetailResponse = Omit<ApiTypes, 'data'> & {
  data: SalesDetailType
}

// Refund types
export interface RefundItem {
  trainer_id?: number
  item_type: ItemType
  package_id?: number
  product_id?: number
  quantity: number
  price: number
}

export interface RefundPayment {
  amount: number
  id: number
  reference_no: string
  notes?: string
  payment_date: string
}

export interface RefundRequest {
  transaction_id: number
  club_id: number
  member_id: number
  employee_id: number
  is_paid: PaymentStatus
  due_date: string
  notes?: string
  items: RefundItem[]
  payments: RefundPayment[]
}
