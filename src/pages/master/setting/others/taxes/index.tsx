import Loading from '@/components/shared/Loading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import classNames from '@/components/ui/utils/classNames'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { TaxDefaultSaleItemType } from '@/services/api/@types/settings/taxes'
import {
  apiGetDefaultTaxSaleItem,
  apiGetTaxList,
} from '@/services/api/settings/TaxesService'
import { apiGetSettings } from '@/services/api/settings/settings'
import { useQuery } from '@tanstack/react-query'
import { Danger } from 'iconsax-react'
import React, { useState } from 'react'
import LayoutOtherSetting from '../Layout'
import DialogFormTax from './DialogFormTax'
import DialogTaxCalculation from './DialogTaxCalculation'
import DialogTaxesDefault from './DialogTaxesDefault'
import { useStandardRateForm, useTaxForm } from './validation'

// Tipe data
type TaxRate = {
  id: number
  name: string
  rate: number
  enabled: boolean
}

type TaxType = {
  key: string
  label: string
}

// Konstanta
const TAX_RATES: TaxRate[] = [
  { id: 1, name: 'PPn', rate: 11, enabled: true },
  { id: 2, name: 'PPn 2', rate: 10, enabled: true },
  { id: 3, name: 'Ppn2', rate: 10, enabled: true },
]

const TAX_TYPES: TaxType[] = [
  { key: 'membership', label: 'Membership' },
  { key: 'pt_program', label: 'PT Program' },
  { key: 'class', label: 'Kelas' },
  // { key: 'service', label: 'Service' },
]

// Data standar pajak
const DEFAULT_STANDARD_RATES: TaxDefaultSaleItemType[] = [
  { type: 'membership', tax_id: 2 },
  { type: 'pt_program', tax_id: 2 },
  { type: 'class', tax_id: 2 },
  { type: 'service', tax_id: 2 },
  { type: 'membership', tax_id: 1 },
  // { type: 'pt_program', tax_id: 1 },
]

// Fungsi untuk mendapatkan label pajak berdasarkan tipe
const getStandardTaxLabel = (
  type: string,
  taxData: TaxRate[],
  standardRates: TaxDefaultSaleItemType[]
): string | React.ReactElement => {
  const relatedRates = standardRates.filter((s) => s.type === type)

  if (relatedRates.length === 0) {
    return <Badge content="No Taxes" className="bg-gray-200 text-gray-500" />
  }

  const taxDetails = relatedRates
    .map((rate) => {
      const tax = taxData.find((t) => t.id === rate.tax_id)
      return tax ? `${tax.name} (${tax.rate}%)` : null
    })
    .filter(Boolean)

  return taxDetails.length > 0 ? (
    taxDetails.join(', ')
  ) : (
    <Badge content="No Taxes" className="bg-gray-200 text-gray-500" />
  )
}

