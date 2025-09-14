import { Container } from '@/components/shared'
import { Button, Dropdown } from '@/components/ui'
import { SalesDetailType } from '@/services/api/@types/sales'
import classNames from '@/utils/classNames'
import { ArrowDown2 } from 'iconsax-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePaymentForm } from './validation'

interface BottomStickyPaymentProps {
  detail: SalesDetailType | null
}

const BottomStickyPayment: React.FC<BottomStickyPaymentProps> = ({
  detail,
}) => {
  const navigate = useNavigate()
  const [openDropdown, setOpenDropdown] = React.useState(false)

  // Menggunakan form validasi payment
  const { setValue } = usePaymentForm()

  // Inisialisasi form dengan data dari API saat detail berubah
  React.useEffect(() => {
    if (detail) {
      setValue('balance_amount', detail.ballance_amount || 0)
      // Konversi payments ke format yang sesuai dengan skema validasi
      const formattedPayments = detail.payments
        ? detail.payments.map((payment: any) => ({
            id: payment.id,
            name: payment.rekening_name || '',
            amount: payment.amount || 0,
          }))
        : []
      setValue('payments', formattedPayments)
      setValue('isPaid', detail.is_paid || 0)
    }
  }, [detail, setValue])

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-800 fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <Container>
          <div className="flex items-center justify-between px-8">
            <div></div>
            <div className="flex flex-col md:flex-row md:justify-between items-start gap-2">
              {detail ? (
                <>
                  <Dropdown
                    toggleClassName="w-full"
                    renderTitle={
                      <Button
                        className={classNames('rounded-full w-full', {
                          'text-primary border-primary': openDropdown,
                        })}
                        variant="default"
                        icon={
                          <ArrowDown2
                            color="currentColor"
                            size={16}
                            className={classNames(
                              'ml-1 transition-transform duration-300',
                              {
                                'rotate-180': openDropdown,
                              }
                            )}
                          />
                        }
                        iconAlignment="end"
                      >
                        Lainnya
                      </Button>
                    }
                    onOpen={setOpenDropdown}
                  >
                    {/* {[0].includes(detail?.is_paid) ? (
                      <Dropdown.Item
                        eventKey="change_unpaid"
                        className="text-green-500"
                        onClick={() => navigate(`/sales/${detail?.code}/edit`)}
                      >
                        Ubah unpaid faktur
                      </Dropdown.Item>
                    ) : null} */}
                    {[1].includes(detail?.is_paid) ? (
                      <Dropdown.Item
                        eventKey="canceled"
                        className="text-red-500"
                        onClick={() => navigate(`/sales/${detail?.id}/refund`)}
                      >
                        Pengembalian
                      </Dropdown.Item>
                    ) : null}
                  </Dropdown>
                  {[0, 2, 3].includes(detail?.is_paid) ? (
                    <Button
                      className="rounded-full"
                      variant="solid"
                      onClick={() => {
                        navigate(`/sales/${detail?.code}/edit`)
                      }}
                    >
                      Bayar sekarang
                    </Button>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default BottomStickyPayment
