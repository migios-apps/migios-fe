import { Button, Card, Input } from '@/components/ui'
import { useState } from 'react'
import {
  TbCheck,
  TbClock,
  TbCreditCard,
  TbDownload,
  TbEye,
  TbX,
} from 'react-icons/tb'
import LayoutGymSetting from './Layout'

interface PaymentHistory {
  id: string
  invoiceNumber: string
  planName: string
  planType: 'basic' | 'professional' | 'enterprise'
  amount: number
  paymentDate: string
  dueDate: string
  status: 'paid' | 'pending' | 'failed' | 'cancelled'
  paymentMethod: string
  billingPeriod: string
  gymLocation: string
  memberCount: number
  features: string[]
}

const PAYMENT_HISTORY: PaymentHistory[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    planName: 'Professional Plan',
    planType: 'professional',
    amount: 2500000,
    paymentDate: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'paid',
    paymentMethod: 'Transfer Bank',
    billingPeriod: 'Bulanan',
    gymLocation: 'FitZone Jakarta Pusat',
    memberCount: 500,
    features: ['Unlimited Members', 'Advanced Analytics', 'Priority Support'],
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    planName: 'Enterprise Plan',
    planType: 'enterprise',
    amount: 25000000,
    paymentDate: '2024-01-10',
    dueDate: '2025-01-10',
    status: 'paid',
    paymentMethod: 'Credit Card',
    billingPeriod: 'Tahunan',
    gymLocation: 'PowerGym Surabaya',
    memberCount: 1000,
    features: ['Unlimited Members', 'Custom Features', '24/7 Support'],
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    planName: 'Basic Plan',
    planType: 'basic',
    amount: 750000,
    paymentDate: '2024-02-01',
    dueDate: '2024-03-01',
    status: 'pending',
    paymentMethod: 'Transfer Bank',
    billingPeriod: 'Bulanan',
    gymLocation: 'HealthClub Bandung',
    memberCount: 100,
    features: ['Up to 100 Members', 'Basic Analytics'],
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    planName: 'Professional Plan',
    planType: 'professional',
    amount: 2500000,
    paymentDate: '2024-01-20',
    dueDate: '2024-02-20',
    status: 'failed',
    paymentMethod: 'Credit Card',
    billingPeriod: 'Bulanan',
    gymLocation: 'FitZone Jakarta Selatan',
    memberCount: 300,
    features: ['Unlimited Members', 'Advanced Analytics', 'Priority Support'],
  },
]

const GymPayments = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(
    null
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: {
        color: 'bg-green-100 text-green-800',
        label: 'Lunas',
        icon: TbCheck,
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        label: 'Menunggu',
        icon: TbClock,
      },
      failed: {
        color: 'bg-red-100 text-red-800',
        label: 'Gagal',
        icon: TbX,
      },
      cancelled: {
        color: 'bg-gray-100 text-gray-800',
        label: 'Dibatalkan',
        icon: TbX,
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config.icon

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const getPlanBadge = (planType: string) => {
    const planConfig = {
      basic: {
        color: 'bg-blue-100 text-blue-800',
        label: 'Basic',
      },
      professional: {
        color: 'bg-purple-100 text-purple-800',
        label: 'Professional',
      },
      enterprise: {
        color: 'bg-indigo-100 text-indigo-800',
        label: 'Enterprise',
      },
    }

    const config = planConfig[planType as keyof typeof planConfig]

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    )
  }

  const filteredPayments = PAYMENT_HISTORY.filter((payment) => {
    const matchesSearch =
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.gymLocation.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || payment.status === statusFilter
    const matchesPlan = !planFilter || payment.planType === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  return (
    <LayoutGymSetting>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              History Pembayaran
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola dan pantau history perpanjangan plan gym Anda
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="solid"
              size="sm"
              className="flex items-center gap-2"
            >
              <TbDownload className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                type="text"
                placeholder="Cari invoice, plan, atau lokasi..."
                value={searchTerm}
                className="flex-1"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                value={statusFilter}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="paid">Lunas</option>
                <option value="pending">Menunggu</option>
                <option value="failed">Gagal</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
            <div>
              <select
                value={planFilter}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setPlanFilter(e.target.value)}
              >
                <option value="">Semua Plan</option>
                <option value="basic">Basic Plan</option>
                <option value="professional">Professional Plan</option>
                <option value="enterprise">Enterprise Plan</option>
              </select>
            </div>
            <div>
              <Input
                type="month"
                value={dateFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDateFilter(e.target.value)
                }
              />
            </div>
          </div>
        </Card>

        {/* Payment History Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Invoice
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Lokasi Gym
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Jumlah
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Tanggal Bayar
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {payment.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.billingPeriod}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {payment.planName}
                        </div>
                        {getPlanBadge(payment.planType)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-gray-900 dark:text-white">
                          {payment.gymLocation}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.memberCount} members
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-gray-900 dark:text-white">
                          {formatDate(payment.paymentDate)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Jatuh tempo: {formatDate(payment.dueDate)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="plain"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <TbEye className="w-4 h-4" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400">
                  Tidak ada data pembayaran yang ditemukan
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Detail Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Detail Pembayaran
                  </h3>
                  <Button
                    variant="plain"
                    size="sm"
                    onClick={() => setSelectedPayment(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Invoice Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nomor Invoice
                      </label>
                      <div className="text-gray-900 dark:text-white">
                        {selectedPayment.invoiceNumber}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </label>
                      <div className="mt-1">
                        {getStatusBadge(selectedPayment.status)}
                      </div>
                    </div>
                  </div>

                  {/* Plan Info */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Informasi Plan
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Nama Plan
                        </label>
                        <div className="text-gray-900 dark:text-white">
                          {selectedPayment.planName}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Periode Billing
                        </label>
                        <div className="text-gray-900 dark:text-white">
                          {selectedPayment.billingPeriod}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Lokasi Gym
                        </label>
                        <div className="text-gray-900 dark:text-white">
                          {selectedPayment.gymLocation}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Jumlah Member
                        </label>
                        <div className="text-gray-900 dark:text-white">
                          {selectedPayment.memberCount} members
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Informasi Pembayaran
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Jumlah Pembayaran
                        </label>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(selectedPayment.amount)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Metode Pembayaran
                        </label>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <TbCreditCard className="w-4 h-4" />
                          {selectedPayment.paymentMethod}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Tanggal Pembayaran
                        </label>
                        <div className="text-gray-900 dark:text-white">
                          {formatDate(selectedPayment.paymentDate)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Tanggal Jatuh Tempo
                        </label>
                        <div className="text-gray-900 dark:text-white">
                          {formatDate(selectedPayment.dueDate)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Fitur yang Disertakan
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPayment.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="solid"
                    onClick={() => setSelectedPayment(null)}
                  >
                    Tutup
                  </Button>
                  <Button>Download Invoice</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutGymSetting>
  )
}

export default GymPayments
