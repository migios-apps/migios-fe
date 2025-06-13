/* eslint-disable import/no-unresolved */
import Alert from '@/components/ui/Alert'
import toast from '@/components/ui/toast'
import { TickCircle } from 'iconsax-react'
import { useCallback, useState } from 'react'

function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      setError('Clipboard API tidak tersedia.')
      setIsCopied(false)
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setError(null)
      toast.push(
        <Alert
          showIcon
          closable
          customIcon={
            <TickCircle
              size="24"
              color="currentColor"
              className="text-white dark:text-success"
            />
          }
          type="success"
          className="bg-success/80 text-white dark:bg-gray-700 dark:text-success"
        >
          Teks berhasil disalin.
        </Alert>,
        {
          offsetX: 0,
          offsetY: 0,
          transitionType: 'fade',
          block: true,
        }
      )

      // Reset status setelah 2 detik
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      setError('Gagal menyalin teks.')
      setIsCopied(false)
      toast.push(
        <Alert
          showIcon
          closable
          customIcon={
            <TickCircle
              size="24"
              color="currentColor"
              className="text-white dark:text-error"
            />
          }
          type="danger"
          className="bg-error/80 text-white dark:bg-gray-700 dark:text-error"
        >
          Gagal menyalin teks.
        </Alert>,
        {
          offsetX: 0,
          offsetY: 0,
          transitionType: 'fade',
          block: true,
        }
      )
    }
  }, [])

  return { copy, isCopied, error }
}

export default useCopyToClipboard
