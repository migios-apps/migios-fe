import React from 'react'
import { InvoiceTemplateProps } from './index'

const CorporateTemplate: React.FC<InvoiceTemplateProps> = ({
  data,
  signatures,
}) => {
  // Helper
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Table calculation
  const getTotal = (item: any) => {
    return (item.qty || 0) * (item.unitPrice || 0)
  }

  const subtotal =
    data.items?.reduce((sum, item) => sum + getTotal(item), 0) || 0
  const tax = 20 // Demo, bisa diganti dengan perhitungan
  const discount = 0 // Demo, bisa diganti dengan perhitungan
  const grandTotal = subtotal + tax - discount

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-[#18233a] relative overflow-hidden">
        {/* Logo section - left side */}
        <div className="flex justify-between">
          <div className="p-6 pb-10 relative z-10 w-[60%]">
            <div className="text-white text-lg font-bold tracking-widest">
              YOUR LOGO
            </div>
            <div className="text-gray-200 text-xs mt-1">SLOGAN</div>
          </div>

          {/* Invoice section - right side */}
          <div className="p-6 text-right w-[40%] relative z-10">
            <div className="text-white text-3xl font-bold tracking-wider">
              INVOICE
            </div>
            <div className="text-gray-200 text-xs mt-1">
              ID NO : {data.invoiceNumber || '1234112260666'}
            </div>
          </div>
        </div>

        {/* Diagonal orange accent */}
        <div className="absolute left-0 bottom-0 w-full h-24">
          <div
            className="absolute left-0 bottom-0 w-full h-24 bg-orange-400"
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 70% 0, 0 100%)',
            }}
          ></div>
          <div
            className="absolute left-0 bottom-0 w-full h-20 bg-[#18233a]"
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 65% 0, 0 100%)',
            }}
          ></div>
          <div
            className="absolute left-0 bottom-0 w-full h-16 bg-orange-400/30"
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 60% 0, 0 100%)',
            }}
          ></div>
        </div>
      </div>

      {/* Info To/From */}
      <div className="flex justify-between gap-4 px-6 pt-8 pb-4">
        <div>
          <div className="bg-[#18233a] text-white px-2 py-1 rounded text-xs font-bold inline-block mb-1">
            Invoice To :
          </div>
          <div className="text-sm font-bold">{data.invoiceTo}</div>
          <div className="text-xs text-gray-700 whitespace-pre-line">
            {data.invoiceToAddress}
          </div>
        </div>
        <div>
          <div className="bg-[#18233a] text-white px-2 py-1 rounded text-xs font-bold inline-block mb-1">
            Invoice From :
          </div>
          <div className="text-sm font-bold">{data.companyName}</div>
          <div className="text-xs text-gray-700 whitespace-pre-line">
            {data.companyAddress}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pt-4">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-orange-400 text-white">
              <th className="p-2">DISCRIPTION</th>
              <th className="p-2">PRICE</th>
              <th className="p-2">QTY</th>
              <th className="p-2">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {data.items?.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="p-2 font-medium text-gray-700">
                  {item.description}
                </td>
                <td className="p-2">{formatCurrency(item.unitPrice)}</td>
                <td className="p-2 text-center">{item.qty}</td>
                <td className="p-2 font-semibold">
                  {formatCurrency(getTotal(item))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment, Contact, Total */}
      <div className="flex flex-wrap gap-4 justify-between px-6 pt-6 pb-4">
        <div className="flex-1 min-w-[180px]">
          <div className="text-xs font-bold mb-1">Payment Method :</div>
          <div className="text-xs bg-gray-100 rounded p-2 mb-2">
            Account No: 333 2156 6534
            <br />
            Account Name: {data.invoiceTo}
            <br />
            Branch: NEW WORK
          </div>
          <div className="text-xs font-bold mb-1">Contact Info:</div>
          <div className="text-xs bg-gray-100 rounded p-2">
            Phone: -<br />
            Email: -<br />
            Web: -
          </div>
        </div>
        <div className="flex-1 min-w-[180px]">
          <div className="bg-gray-50 rounded p-4 border border-gray-200">
            <div className="flex justify-between text-xs mb-1">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span>Tex :</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span>Discount :</span>
              <span>{formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold border-t pt-2 mt-2 text-orange-500">
              <span>TOTAL</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Signature */}
      <div className="px-6 pb-2">
        <div className="text-xs font-bold mt-4 mb-1">
          Thanks for your business
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {data.termCondition ||
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        </div>
        <div className="flex justify-between items-end mt-6">
          <div className="text-center">
            <div className="font-bold text-sm mb-1">Sales</div>
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
          <div className="text-center">
            <div className="font-bold text-sm mb-1">Admin</div>
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
          <div className="text-center">
            <div className="font-bold text-sm mb-1">Member</div>
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
      </div>
      {/* Bottom Accent */}
      <div className="bg-orange-400 h-2 mt-2"></div>
    </div>
  )
}

export default CorporateTemplate
