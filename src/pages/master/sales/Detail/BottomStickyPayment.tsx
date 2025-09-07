import { Container } from '@/components/shared'
import { Button, Dropdown } from '@/components/ui'
import classNames from '@/utils/classNames'
import { ArrowDown2 } from 'iconsax-react'
import React from 'react'
import { useWatch } from 'react-hook-form'
import { usePaymentForm } from './validation'

interface BottomStickyPaymentProps {
  detail: any
  onSubmit: (data: any) => void
  isPending: boolean
}

const BottomStickyPayment: React.FC<BottomStickyPaymentProps> = ({
  detail,
  onSubmit,
  isPending,
}) => {
  const [openDropdown, setOpenDropdown] = React.useState(false)

  // Menggunakan form validasi payment
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    setError,
  } = usePaymentForm()

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

  const getTotal = detail
    ? (detail.total_amount || 0) -
      (detail.payments?.reduce((acc: any, cur: any) => acc + cur.amount, 0) ||
        0)
    : 0
  const isPaidOf = detail
    ? (detail.payments?.reduce((acc: any, cur: any) => acc + cur.amount, 0) ||
        0) >= (detail.total_amount || 0)
    : false

  // Handler untuk check part paid
  const handleCheck = (data: any) => {
    onSubmit({ ...data, isPaid: 2 })
  }

  // Watch untuk payments
  const watchPayments = useWatch({
    control,
    name: 'payments',
  })
  return (
    <>
      <div className="w-full bg-white dark:bg-gray-800 fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <Container>
          <div className="flex items-center justify-between px-8">
            <div></div>
            <div className="flex flex-col md:flex-row md:justify-between items-start gap-2">
              <Dropdown
                toggleClassName="w-full md:w-5/12"
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
                {watch('payments')?.length > 0 && !isPaidOf ? (
                  <Dropdown.Item
                    eventKey="part_paid"
                    onClick={handleSubmit(handleCheck)}
                  >
                    Simpan sebagai Part Paid
                  </Dropdown.Item>
                ) : null}
                <Dropdown.Item
                  eventKey="unpaid"
                  onClick={handleSubmit((data) => {
                    onSubmit({ ...data, isPaid: 0, payments: [] })
                  })}
                >
                  Simpan tanpa bayar
                </Dropdown.Item>
              </Dropdown>
              <Button
                className="rounded-full"
                variant="solid"
                loading={isPending}
                disabled={getTotal > 0}
                onClick={handleSubmit((data) =>
                  onSubmit({ ...data, isPaid: 1 })
                )}
              >
                Update Pesanan
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default BottomStickyPayment
