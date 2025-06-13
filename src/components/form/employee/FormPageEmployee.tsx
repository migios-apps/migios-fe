/* eslint-disable react-refresh/only-export-components */
import { Container, DoubleSidedImage } from '@/components/shared'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Dropdown,
  Form,
  FormItem,
  Input,
  InputCurrency,
  InputGroup,
  PhoneInput,
  Radio,
  Select,
  Upload,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import SelectAsyncPaginate, {
  ReturnAsyncSelect,
} from '@/components/ui/Select/SelectAsync'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreateEmployee } from '@/services/api/@types/employee'
import { Role } from '@/services/api/@types/settings/role'
import {
  apiCreateEmployee,
  apiDeleteEmployee,
  apiUpdateEmployee,
} from '@/services/api/EmployeeService'
import { apiGetRoleList } from '@/services/api/settings/Role'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ArrowDown2, Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { HiOutlineUser } from 'react-icons/hi'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import type { GroupBase, OptionsOrGroups } from 'react-select'
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
  type: 'create' | 'update'
  formProps: ReturnEmployeeSchema
  onSuccess: () => void
}

type OptionType = {
  value: string
  label: string
}

const FormPageEmployee: React.FC<FormProps> = ({
  type,
  formProps,
  onSuccess,
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
    onSuccess()
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
        earnings: data.earnings as CreateEmployee['earnings'],
        roles: data.roles as CreateEmployee['roles'],
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
        earnings: data.earnings as CreateEmployee['earnings'],
        roles: data.roles as CreateEmployee['roles'],
      })
      return
    }
  }

  const handleDelete = () => {
    deleteItem.mutate(watchData.code as string)
    setConfirmDelete(false)
  }

  const getListRole = async (
    inputValue: string,
    _: OptionsOrGroups<Role, GroupBase<Role>>,
    additional?: { page: number }
  ) => {
    const response = await apiGetRoleList({
      page: additional?.page,
      per_page: 10,
      search: [
        (inputValue || '').length > 0
          ? ({
              search_column: 'display_name',
              search_condition: 'like',
              search_text: `${inputValue}`,
            } as any)
          : null,
      ],
    })
    return new Promise<ReturnAsyncSelect>((resolve) => {
      resolve({
        options: response.data.data,
        hasMore: response.data.data.length >= 1,
        additional: {
          page: additional!.page + 1,
        },
      })
    })
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="gap-4 flex flex-col flex-auto">
            <Card>
              <h4 className="mb-6">Data diri</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                  asterisk
                  label="Nama"
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
                        placeholder="Nama"
                        {...field}
                      />
                    )}
                  />
                </FormItem>
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
                  label="Nomor Telepon"
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
                  label="Nomor Identitas"
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
                                  formProps.setValue(
                                    'identity_type',
                                    val as any
                                  )
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
              </div>
              <div className="w-full flex flex-col md:flex-row items-center gap-0 md:gap-6">
                <FormItem
                  asterisk
                  label="Jenis Kelamin"
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
                  label="Tanggal Lahir"
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
                label="Alamat"
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
            </Card>
            <Card>
              <h4 className="mb-6">Pendapatan dan komisi</h4>
              <FormItem
                asterisk
                label="Gaji pokok"
                invalid={Boolean(errors.earnings?.base_salary)}
                errorMessage={errors.earnings?.base_salary?.message}
              >
                <Controller
                  name="earnings.base_salary"
                  control={control}
                  render={({ field }) => (
                    <InputCurrency
                      placeholder="Rp. 0"
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                  label="Komisi penjualan"
                  invalid={
                    Boolean(errors.earnings?.sales) ||
                    Boolean(errors.earnings?.sales_type)
                  }
                  errorMessage={
                    errors.earnings?.sales?.message ||
                    errors.earnings?.sales_type?.message
                  }
                  labelClass="w-full flex justify-between items-center"
                  extraType="start"
                >
                  <Controller
                    name="earnings.sales"
                    control={control}
                    render={({ field }) => {
                      return (
                        <InputGroup>
                          {watchData.earnings?.sales_type === 'nominal' ? (
                            <InputCurrency
                              placeholder="Rp. 0"
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          ) : (
                            <Input
                              type="number"
                              autoComplete="off"
                              placeholder="10%"
                              {...field}
                            />
                          )}
                          <Button
                            type="button"
                            variant={
                              watchData.earnings?.sales_type === 'percent'
                                ? 'solid'
                                : 'default'
                            }
                            onClick={() => {
                              formProps.setValue(
                                'earnings.sales_type',
                                'percent'
                              )
                              // formProps.setValue('sales', 0)
                            }}
                          >
                            %
                          </Button>
                          <Button
                            type="button"
                            variant={
                              watchData.earnings?.sales_type === 'nominal'
                                ? 'solid'
                                : 'default'
                            }
                            onClick={() => {
                              formProps.setValue(
                                'earnings.sales_type',
                                'nominal'
                              )
                              // formProps.setValue('sales', 0)
                            }}
                          >
                            Rp
                          </Button>
                        </InputGroup>
                      )
                    }}
                  />
                </FormItem>
                <FormItem
                  label="Komisi layanan"
                  invalid={Boolean(errors.earnings?.service)}
                  errorMessage={errors.earnings?.service?.message}
                >
                  <Controller
                    name="earnings.service"
                    control={control}
                    render={({ field }) => (
                      <InputCurrency
                        placeholder="Rp. 0"
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                      />
                    )}
                  />
                </FormItem>
                <FormItem
                  label="Komisi per sesi"
                  invalid={Boolean(errors.earnings?.session)}
                  errorMessage={errors.earnings?.session?.message}
                >
                  <Controller
                    name="earnings.session"
                    control={control}
                    render={({ field }) => (
                      <InputCurrency
                        placeholder="Rp. 0"
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                      />
                    )}
                  />
                </FormItem>
                <FormItem
                  label="Komisi per kelas"
                  invalid={Boolean(errors.earnings?.class)}
                  errorMessage={errors.earnings?.class?.message}
                >
                  <Controller
                    name="earnings.class"
                    control={control}
                    render={({ field }) => (
                      <InputCurrency
                        placeholder="Rp. 0"
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                      />
                    )}
                  />
                </FormItem>
              </div>
            </Card>
          </div>
          <div className="md:w-[370px] gap-4 flex flex-col">
            <Card>
              <div className="text-center">
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
                    render={({ field }) => (
                      <>
                        <div className="flex items-center justify-center">
                          {field.value ? (
                            <Avatar
                              size={100}
                              className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                              icon={<HiOutlineUser />}
                              src={field.value}
                            />
                          ) : (
                            <DoubleSidedImage
                              src="/img/others/upload.png"
                              darkModeSrc="/img/others/upload-dark.png"
                              alt="Upload image"
                            />
                          )}
                        </div>
                        <Upload
                          showList={false}
                          uploadLimit={1}
                          // beforeUpload={beforeUpload}
                          // onChange={(files) => {
                          //   if (files.length > 0) {
                          //     field.onChange(URL.createObjectURL(files[0]))
                          //   }
                          // }}
                        >
                          <Button
                            variant="solid"
                            className="mt-4"
                            type="button"
                          >
                            Upload Image
                          </Button>
                        </Upload>
                      </>
                    )}
                  />
                </FormItem>
              </div>
              <FormItem
                asterisk
                label="Jenis staff"
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
              {watchData.type === 'trainer' && (
                <FormItem
                  asterisk
                  label="Spesialisasi"
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
                          const newVal = vaue?.filter(
                            (item) => item.value !== ''
                          )
                          setSelectedOptions(newVal)
                          field.onChange(
                            newVal.map((item) => item.value).join(', ')
                          )
                        }}
                        onInputChange={(newValue, actionMeta) => {
                          if (actionMeta.action === 'input-change') {
                            const options = newValue
                              .split(',')
                              .map((option) => ({
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
              )}
              {/* <FormItem
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
                </FormItem> */}
              <FormItem
                asterisk
                label="Tanggal Bergabung"
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
            </Card>
            <Card>
              <h4 className="mb-6">Role</h4>
              <FormItem
                asterisk
                label="Roles"
                invalid={Boolean(errors.roles)}
                errorMessage={errors.roles?.message}
                labelClass="w-full flex justify-between items-center"
              >
                <Controller
                  name="roles"
                  control={control}
                  render={({ field }) => (
                    <SelectAsyncPaginate
                      isClearable
                      isMulti
                      // isLoading={isLoading}
                      loadOptions={getListRole as any}
                      additional={{ page: 1 }}
                      placeholder="Select Role"
                      value={field.value}
                      cacheUniqs={[watchData.roles]}
                      isOptionDisabled={() =>
                        ((watchData.roles as any[]) ?? []).length >= 5
                      }
                      getOptionLabel={(option) => option.name!}
                      getOptionValue={(option) => option.id.toString()}
                      debounceTimeout={500}
                      formatOptionLabel={({ name }) => {
                        return (
                          <div className="flex justify-start items-center gap-2">
                            <span className="text-sm">{name}</span>
                          </div>
                        )
                      }}
                      onChange={(option) => field.onChange(option)}
                    />
                  )}
                />
              </FormItem>
            </Card>
          </div>
        </div>
        <BottomStickyBar>
          <Container>
            <div className="flex items-center justify-between px-8">
              <Button
                className="ltr:mr-3 rtl:ml-3"
                type="button"
                variant="plain"
                icon={<TbArrowNarrowLeft />}
                onClick={() => history.back()}
              >
                Back
              </Button>
              <div className="flex items-center">
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
            </div>
          </Container>
        </BottomStickyBar>
      </Form>

      <AlertConfirm
        open={confirmDelete}
        title="Delete Employee"
        description="Are you sure want to delete this employee?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default FormPageEmployee
