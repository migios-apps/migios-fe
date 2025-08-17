import { Button, Checkbox, Dialog, Table } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import {
  CreateTaxDefaultSaleItemType,
  TaxesType,
} from '@/services/api/@types/settings/taxes'
import { apiCreateOrUpdateDefaultTaxSaleItem } from '@/services/api/settings/TaxesService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { TaxType } from './types'
import {
  CreateStandardRateSchema,
  ReturnStandardRateFormSchema,
  resetStandardRateForm,
} from './validation'

type DialogTaxesDefaultProps = {
  taxTypes: TaxType[]
  taxRates: TaxesType[]
  formProps: ReturnStandardRateFormSchema
  open: boolean
  onClose: () => void
}

const DialogTaxesDefault: React.FC<DialogTaxesDefaultProps> = ({
  taxTypes,
  taxRates,
  formProps,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient()
  const { handleSubmit, setValue } = formProps
  const watchStandardRates = formProps.watch('standardRates')

  // Fungsi untuk mengubah tax_id pada draftRates (tidak mengubah data asli)
  const handleCheck = (taxId: number, type: string, checked: boolean) => {
    if (checked) {
      const existingIndex = watchStandardRates.findIndex(
        (rate) => rate.type === type && rate.tax_id === taxId
      )

      if (existingIndex === -1) {
        const newDraftRates = [...watchStandardRates, { type, tax_id: taxId }]
        setValue('standardRates', newDraftRates)
      }
    } else {
      const newDraftRates = watchStandardRates.filter(
        (rate) => !(rate.type === type && rate.tax_id === taxId)
      )
      setValue('standardRates', newDraftRates)
    }
  }

  // Fungsi untuk select all tipe pajak untuk tax tertentu
  const handleSelectAllForTax = (taxId: number, checked: boolean) => {
    if (checked) {
      // Tambahkan semua tipe untuk tax_id ini
      const newRates = taxTypes.map((type) => ({
        type: type.key,
        tax_id: taxId,
      }))
      const existingRates = watchStandardRates.filter(
        (rate) => rate.tax_id !== taxId
      )
      setValue('standardRates', [...existingRates, ...newRates])
    } else {
      // Hapus semua tipe untuk tax_id ini
      const newRates = watchStandardRates.filter(
        (rate) => rate.tax_id !== taxId
      )
      setValue('standardRates', newRates)
    }
  }

  // Check apakah semua tipe sudah dipilih untuk tax tertentu
  const isAllSelectedForTax = (taxId: number) => {
    return taxTypes.every((type) =>
      watchStandardRates.some(
        (rate) => rate.tax_id === taxId && rate.type === type.key
      )
    )
  }

  const handleClose = () => {
    resetStandardRateForm(formProps)
    onClose()
  }

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.taxDefaultSaleItem] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateTaxDefaultSaleItemType) =>
      apiCreateOrUpdateDefaultTaxSaleItem(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit = (data: CreateStandardRateSchema) => {
    create.mutate({
      items: data.standardRates,
    })
  }

  return (
    <Dialog
      scrollBody
      isOpen={open}
      width={620}
      onClose={onClose}
      onRequestClose={onClose}
    >
      <div className="flex flex-col h-full justify-between">
        <h6 className="text-xl font-bold mb-1">Standar Pajak</h6>
        <div className="text-gray-900 dark:text-gray-100 mb-6">
          Pajak default untuk membership, pt program, dan class
        </div>
        <div className="overflow-x-auto">
          <Table cellBorder>
            <Table.THead>
              <Table.Tr>
                <Table.Th>All</Table.Th>
                <Table.Th>Pajak</Table.Th>
                {taxTypes.map((t) => (
                  <Table.Th key={t.key}>{t.label}</Table.Th>
                ))}
              </Table.Tr>
            </Table.THead>
            <Table.TBody>
              {taxRates.map((tax, idx) => (
                <Table.Tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  <Table.Td className="text-center">
                    <Checkbox
                      checked={isAllSelectedForTax(tax.id)}
                      onChange={(val) => handleSelectAllForTax(tax.id, val)}
                    />
                  </Table.Td>
                  <Table.Td>{tax.name}</Table.Td>
                  {taxTypes.map((t) => (
                    <Table.Td key={t.key} className="text-center">
                      <Checkbox
                        checked={
                          !!watchStandardRates.find(
                            (rate) =>
                              rate.tax_id === tax.id && rate.type === t.key
                          )
                        }
                        onChange={(val) => handleCheck(tax.id, t.key, val)}
                      />
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.TBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-8 gap-4">
          <Button className="w-1/2" variant="default" onClick={onClose}>
            Batal
          </Button>
          <Button
            className="w-1/2"
            variant="solid"
            loading={create.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Simpan
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export default DialogTaxesDefault
