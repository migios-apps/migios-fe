import { apiCreateNewSubscription } from '@/services/api/ClubService'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { Button, Dialog } from '../ui'

type AlertDialogExpiredSubscriptionProps = {
  clubId?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  showCloseButton?: boolean
}

const AlertDialogExpiredSubscription: React.FC<
  AlertDialogExpiredSubscriptionProps
> = ({ open, onOpenChange, clubId, showCloseButton = false }) => {
  const newSubscription = useMutation({
    mutationFn: apiCreateNewSubscription,
    onSuccess: () => {
      window.location.reload()
    },
    onError: () => {
      onOpenChange(false)
    },
  })

  const handleCreateNewSubscription = () => {
    if (!clubId) return

    newSubscription.mutate({
      club_id: clubId,
      duration: 7,
      duration_type: 'day',
      plan_type: 'free',
    })
  }

  return (
    <>
      <Dialog
        isOpen={open}
        closable={showCloseButton}
        shouldCloseOnOverlayClick={showCloseButton}
        shouldCloseOnEsc={showCloseButton}
        onClose={() => onOpenChange(false)}
        onRequestClose={() => onOpenChange(false)}
      >
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Langganan Tidak Aktif
          </h3>

          {/* Message */}
          <div className="text-gray-600 dark:text-gray-300 mb-6 space-y-2">
            <p className="text-sm text-left max-w-sm mx-auto space-y-1">
              Maaf, langganan Anda saat ini tidak aktif dan tidak dapat
              mengakses fitur ini. Hal ini dapat terjadi karena:
            </p>
            <ul className="text-sm text-left max-w-sm mx-auto space-y-1">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Masa langganan telah berakhir (expired)
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Pembayaran tertunda atau gagal
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                Akun sedang dalam peninjauan
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="solid"
              disabled={newSubscription.isPending}
              loading={newSubscription.isPending}
              onClick={handleCreateNewSubscription}
            >
              Perpanjang Langganan 7 Hari
            </Button>
          </div>

          {/* Contact Support */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Butuh bantuan?
              <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ml-1 underline">
                Hubungi Support
              </button>
            </p>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default AlertDialogExpiredSubscription
