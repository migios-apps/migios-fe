import React from 'react'

interface InvoiceItem {
  description: string
  qty: number
  unitPrice: number
  discount: number
}

interface InvoicePreviewProps {
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

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="bg-blue-500 dark:bg-blue-600 text-white p-6 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 p-2 rounded">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{data.companyName}</h1>
            <p className="text-blue-100 dark:text-blue-200 text-sm">
              {data.companyAddress}
            </p>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">INVOICE</h2>
      </div>

      {/* Invoice Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Invoice To:
            </h3>
            <p className="font-semibold text-gray-800 dark:text-white">
              {data.invoiceTo}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {data.invoiceToAddress}
            </p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Invoice No:
              </span>
              <span className="ml-2 font-semibold text-gray-800 dark:text-white">
                {data.invoiceNumber}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Date:</span>
              <span className="ml-2 font-semibold text-blue-600 dark:text-blue-400">
                {data.invoiceDate}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-500 dark:bg-blue-600 text-white">
                <th className="text-left p-3 rounded-tl">Plan Description</th>
                <th className="text-center p-3">QTY</th>
                <th className="text-center p-3">Unit Price</th>
                <th className="text-center p-3">Discount</th>
                <th className="text-center p-3 rounded-tr">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items?.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{item.description}</td>
                  <td className="text-center p-3">{item.qty}</td>
                  <td className="text-center p-3">
                    {formatCurrency(item.unitPrice || 0)}
                  </td>
                  <td className="text-center p-3">
                    {formatCurrency(item.discount || 0)}
                  </td>
                  <td className="text-center p-3 font-semibold">
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

        {/* Sales Name */}
        <div className="mb-6">
          <span className="text-gray-600 dark:text-gray-400">Sales Name:</span>
          <span className="ml-2 font-semibold text-gray-800 dark:text-white">
            {data.salesName}
          </span>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span>Sub Total:</span>
              <span className="font-semibold">
                {formatCurrency(calculateSubTotal())}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span>Tax:</span>
              <span className="font-semibold">
                {formatCurrency(calculateTax())}
              </span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold border-t">
              <span>Total:</span>
              <span>{formatCurrency(calculateGrandTotal())}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-6">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold mb-2">Payment Method</span>
              <p className="text-gray-800 dark:text-white">
                {data.paymentMethod}
              </p>
            </div>
            <div>
              <span className="font-semibold mb-2">Create at</span>
              <p className="text-gray-800 dark:text-white">
                23-May-2024, 20:15
              </p>
            </div>
            <div>
              <span className="font-semibold mb-2">Amount</span>
              <p className="text-gray-800 dark:text-white">
                {formatCurrency(data.paymentAmount || 0)}
              </p>
            </div>
            <div>
              <span className="font-semibold mb-2">Outstanding</span>
              <p className="text-gray-800 dark:text-white">
                {formatCurrency(data.outstanding || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          Created by Admin
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-8 text-center mb-6">
          <div>
            <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">
              Sales
            </h4>
            {signatures.sales ? (
              <img
                src={signatures.sales}
                alt="Sales signature"
                className="h-16 w-full object-contain border-b border-gray-300"
              />
            ) : (
              <div className="h-16 border-b border-gray-300 dark:border-gray-600"></div>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">
              Admin
            </h4>
            {signatures.admin ? (
              <img
                src={signatures.admin}
                alt="Admin signature"
                className="h-16 w-full object-contain border-b border-gray-300"
              />
            ) : (
              <div className="h-16 border-b border-gray-300 dark:border-gray-600"></div>
            )}
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">
              Member
            </h4>
            {signatures.member ? (
              <img
                src={signatures.member}
                alt="Member signature"
                className="h-16 w-full object-contain border-b border-gray-300"
              />
            ) : (
              <div className="h-16 border-b border-gray-300 dark:border-gray-600"></div>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div>
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Term & Condition:
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded min-h-20">
            <p className="text-gray-600 dark:text-gray-400">
              {data.termCondition || 'No terms and conditions specified'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePreview
