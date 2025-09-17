import { ScrollArea } from '@/components/shared/scroll-area'
import ModeSwitcher from '@/components/template/ThemeConfigurator/ModeSwitcher'
import { Button, Skeleton, Tabs, Tag } from '@/components/ui'
import CloseButton from '@/components/ui/CloseButton'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { paymentStatusColor } from '@/constants/utils'
import { apiGetSales } from '@/services/api/SalesService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DocumentDownload, Printer, ReceiptText } from 'iconsax-react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomStickyPayment from './BottomStickyPayment'
import InvoiceA5 from './InvoiceA5'
import InvoiceReceipt from './InvoiceReceipt'

const SaleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tab, setTab] = React.useState('a5')

  const {
    data: detail,
    isLoading,
    // error,
  } = useQuery({
    queryKey: [QUERY_KEY.sales, id],
    queryFn: () => apiGetSales(id as string),
    select: (res) => res.data,
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Skeleton height={40} width={200} className="mb-4" />
          <Skeleton height={20} width={150} />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex justify-between border-b border-gray-300 dark:border-gray-700 items-center gap-4 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <h5>FAKTUR #{detail?.code}</h5>
          <Tag className={paymentStatusColor[detail?.status || 'unpaid']}>
            <span className="capitalize">{detail?.fstatus}</span>
          </Tag>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            icon={<DocumentDownload color="currentColor" size={16} />}
            onClick={() => window.print()}
          >
            Download PDF
          </Button>
          <ModeSwitcher />
          <CloseButton onClick={() => navigate('/sales')} />
        </div>
      </div>
      {/* <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] items-start h-full"> */}
      <div className="flex flex-col w-full">
        <Tabs value={tab} onChange={(tab) => setTab(tab)}>
          <Tabs.TabList>
            <Tabs.TabNav
              value="a5"
              icon={<Printer color="currentColor" size={24} variant="Bulk" />}
            ></Tabs.TabNav>
            <Tabs.TabNav
              value="receipt"
              icon={
                <ReceiptText color="currentColor" size={24} variant="Bulk" />
              }
            ></Tabs.TabNav>
          </Tabs.TabList>
          <Tabs.TabContent value="a5">
            {detail ? (
              <ScrollArea className="h-[calc(100vh-130px)]">
                <InvoiceA5 detail={detail} />
              </ScrollArea>
            ) : null}
          </Tabs.TabContent>
          <Tabs.TabContent value="receipt">
            {detail ? (
              <ScrollArea className="h-[calc(100vh-130px)]">
                <InvoiceReceipt detail={detail} />
              </ScrollArea>
            ) : null}
          </Tabs.TabContent>
        </Tabs>
      </div>
      {/* Komponen Payment Section */}
      {/* <PaymentSection
          detail={detail}
          isPending={updateSales.isPending}
          onSubmit={onSubmit}
        /> */}
      {/* </div> */}
      {detail?.status !== 'void' && (
        <BottomStickyPayment detail={detail || null} />
      )}
    </>
  )
}

export default SaleDetail
