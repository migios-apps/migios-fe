import { Card, Form, FormItem, Input, Select } from '@/components/ui'
import React, { useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { FaPen } from 'react-icons/fa'
import { FiRefreshCw, FiX } from 'react-icons/fi'
import LayoutOtherSetting from '../Layout'
import SignatureCanvas from './SignatureCanvas'
import {
  TemplateKey,
  getTemplateComponent,
  getTemplateOptions,
} from './templates'
import { CreateInvoiceFormSchema, useInvoiceForm } from './validations'

// Signature Modal Component
interface SignatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (signature: string) => void
  title: string
  existingSignature?: string
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  existingSignature,
}) => {
  const handleSave = (signature: string) => {
    onSave(signature)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <SignatureCanvas
          existingSignature={existingSignature}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}

const InvoiceDesigner = () => {
  const [jsonOutput, setJsonOutput] = useState<string>('')
  const [showJson, setShowJson] = useState(false)
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateKey>('default')
  const [signatures, setSignatures] = useState<{
    sales: string
    admin: string
    member: string
  }>({
    sales: '',
    admin: '',
    member: '',
  })
  const [signatureModal, setSignatureModal] = useState<{
    isOpen: boolean
    type: 'sales' | 'admin' | 'member'
    title: string
  }>({
    isOpen: false,
    type: 'sales',
    title: '',
  })

  const defaultValues = {
    companyName: 'Company Name',
    companyAddress: 'Ruko Royal Plaza, Gn Anyar, Surabaya',
    invoiceTo: 'John Doe',
    invoiceToAddress: '814 Howard Street, 120065, India',
    invoiceNumber: 'INV2024072501',
    invoiceDate: 'Thursday, 23-May-2024',
    salesName: 'Ayunda',
    items: [
      {
        description: 'Membership Semester',
        qty: 1,
        unitPrice: 3000000,
        discount: 500000,
      },
    ],
    paymentMethod: 'BCA',
    paymentAmount: 1775000,
    outstanding: 1000000,
    termCondition: '',
    template: 'minimalist' as TemplateKey,
  }

  const invoiceForm = useInvoiceForm(defaultValues)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = invoiceForm

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const watchedValues = watch()

  const onSubmit = (data: CreateInvoiceFormSchema) => {
    // Menghitung subtotal
    const subTotal =
      data.items?.reduce(
        (sum, item) =>
          sum +
          ((item.qty || 0) * (item.unitPrice || 0) - (item.discount || 0)),
        0
      ) || 0

    // Menghitung pajak (11%)
    const tax = subTotal * 0.11

    // Menghitung total keseluruhan
    const grandTotal = subTotal + tax

    const outputData = {
      ...data,
      signatures,
      subTotal,
      tax,
      grandTotal,
    }
    setJsonOutput(JSON.stringify(outputData, null, 2))
    setShowJson(true)
  }

  const openSignatureModal = (type: 'sales' | 'admin' | 'member') => {
    const titles = {
      sales: 'Sales Signature',
      admin: 'Admin Signature',
      member: 'Member Signature',
    }
    setSignatureModal({
      isOpen: true,
      type,
      title: titles[type],
    })
  }

  const closeSignatureModal = () => {
    setSignatureModal((prev) => ({ ...prev, isOpen: false }))
  }

  const saveSignature = (signature: string) => {
    setSignatures((prev) => ({
      ...prev,
      [signatureModal.type]: signature,
    }))
  }

  const toggleView = () => {
    setShowJson(!showJson)
  }

  if (showJson) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            JSON Output
          </h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={toggleView}
          >
            <FiRefreshCw className="w-4 h-4" />
            Back to Designer
          </button>
        </div>
        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm text-gray-800 dark:text-gray-200">
          {jsonOutput}
        </pre>
      </div>
    )
  }

  return (
    <LayoutOtherSetting>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Preview */}
        <div className="lg:col-span-2">
          {React.createElement(getTemplateComponent(selectedTemplate), {
            data: watchedValues,
            signatures: signatures,
          })}
        </div>

        {/* Design Controls */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Design Invoice Here
            </h2>

            <div className="flex flex-col gap-4">
              {/* Company name */}
              <FormItem
                label="Company Name"
                className="mb-0"
                invalid={Boolean(errors.companyName)}
                errorMessage={errors.companyName?.message}
              >
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Company Name" />
                  )}
                />
              </FormItem>
              {/* company address */}
              <FormItem
                label="Company Address"
                className="mb-0"
                invalid={Boolean(errors.companyAddress)}
                errorMessage={errors.companyAddress?.message}
              >
                <Controller
                  name="companyAddress"
                  control={control}
                  render={({ field }) => (
                    <Input textArea {...field} placeholder="Company Address" />
                  )}
                />
              </FormItem>
              {/* Identity Member */}
              <FormItem
                label="Invoice to"
                className="mb-0"
                invalid={Boolean(errors.invoiceTo)}
                errorMessage={errors.invoiceTo?.message}
              >
                <Controller
                  name="invoiceTo"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Invoice to" />
                  )}
                />
              </FormItem>

              {/* Invoice Number */}
              <FormItem
                label="Invoice No"
                className="mb-0"
                invalid={Boolean(errors.invoiceNumber)}
                errorMessage={errors.invoiceNumber?.message}
              >
                <Controller
                  name="invoiceNumber"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Input {...field} placeholder="Invoice No" />
                    </div>
                  )}
                />
              </FormItem>

              {/* Invoice Date */}
              <FormItem
                label="Date"
                className="mb-0"
                invalid={Boolean(errors.invoiceDate)}
                errorMessage={errors.invoiceDate?.message}
              >
                <Controller
                  name="invoiceDate"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Input {...field} placeholder="Invoice Date" />
                    </div>
                  )}
                />
              </FormItem>

              {/* Sales */}
              <FormItem
                label="Sales Name"
                className="mb-0"
                invalid={Boolean(errors.salesName)}
                errorMessage={errors.salesName?.message}
              >
                <Controller
                  name="salesName"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Input {...field} placeholder="Sales Name" />
                    </div>
                  )}
                />
              </FormItem>

              {/* Invoice Term & Condition */}
              <FormItem
                label="Terms & Condition"
                invalid={!!errors.termCondition}
                errorMessage={errors.termCondition?.message}
              >
                <Controller
                  name="termCondition"
                  control={control}
                  render={({ field }) => (
                    <Input
                      textArea
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      {...field}
                    />
                  )}
                />
              </FormItem>

              <FormItem
                label="Template Invoice"
                invalid={!!errors.template}
                errorMessage={errors.template?.message}
              >
                <Controller
                  name="template"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <Select
                      options={getTemplateOptions()}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      value={getTemplateOptions().find(
                        (option) => option.value === value
                      )}
                      onChange={(option: any) => {
                        onChange(option.value)
                        setSelectedTemplate(option.value as TemplateKey)
                      }}
                      {...rest}
                    />
                  )}
                />
              </FormItem>

              {/* Signatures */}
              <FormItem label="Sales Signature" className="mb-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2 border rounded text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    {signatures.sales ? (
                      <img
                        src={signatures.sales}
                        alt="Sales signature"
                        className="h-8 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No signature
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => openSignatureModal('sales')}
                  >
                    <FaPen className="w-4 h-4" />
                  </button>
                </div>
              </FormItem>

              <FormItem label="Admin Signature" className="mb-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2 border rounded text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    {signatures.admin ? (
                      <img
                        src={signatures.admin}
                        alt="Admin signature"
                        className="h-8 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No signature
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => openSignatureModal('admin')}
                  >
                    <FaPen className="w-4 h-4" />
                  </button>
                </div>
              </FormItem>

              <FormItem label="Member Signature" className="mb-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2 border rounded text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    {signatures.member ? (
                      <img
                        src={signatures.member}
                        alt="Member signature"
                        className="h-8 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No signature
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => openSignatureModal('member')}
                  >
                    <FaPen className="w-4 h-4" />
                  </button>
                </div>
              </FormItem>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Signature Modal */}
            <SignatureModal
              isOpen={signatureModal.isOpen}
              title={signatureModal.title}
              existingSignature={signatures[signatureModal.type]}
              onClose={closeSignatureModal}
              onSave={saveSignature}
            />
          </Card>
        </Form>
      </div>
    </LayoutOtherSetting>
  )
}

export default InvoiceDesigner
