import { SalesDetailType } from '@/services/api/@types/sales'
import dayjs from 'dayjs'

interface InvoiceA5Props {
  detail: SalesDetailType
}

const InvoiceA5 = ({ detail }: InvoiceA5Props) => {
  const invoiceStyle = {
    fontSize: '14px',
  }
  return (
    <div
      className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
      style={invoiceStyle}
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-bold mb-2 text-white" style={invoiceStyle}>
                {detail?.club.name}
              </h1>
              <div className="text-blue-100 space-y-1">
                <p>{detail?.club.address}</p>
                <p>
                  {detail?.club.city}, {detail?.club.state},{' '}
                  {detail?.club.country}
                </p>
                <p>
                  {detail?.club.phone} • {detail?.club.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="font-bold mb-2 text-white" style={invoiceStyle}>
                FAKTUR
              </h2>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="font-bold" style={invoiceStyle}>
                  #{detail?.code}
                </p>
                <p className="text-blue-100">
                  {dayjs(detail?.due_date).format('DD MMM YYYY')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3
                className="font-bold text-gray-800 dark:text-gray-200 mb-3"
                style={invoiceStyle}
              >
                Tagihan Ke:
              </h3>
              <div className="space-y-1 text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {detail?.member?.name}
                </p>
                <p>{detail?.member?.address}</p>
                <p>{detail?.member?.email}</p>
                <p>{detail?.member?.phone}</p>
              </div>
            </div>
            {detail?.employee ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3
                  className="font-bold text-gray-800 dark:text-gray-200 mb-3"
                  style={invoiceStyle}
                >
                  Penjualan Dari:
                </h3>
                <div className="space-y-1 text-gray-600 dark:text-gray-300">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {detail?.employee?.name}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse" style={invoiceStyle}>
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border border-gray-300 dark:border-gray-600 py-3 px-1 text-left font-semibold text-gray-800 dark:text-gray-200 align-top">
                    Item
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 py-3 px-1 text-center font-semibold text-gray-800 dark:text-gray-200 align-top">
                    Qty
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 py-3 px-1 text-right font-semibold text-gray-800 dark:text-gray-200 align-top">
                    Harga
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 py-3 px-1 text-right font-semibold text-gray-800 dark:text-gray-200 align-top">
                    Diskon
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 py-3 px-1 text-right font-semibold text-gray-800 dark:text-gray-200 align-top">
                    Tarif pajak
                  </th>
                  <th className="border border-gray-300 dark:border-gray-600 py-3 px-1 text-right font-semibold text-gray-800 dark:text-gray-200 align-top">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {detail?.items.map((item, index) => {
                  const formatDuration = `${item.duration} ${item.duration_type}`
                  const dateRange =
                    item.start_date && item.end_date
                      ? `${dayjs(item.start_date).format('DD MMM YYYY')} - ${dayjs(item.end_date).format('DD MMM YYYY')}`
                      : null

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="border border-gray-300 dark:border-gray-600 py-2 px-1 align-top">
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {item.name}
                          </span>
                          {item.item_type === 'package' ? (
                            <div className="mt-2 space-y-1">
                              <div className="text-gray-500 dark:text-gray-400">
                                Durasi: {formatDuration}
                                {item.session_duration > 0
                                  ? ` • Sessions: ${item.session_duration}`
                                  : null}
                              </div>
                              {dateRange ? (
                                <div className="text-gray-500 dark:text-gray-400">
                                  Periode: {dateRange}
                                </div>
                              ) : null}
                              {item.package?.type === 'pt_program' &&
                              item.trainer ? (
                                <div
                                  className="font-semibold"
                                  style={invoiceStyle}
                                >
                                  Trainer: {item.trainer.name}
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 py-2 px-1 text-center align-top">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 py-2 px-1 text-right align-top">
                        {item.fgross_amount}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 py-2 px-1 text-right align-top">
                        {item.fdiscount_amount}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 py-2 px-1 text-right align-top">
                        <ul>
                          {item.taxes.map((tax) => (
                            <li key={tax.id}>
                              {`${tax.name} ${tax.rate}%: ${tax.famount}`}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 py-2 px-1 text-right font-semibold align-top">
                        {item.fnet_amount}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Info */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h6
                  className="font-bold text-gray-800 dark:text-gray-200 mb-3"
                  style={invoiceStyle}
                >
                  Pembayaran
                </h6>
                {detail?.payments && detail.payments.length > 0 ? (
                  <div className="space-y-2">
                    {detail.payments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex justify-between"
                        style={invoiceStyle}
                      >
                        <span className="text-gray-600 dark:text-gray-400">
                          {payment.rekening_name}:
                        </span>
                        <span className="font-medium">{payment.famount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-gray-500 dark:text-gray-400"
                    style={invoiceStyle}
                  >
                    Tidak ada pembayaran
                  </p>
                )}
              </div>
            </div>

            {/* Spacer */}
            <div className="lg:col-span-1"></div>

            {/* Totals */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal:
                    </span>
                    <span className="font-medium">
                      {detail?.fsubtotal_net_amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Diskon:
                    </span>
                    <span className="font-medium">
                      -{detail?.ftotal_discount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Pajak:
                    </span>
                    <span className="font-medium">{detail?.ftotal_tax}</span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                    <div
                      className="flex justify-between font-bold"
                      style={invoiceStyle}
                    >
                      <span>Total:</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {detail?.ftotal_amount}
                      </span>
                    </div>
                  </div>
                  {detail?.ballance_amount && detail.ballance_amount > 0 ? (
                    <div className="flex justify-between text-red-600 dark:text-red-400">
                      <span>Sisa Pembayaran:</span>
                      <span className="font-medium">
                        {detail.fballance_amount}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="font-semibold mb-24" style={invoiceStyle}>
                Admin
              </p>
              <div className="border-b border-gray-400"></div>
            </div>
            <div className="text-center">
              <p className="font-semibold mb-24" style={invoiceStyle}>
                Tenaga Penjualan
              </p>
              <div className="border-b border-gray-400"></div>
              <p
                className="mt-2 text-gray-600 dark:text-gray-400 capitalize font-semibold"
                style={invoiceStyle}
              >
                {detail?.employee?.name || ''}
              </p>
            </div>
            <div className="text-center">
              <p className="font-semibold mb-24" style={invoiceStyle}>
                Member
              </p>
              <div className="border-b border-gray-400"></div>
              <p
                className="mt-2 text-gray-600 dark:text-gray-400 capitalize font-semibold"
                style={invoiceStyle}
              >
                {detail?.member?.name || ''}
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3
              className="font-bold text-gray-800 dark:text-gray-200 mb-3"
              style={invoiceStyle}
            >
              Syarat & Ketentuan:
            </h3>
            <ol
              className="list-decimal ml-5 text-gray-600 dark:text-gray-400 space-y-1"
              style={invoiceStyle}
            >
              <li>
                Keanggotaan tidak dapat dipindahtangankan dan tidak dapat
                dikembalikan.
              </li>
              <li>
                Paket dan sesi tidak dapat dikembalikan atau dipindahtangankan.
              </li>
              <li>
                Member harus mematuhi aturan gym dan menghormati staf serta
                anggota lainnya.
              </li>
              <li>
                {detail?.club.name} tidak bertanggung jawab atas cedera atau
                kecelakaan di tempat.
              </li>
            </ol>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 py-4 border-t border-gray-200 dark:border-gray-600">
            <p
              className="text-gray-500 dark:text-gray-400"
              style={invoiceStyle}
            >
              Terima kasih atas kunjungan Anda! Semoga harimu menyenangkan!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceA5
