import { Button } from '@/components/ui'
import { Dialog } from '@/components/ui/Dialog'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { SettingsType } from '@/services/api/@types/settings/settings'
import { CreateTaxCalculateType } from '@/services/api/@types/settings/taxes'
import { apiCreateOrUpdateTaxCalculate } from '@/services/api/settings/TaxesService'
import classNames from '@/utils/classNames'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import { TaxCalculationType } from './types'

type DialogTaxCalculationProps = {
  settingsData?: SettingsType
  open: boolean
  onClose: () => void
}

const DialogTaxCalculation: React.FC<DialogTaxCalculationProps> = ({
  settingsData,
  open,
  onClose,
}) => {
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculationType>(0)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (open && settingsData && settingsData.tax_calculation !== undefined) {
      console.log('Setting tax calculation to:', settingsData.tax_calculation)
      setTaxCalculation(settingsData.tax_calculation as TaxCalculationType)
    }
  }, [open, settingsData])

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.settings] })
    onClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateTaxCalculateType) =>
      apiCreateOrUpdateTaxCalculate(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })
  return (
    <Dialog
      isOpen={open}
      width={700}
      onClose={() => onClose()}
      onRequestClose={onClose}
    >
      <div className="flex flex-col h-full justify-between">
        <h6 className="text-xl font-bold mb-1">Perhitungan Pajak</h6>

        <div className="flex flex-col gap-8 my-8">
          <div
            className={classNames(
              'flex items-start gap-4 p-6 border rounded-lg cursor-pointer',
              taxCalculation === 1
                ? 'border-primary bg-primary/5'
                : 'border-gray-200'
            )}
            onClick={() => setTaxCalculation(1)}
          >
            <div
              className={classNames(
                'w-6 h-6 rounded-full flex items-center justify-center',
                taxCalculation === 1
                  ? 'bg-primary text-white'
                  : 'border border-gray-300'
              )}
            >
              {taxCalculation === 1 && <FiCheck size={16} />}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                Harga Retail Termasuk Pajak
              </div>
              <div className="text-gray-900 dark:text-gray-100">
                Pajak = (Tarif Pajak * Harga retail) / (1 + Tarif Pajak)
              </div>
              <div className="text-gray-900 dark:text-gray-100">
                Misalnya: pajak 20% untuk item $10,00 menjadi $1,67
              </div>
            </div>
          </div>

          <div
            className={classNames(
              'flex items-start gap-4 p-6 border rounded-lg cursor-pointer',
              taxCalculation === 0
                ? 'border-primary bg-primary/5'
                : 'border-gray-200'
            )}
            onClick={() => setTaxCalculation(0)}
          >
            <div
              className={classNames(
                'w-6 h-6 rounded-full flex items-center justify-center',
                taxCalculation === 0
                  ? 'bg-primary text-white'
                  : 'border border-gray-300'
              )}
            >
              {taxCalculation === 0 && <FiCheck size={16} />}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                Harga Retail Tidak Termasuk Pajak (Default)
              </div>
              <div className="text-gray-900 dark:text-gray-100">
                Pajak = Tarif Pajak * Harga retail
              </div>
              <div className="text-gray-900 dark:text-gray-100">
                Misalnya: pajak 20% untuk item $10,00 menjadi $2,00
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onClose()}
          >
            Batal
          </Button>
          <Button
            variant="solid"
            className="flex-1"
            onClick={() => {
              create.mutate({ tax_calculation: taxCalculation })
            }}
          >
            Simpan
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default DialogTaxCalculation
