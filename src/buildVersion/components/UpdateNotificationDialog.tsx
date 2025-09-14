import React from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'

interface UpdateNotificationDialogProps {
  isOpen: boolean
  onClose: () => void
  onRefresh: () => Promise<void>
}

const UpdateNotificationDialog: React.FC<UpdateNotificationDialogProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  const handleRefresh = async () => {
    await onRefresh()
  }

  return (
    <Dialog
      isOpen={isOpen}
      width={400}
      closable={false}
      onRequestClose={onClose}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Update Tersedia
            </h3>
            <p className="text-sm text-gray-600">
              Versi baru aplikasi telah tersedia
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            Aplikasi telah diperbarui dengan fitur dan perbaikan terbaru.
            Silakan refresh halaman untuk mendapatkan versi terbaru.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="default"
            size="sm"
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200"
            onClick={onClose}
          >
            Nanti Saja
          </Button>
          <Button
            variant="solid"
            size="sm"
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleRefresh}
          >
            Refresh Sekarang
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default UpdateNotificationDialog
