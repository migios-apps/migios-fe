import React from 'react'

interface InvoiceItem {
  description: string
  qty: number
  unitPrice: number
  discount: number
}

interface ModernTemplateProps {
  data: {
    companyName: string
    companyAddress: string
    invoiceTo: string
    invoiceToAddress: string
    invoiceNumber: string
    invoiceDate: string
    salesName: string
    termCondition: string
    paymentMethod: string
    paymentAmount: number
    outstanding: number
    items?: InvoiceItem[]
  }
  signatures: {
    sales: string
    admin: string
    member: string
  }
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({
  data,
  signatures,
}) => {
  // Helper functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateItemTotal = (
    qty: number,
    price: number,
    discount: number
  ): number => {
    return qty * price - discount
  }

  const calculateSubTotal = (): number => {
    return (
      data.items?.reduce(
        (sum, item) =>
          sum +
          calculateItemTotal(
            item.qty || 0,
            item.unitPrice || 0,
            item.discount || 0
          ),
        0
      ) || 0
    )
  }

  const calculateTax = (): number => {
    return calculateSubTotal() * 0.1 // Assuming 10% tax
  }

  const calculateGrandTotal = (): number => {
    return calculateSubTotal() + calculateTax()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-white p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {data.companyName}
            </h1>
            <p className="text-purple-100 dark:text-purple-200 text-sm">
              {data.companyAddress}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold text-white mb-2">INVOICE</h2>
            <p className="text-purple-100 dark:text-purple-200">
              #{data.invoiceNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Billed To
            </h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              {data.invoiceTo}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {data.invoiceToAddress}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Invoice Details
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-gray-600 dark:text-gray-400">Invoice Date:</p>
              <p className="text-gray-800 dark:text-white font-medium">
                {data.invoiceDate}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Sales Person:</p>
              <p className="text-gray-800 dark:text-white font-medium">
                {data.salesName}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Payment Method:
              </p>
              <p className="text-gray-800 dark:text-white font-medium">
                {data.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                    Description
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">
                    Quantity
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">
                    Unit Price
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">
                    Discount
                  </th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.items?.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <td className="p-4 text-gray-800 dark:text-white">
                      {item.description}
                    </td>
                    <td className="p-4 text-gray-800 dark:text-white text-center">
                      {item.qty}
                    </td>
                    <td className="p-4 text-gray-800 dark:text-white text-center">
                      {formatCurrency(item.unitPrice || 0)}
                    </td>
                    <td className="p-4 text-gray-800 dark:text-white text-center">
                      {formatCurrency(item.discount || 0)}
                    </td>
                    <td className="p-4 text-gray-800 dark:text-white text-right font-medium">
                      {formatCurrency(
                        calculateItemTotal(
                          item.qty || 0,
                          item.unitPrice || 0,
                          item.discount || 0
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">
                Subtotal:
              </span>
              <span className="text-gray-800 dark:text-white font-medium">
                {formatCurrency(calculateSubTotal())}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">
                Tax (10%):
              </span>
              <span className="text-gray-800 dark:text-white font-medium">
                {formatCurrency(calculateTax())}
              </span>
            </div>
            <div className="flex justify-between py-3 border-t border-gray-200 dark:border-gray-600 mt-2">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Total:
              </span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(calculateGrandTotal())}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Payment Status
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                Amount Paid
              </p>
              <p className="text-lg font-medium text-green-600 dark:text-green-400">
                {formatCurrency(data.paymentAmount || 0)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                Outstanding
              </p>
              <p className="text-lg font-medium text-red-600 dark:text-red-400">
                {formatCurrency(data.outstanding || 0)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Status</p>
              <p
                className={`text-lg font-medium ${data.outstanding > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}
              >
                {data.outstanding > 0 ? 'Partially Paid' : 'Paid'}
              </p>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-8 text-center mb-8">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Sales
            </h4>
            {signatures.sales ? (
              <img
                src={signatures.sales}
                alt="Sales signature"
                className="h-16 w-full object-contain"
              />
            ) : (
              <div className="h-16 border-b border-gray-300 dark:border-gray-600"></div>
            )}
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {data.salesName}
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Admin
            </h4>
            {signatures.admin ? (
              <img
                src={signatures.admin}
                alt="Admin signature"
                className="h-16 w-full object-contain"
              />
            ) : (
              <div className="h-16 border-b border-gray-300 dark:border-gray-600"></div>
            )}
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Administrator
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Member
            </h4>
            {signatures.member ? (
              <img
                src={signatures.member}
                alt="Member signature"
                className="h-16 w-full object-contain"
              />
            ) : (
              <div className="h-16 border-b border-gray-300 dark:border-gray-600"></div>
            )}
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {data.invoiceTo}
            </p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3">
            Terms & Conditions
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              {data.termCondition || 'No terms and conditions specified'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Created by Admin • {new Date().toLocaleDateString('id-ID')}
      </div>
    </div>
  )
}

export default ModernTemplate
