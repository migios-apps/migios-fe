/* eslint-disable react-refresh/only-export-components */

import {
  Avatar,
  Button,
  Checkbox,
  DatePicker,
  Dialog,
  Dropdown,
  Form,
  FormItem,
  Input,
  InputGroup,
  PhoneInput,
  Radio,
  Select,
  Upload,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreateEmployee } from '@/services/api/@types/employee'
import {
  apiCreateEmployee,
  apiDeleteEmployee,
  apiUpdateEmployee,
} from '@/services/api/EmployeeService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ArrowDown2, Trash, UserCirlceAdd } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import {
  CreateEmployeeSchema,
  ReturnEmployeeSchema,
  resetEmployeeForm,
} from './employeeValidation'

export const userTypeOptions = [
  { label: 'User', value: 'user' },
  { label: 'Trainer', value: 'trainer' },
]

type FormProps = {
  open: boolean
  type: 'create' | 'update'
  formProps: ReturnEmployeeSchema
  onClose: () => void
}

type OptionType = {
  value: string
  label: string
}

const FormEmployee: React.FC<FormProps> = ({
  open,
  type,
  formProps,
  onClose,
}) => {
  const queryClient = useQueryClient()
  const club = useSessionUser((state) => state.club)
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = formProps
  const watchData = watch()
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [selectedOptions, setSelectedOptions] = React.useState<OptionType[]>([])

  //   console.log('watchData', { watchData, errors })

  const handleClose = () => {
    resetEmployeeForm(formProps)
    onClose()
  }

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateEmployee) => apiCreateEmployee(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateEmployee) =>
      apiUpdateEmployee(watchData.code as string, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: string) => apiDeleteEmployee(id),
    onError: (error) => {
      console.log('error delete', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit: SubmitHandler<CreateEmployeeSchema> = (data) => {
    if (type === 'update') {
      update.mutate({
        club_id: club?.id as number,
        name: data.name,
        address: data.address,
        identity_number: data.identity_number,
        identity_type: data.identity_type,
        gender: data.gender,
        phone: data.phone,
        photo: data.photo as string | null,
        email: data.email,
        birth_date: dayjs(data.birth_date).format('YYYY-MM-DD'),
        join_date: dayjs(data.join_date).format('YYYY-MM-DD'),
        enabled: data.enabled,
        description: data.description as string | null,
        specialist: data.specialist,
        type: data.type as 'user' | 'trainer',
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        club_id: club?.id as number,
        name: data.name,
        address: data.address,
        identity_number: data.identity_number,
        identity_type: data.identity_type,
        gender: data.gender,
        phone: data.phone,
        photo: data.photo as string | null,
        email: data.email,
        birth_date: dayjs(data.birth_date).format('YYYY-MM-DD'),
        join_date: dayjs(data.join_date).format('YYYY-MM-DD'),
        enabled: data.enabled,
        description: data.description as string | null,
        specialist: data.specialist,
        type: data.type as 'user' | 'trainer',
      })
      return
    }
  }

  const handleDelete = () => {
    deleteItem.mutate(watchData.code as string)
    setConfirmDelete(false)
  }

  return (
    <>
      <Dialog
        scrollBody
        isOpen={open}
        width={620}
        onClose={handleClose}
        onRequestClose={handleClose}
      >
        <div className="flex flex-col h-full justify-between">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h5 className="mb-4">
              {type === 'create' ? 'Create Member' : 'Update Member'}
            </h5>
            <div className="w-full">
              <div className="w-full flex flex-col md:flex-row items-center gap-0 md:gap-4">
                <FormItem
                  // asterisk
                  label=""
                  invalid={Boolean(errors.photo)}
                  errorMessage={errors.photo?.message}
                  className="mx-6"
                >
                  <Controller
                    name="photo"
                    control={control}
                    render={() => (
                      <Upload
                        className="cursor-pointer"
                        showList={false}
                        uploadLimit={1}
                        // beforeUpload={beforeUpload}
                        // onChange={onFileUpload}
                      >
                        <Avatar
                          size={80}
                          //   src={avatarImg as string}
                          icon={
                            <UserCirlceAdd
                              color="currentColor"
                              size="24"
                              variant="Bold"
                            />
                          }
                        />
                      </Upload>
                    )}
                  />
                </FormItem>
                <div className="w-full">
                  <FormItem
                    asterisk
                    label="Type"
                    className="w-full"
                    invalid={Boolean(errors.type)}
                    errorMessage={errors.type?.message}
                  >
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          isSearchable={false}
                          placeholder="Please Select"
                          value={userTypeOptions.filter(
                            (option) => option.value === field.value
                          )}
                          options={userTypeOptions}
                          onChange={(option) => field.onChange(option?.value)}
                        />
                      )}
                    />
                  </FormItem>
                  <FormItem
                    asterisk
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                  >
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          autoComplete="off"
                          placeholder="Name"
                          {...field}
                        />
                      )}
                    />
                  </FormItem>
                </div>
              </div>
              <FormItem
                asterisk
                label="Email"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="email"
                      autoComplete="off"
                      placeholder="Email"
                      {...field}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Phone Number"
                invalid={Boolean(errors.phone)}
                errorMessage={errors.phone?.message}
              >
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput placeholder="+62 *** *** ***" {...field} />
                  )}
                />
              </FormItem>
              <FormItem
                asterisk
                label="No. Identity"
                invalid={
                  Boolean(errors.identity_type) ||
                  Boolean(errors.identity_number)
                }
                errorMessage={
                  errors.identity_type?.message ||
                  errors.identity_number?.message
                }
              >
                <Controller
                  name="identity_number"
                  control={control}
                  render={({ field }) => {
                    const dropdownItems = [
                      { key: 'ktp', name: 'KTP' },
                      { key: 'sim', name: 'SIM' },
                      { key: 'passport', name: 'Passport' },
                    ]
                    return (
                      <InputGroup>
                        <Dropdown
                          renderTitle={
                            <Button
                              type="button"
                              className="rounded-tr-none rounded-br-none flex items-center gap-2 px-3"
                            >
                              <span>
                                {
                                  dropdownItems.find(
                                    (item) =>
                                      item.key === watchData.identity_type
                                  )?.name
                                }
                              </span>
                              <ArrowDown2
                                color="currentColor"
                                variant="Outline"
                                size={14}
                              />
                            </Button>
                          }
                          activeKey={watchData.identity_type}
                        >
                          {dropdownItems.map((item) => (
                            <Dropdown.Item
                              key={item.key}
                              eventKey={item.key}
                              onSelect={(val) => {
                                formProps.setValue('identity_type', val as any)
                              }}
                            >
                              {item.name}
                            </Dropdown.Item>
                          ))}
                        </Dropdown>
                        <Input
                          type="text"
                          autoComplete="off"
                          placeholder="No. Identity"
                          {...field}
                        />
                      </InputGroup>
                    )
                  }}
                />
              </FormItem>
              <div className="w-full flex flex-col md:flex-row items-center gap-0 md:gap-6">
                <FormItem
                  asterisk
                  label="Gender"
                  invalid={Boolean(errors.gender)}
                  errorMessage={errors.gender?.message}
                >
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Radio.Group {...field}>
                        <Radio value={'m'}>Male</Radio>
                        <Radio value={'f'}>Female</Radio>
                      </Radio.Group>
                    )}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Birth Date"
                  className="w-full"
                  invalid={Boolean(errors.birth_date)}
                  errorMessage={errors.birth_date?.message}
                >
                  <Controller
                    name="birth_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        inputFormat="DD-MM-YYYY"
                        placeholder="Date"
                        {...field}
                      />
                    )}
                  />
                </FormItem>
              </div>
              <FormItem
                asterisk
                label="Address"
                className="w-full"
                invalid={Boolean(errors.address)}
                errorMessage={errors.address?.message}
              >
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      textArea
                      type="text"
                      autoComplete="off"
                      placeholder="Address"
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Specialist"
                className="w-full"
                invalid={Boolean(errors.specialist)}
                errorMessage={errors.specialist?.message}
              >
                <Controller
                  name="specialist"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isMulti={true}
                      value={
                        field.value
                          ?.split(',')
                          .map((option) => ({
                            label: option.trim(),
                            value: option.trim(),
                          }))
                          .filter((item) => item.value !== '') || []
                      }
                      options={selectedOptions}
                      hideSelectedOptions={true}
                      backspaceRemovesValue={false}
                      onChange={(e) => {
                        const vaue = e as unknown as OptionType[]
                        const newVal = vaue?.filter((item) => item.value !== '')
                        setSelectedOptions(newVal)
                        field.onChange(
                          newVal.map((item) => item.value).join(', ')
                        )
                      }}
                      onInputChange={(newValue, actionMeta) => {
                        if (actionMeta.action === 'input-change') {
                          const options = newValue.split(',').map((option) => ({
                            label: option.trim(),
                            value: option.trim(),
                          }))
                          setSelectedOptions(options)
                        }
                      }}
                    />
                  )}
                />
                <span className="text-xs text-gray-500">
                  Pisahkan dengan Enter
                </span>
              </FormItem>
              <FormItem
                label="Description (Optional)"
                className="w-full"
                invalid={Boolean(errors.description)}
                errorMessage={errors.description?.message}
              >
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      textArea
                      type="text"
                      autoComplete="off"
                      placeholder="Description"
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Join Date"
                className="w-full"
                invalid={Boolean(errors.join_date)}
                errorMessage={errors.join_date?.message}
              >
                <Controller
                  name="join_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      inputFormat="DD-MM-YYYY"
                      placeholder="Date"
                      {...field}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label=""
                className="w-full"
                invalid={Boolean(errors.enabled)}
                errorMessage={errors.enabled?.message}
              >
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <Checkbox checked={field.value ?? false} {...field}>
                      {field.value ? 'Enabled' : 'Disabled'}
                    </Checkbox>
                  )}
                />
              </FormItem>
            </div>
            <div className="text-right mt-6 flex justify-between items-center gap-2">
              {type === 'update' ? (
                <Button
                  className="ltr:mr-2 rtl:ml-2 bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                  variant="solid"
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash color="currentColor" size="24" variant="Outline" />
                </Button>
              ) : (
                <div></div>
              )}
              <Button
                variant="solid"
                type="submit"
                loading={create.isPending || update.isPending}
              >
                Save
              </Button>
            </div>
          </Form>
        </div>
      </Dialog>

      <AlertConfirm
        open={confirmDelete}
        title="Delete Member"
        description="Are you sure want to delete this member?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default FormEmployee