const TaxSetting = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [openTaxDialog, setOpenTaxDialog] = useState(false)
  const [taxDialogType, setTaxDialogType] = useState<'create' | 'update'>(
    'create'
  )
  const [openCalcDialog, setOpenCalcDialog] = useState(false)

  const taxFormProps = useTaxForm()

  const standardRateFormProps = useStandardRateForm()

  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: [QUERY_KEY.settings],
    queryFn: () => apiGetSettings(),
    select: (res) => res.data,
  })

  const { data: taxData, isLoading: taxLoading } = useQuery({
    queryKey: [QUERY_KEY.taxList],
    queryFn: () => apiGetTaxList(),
    select: (res) => res.data,
  })

  const { data: defaultTaxData, isLoading: defaultTaxLoading } = useQuery({
    queryKey: [QUERY_KEY.taxDefaultSaleItem],
    queryFn: () => apiGetDefaultTaxSaleItem(),
    select: (res) => res.data,
  })

  return (
    <LayoutOtherSetting>
      <Loading loading={settingsLoading || taxLoading || defaultTaxLoading}>
        <div className="space-y-6 relative max-w-3xl mx-auto">
          <Card>
            <div className="flex flex-col md:flex-row items-center justify-between w-full">
              <div>
                <h6 className="text-xl font-bold">Penghitungan Pajak</h6>
                <span className="text-gray-900 dark:text-gray-100 text-sm mt-1">
                  {settingsData?.tax_calculation === 1
                    ? 'Harga retail anda sudah termasuk pajak'
                    : 'Harga retail anda belum termasuk pajak'}
                </span>
              </div>
              <Button
                size="sm"
                variant="plain"
                className="text-primary font-semibold"
                onClick={() => setOpenCalcDialog(true)}
              >
                Ganti
              </Button>
            </div>
          </Card>

          <Card
            header={{
              content: (
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
                  <h6 className="text-xl font-bold">Tarif Pajak</h6>
                  <Button
                    size="sm"
                    onClick={() => {
                      setOpenTaxDialog(true)
                      setTaxDialogType('create')
                    }}
                  >
                    Tambah
                  </Button>
                </div>
              ),
              bordered: false,
            }}
            className=""
            bodyClass="pt-0"
          >
            <div className="flex flex-col">
              {taxData && taxData.length > 0 ? (
                taxData.map((tax, index) => (
                  <div
                    key={tax.id}
                    className={classNames(
                      `flex flex-wrap items-center justify-between py-4 px-2 gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer`,
                      index === taxData.length - 1
                        ? ''
                        : 'border-b border-gray-200 dark:border-gray-700'
                    )}
                    onClick={() => {
                      taxFormProps.setValue('id', tax.id)
                      taxFormProps.setValue('name', tax.name)
                      taxFormProps.setValue('rate', tax.rate)
                      setTaxDialogType('update')
                      setOpenTaxDialog(true)
                    }}
                  >
                    <span className="font-bold mr-2 text-gray-900 dark:text-gray-100">
                      {tax.name}
                    </span>
                    <span className="flex-shrink-0 md:text-right font-medium text-gray-900 dark:text-gray-100">
                      {tax.rate} %
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="text-5xl mb-4 text-gray-900 dark:text-gray-200">
                    <Danger color="currentColor" size="64" variant="Outline" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Tidak ada tarif pajak
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-200 mt-1">
                    Klik tombol Tambah untuk menambahkan tarif pajak baru
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card
            header={{
              content: (
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Tarif Pajak Standar
                    </span>
                    <div className="text-gray-900 dark:text-gray-100 text-sm mt-1 md:mt-0">
                      Anda masih dapat menimpa default dalam pengaturan produk,
                      layanan, dan kelas individu
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      standardRateFormProps.setValue(
                        'standardRates',
                        defaultTaxData || []
                      )
                      setOpenDialog(true)
                    }}
                  >
                    Atur Standar Pajak
                  </Button>
                </div>
              ),
              bordered: false,
            }}
            className=""
            bodyClass="pt-0"
          >
            <div className="flex flex-col">
              {TAX_TYPES.map((type, index) => (
                <div
                  key={type.key}
                  className={classNames(
                    `flex flex-wrap items-center justify-between py-4 px-2 gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors`,
                    index === TAX_TYPES.length - 1
                      ? ''
                      : 'border-b border-gray-200 dark:border-gray-700'
                  )}
                >
                  <span className="font-bold mr-2 text-gray-900 dark:text-gray-100">
                    {type.label}
                  </span>
                  <span className="flex-shrink-0 md:text-right text-gray-900 dark:text-gray-100">
                    {getStandardTaxLabel(
                      type.key,
                      taxData || [],
                      defaultTaxData || []
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <DialogTaxCalculation
            settingsData={settingsData}
            open={openCalcDialog}
            onClose={() => setOpenCalcDialog(false)}
          />

          <DialogTaxesDefault
            taxTypes={TAX_TYPES}
            taxRates={taxData || []}
            formProps={standardRateFormProps}
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          />

          <DialogFormTax
            type={taxDialogType}
            formProps={taxFormProps}
            open={openTaxDialog}
            onClose={() => setOpenTaxDialog(false)}
          />
        </div>
      </Loading>
    </LayoutOtherSetting>
  )
}

export default TaxSetting
