import { Button, Dialog, Form, FormItem, Input, Select } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { ChangeStatusCuttingSession } from '@/services/api/@types/cutting-session'
import { apiChangeStatusCuttingSession } from '@/services/api/CuttingSessionService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import {
  ChangeStatusFormSchema,
  useChangeStatusForm,
} from './changeStatusValidation'

type FormChangeStatusProps = {
  open: boolean
  onClose: () => void
}

const FormChangeStatus: React.FC<FormChangeStatusProps> = ({
  open,
  onClose,
}) => {
  const queryClient = useQueryClient()
  const formProps = useChangeStatusForm()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = formProps

  const changeStatus = useMutation({
    mutationFn: (data: ChangeStatusCuttingSession) =>
      apiChangeStatusCuttingSession(data.id as number, {
        status: data.status,
        notes: data.notes || null,
      }),
    onError: (error) => {
      console.log('error change status', error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.cuttingSessions] })
      handleClose()
    },
  })

  const handleClose = () => {
    reset({
      id: 0,
      status: 0,
      notes: null,
    })
    onClose()
  }

  const onSubmit: SubmitHandler<ChangeStatusFormSchema> = (data) => {
    changeStatus.mutate({
      id: data.id,
      status: data.status,
      notes: data.notes || null,
    })
  }

  const statusOptions = [
    { label: 'Approved', value: 1 },
    { label: 'Rejected', value: 2 },
  ]

  return (
    <Dialog
      scrollBody
      width={500}
      isOpen={open}
      onClose={handleClose}
      onRequestClose={handleClose}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h5 className="mb-4">Change Status</h5>
        <div className="">
          <FormItem
            asterisk
            label="Status"
            invalid={Boolean(errors.status)}
            errorMessage={errors.status?.message}
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  isSearchable={false}
                  placeholder="Select Status"
                  value={statusOptions.find((opt) => opt.value === field.value)}
                  options={statusOptions}
                  onChange={(option) => {
                    field.onChange(option?.value || 0)
                  }}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Notes"
            className="w-full mb-2"
            invalid={Boolean(errors.notes)}
            errorMessage={errors.notes?.message}
          >
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input
                  textArea
                  type="text"
                  autoComplete="off"
                  placeholder="Notes"
                  {...field}
                  value={field.value || ''}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="text-right mt-6 flex justify-end items-center gap-2">
          <Button variant="plain" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="solid"
            type="submit"
            loading={changeStatus.isPending}
          >
            Change Status
          </Button>
        </div>
      </Form>
    </Dialog>
  )
}

export default FormChangeStatus
