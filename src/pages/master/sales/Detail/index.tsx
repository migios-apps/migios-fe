import ModeSwitcher from '@/components/template/ThemeConfigurator/ModeSwitcher'
import { Tabs } from '@/components/ui'
import CloseButton from '@/components/ui/CloseButton'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { apiGetTransaction } from '@/services/api/TransactionService'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Printer, ReceiptText } from 'iconsax-react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SaleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = React.useState('a5')

  const {
    data: detail,
    // isLoading,
    // error,
  } = useQuery({
    queryKey: [QUERY_KEY.sales, id],
    queryFn: () => apiGetTransaction(id as string),
    select: (res) => res.data,
    enabled: !!id,
  })
  return (
    <>
      <div className="w-full flex justify-between border-b border-gray-300 dark:border-gray-700 items-center gap-4 p-4 shadow-sm">
        <h5>FAKTUR</h5>
        <div className="ltr:right-6 rtl:left-6 top-4.5">
          <div className="flex justify-start gap-4">
            <ModeSwitcher />
            <CloseButton onClick={() => navigate('/sales')} />
          </div>
        </div>
      </div>
      <Tabs value={tab} onChange={(tab) => setTab(tab)}>
        <Tabs.TabList>
          <Tabs.TabNav
            value="a5"
            icon={<Printer color="currentColor" size={24} variant="Bulk" />}
          ></Tabs.TabNav>
          <Tabs.TabNav
            value="receipt"
            icon={<ReceiptText color="currentColor" size={24} variant="Bulk" />}
          ></Tabs.TabNav>
        </Tabs.TabList>
        <Tabs.TabContent value="a5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4">
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md">
              <header className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-xl font-bold">{detail?.club.name}</h1>
                  <p>
                    {detail?.club.address}, {detail?.club.city},{' '}
                    {detail?.club.state}, {detail?.club.country}
                  </p>
                  <p>
                    {detail?.club.phone}, {detail?.club.email}
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="font-bold">{detail?.invoice_code}</p>
                  <p className="font-bold">
                    {dayjs(detail?.due_date).format('DD MMM YYYY')}
                  </p>
                </div>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-bold">Invoice From :</h3>
                  <p>{detail?.member.name}</p>
                  <p>{detail?.member.address}</p>
                  <p>{detail?.member.email}</p>
                </div>
                {/* <div className="text-right">
                  <h3 className="font-bold">Salesman</h3>
                  <p>{detail?.salesName}</p>
                </div> */}
              </div>

              <div className="overflow-hidden mb-4">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left bg-[#C7E4F9]">
                        Plan
                      </th>
                      <th className="py-2 px-4 border-b text-left bg-[#C7E4F9]">
                        Qty
                      </th>
                      <th className="py-2 px-4 border-b text-left bg-[#C7E4F9]">
                        Price
                      </th>
                      <th className="py-2 px-4 border-b text-left bg-[#C7E4F9]">
                        Disc
                      </th>
                      <th className="py-2 px-4 border-b text-left bg-[#C7E4F9]">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail?.items.map((item, index) => {
                      const extras = [
                        item.fduration,
                        ...(item.session_duration > 0
                          ? [`Ss : ${item.session_duration}`]
                          : []),
                        `${dayjs(item.start_date).format('DD MMM YYYY')} - ${dayjs(item.end_date).format('DD MMM YYYY')}`,
                      ]
                      return (
                        <tr key={index}>
                          <td className="py-2 px-4 border-b">
                            <span className="font-semibold">{item.name}</span>
                            {item.item_type === 'package' && (
                              <div className="flex flex-col">
                                <div className="text-sm text-gray-500">
                                  {extras.join(' | ')}
                                </div>
                                {item.package?.type === 'pt_program' && (
                                  <div className="text-sm text-gray-500">
                                    {`Trainer : ${item.trainer?.name}`}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {item.quantity}
                          </td>
                          <td className="py-2 px-4 border-b">{item.fprice}</td>
                          <td className="py-2 px-4 border-b">
                            {item.fdiscount}
                          </td>
                          <td className="py-2 px-4 border-b">{item.ftotal}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h6 className="text-lg mb-1 font-bold">
                    Payment Information :
                  </h6>
                  {detail?.payments.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.rekening_name}:</span>
                      <span>{item.famount}</span>
                    </div>
                  ))}
                  <h6 className="text-lg my-1 font-bold">Point Earned :</h6>
                  <p>0 Point</p>
                </div>
                <div></div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-bold">Sub Total</span>
                    <span className="font-bold">{detail?.fsubtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>{detail?.fdiscount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{detail?.ftax_amount}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Grand Total</span>
                    <span>{detail?.fgrand_total}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Return</span>
                    <span>{detail?.freturn_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outstanding</span>
                    <span>{detail?.foutstanding_amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-6 my-4 w-full">
                <div className="flex-1"></div>
                <div className="w-[9rem] text-center">
                  <span className="font-bold">Salesman</span>
                  <div className="h-16 border-b border-gray-400 mt-2"></div>
                </div>
                <div className="w-[9rem] text-center">
                  <span className="font-bold">Admin</span>
                  <div className="h-16 border-b border-gray-400 mt-2"></div>
                </div>
                <div className="w-[9rem] text-center">
                  <span className="font-bold">Member</span>
                  <div className="h-16 border-b border-gray-400 mt-2"></div>
                </div>
              </div>

              <div className="border border-gray-200 p-4 rounded-xl">
                <h3 className="font-bold">Terms & Condition :</h3>
                <ol className="list-decimal ml-5 text-sm">
                  <li>
                    Keanggotaan tidak dapat dipindathangankan dan tidak dapat
                    dikembalikan.
                  </li>
                  <li>
                    Paket dan sesi tidak dapat dikembalikan atau
                    dipindathangankan.
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

              <footer className="text-center mt-4">
                <p>
                  Thank you for purchasing the plan program, have a nice day!
                </p>
              </footer>
            </div>
          </div>
        </Tabs.TabContent>
        <Tabs.TabContent value="receipt">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4">
            receipt
          </div>
        </Tabs.TabContent>
      </Tabs>
    </>
  )
}

export default SaleDetail
