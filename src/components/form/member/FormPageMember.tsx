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
  InputGroup,
  PhoneInput,
  Radio,
  Upload,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { CreateMemberTypes } from '@/services/api/@types/member'
import {
  apiCreateMember,
  apiDeleteMember,
  apiUpdateMember,
} from '@/services/api/MembeService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ArrowDown2, Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { HiOutlineUser } from 'react-icons/hi'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import {
  CreateMemberSchema,
  ReturnMemberSchema,
  resetMemberForm,
} from './memberValidation'

type FormProps = {
  type: 'create' | 'update'
  formProps: ReturnMemberSchema
  onSuccess: () => void
}

const FormPageMember: React.FC<FormProps> = ({
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

  const handleClose = () => {
    resetMemberForm(formProps)
    onSuccess()
  }

  const handlePrefetch = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.members] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateMemberTypes) => apiCreateMember(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefetch,
  })

  const update = useMutation({
    mutationFn: (data: CreateMemberTypes) =>
      apiUpdateMember(watchData.code as string, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefetch,
  })

  const deleteItem = useMutation({
    mutationFn: (id: string) => apiDeleteMember(id),
    onError: (error) => {
      console.log('error delete', error)
    },
    onSuccess: handlePrefetch,
  })

  const onSubmit: SubmitHandler<CreateMemberSchema> = (data) => {
    const payload: CreateMemberTypes = {
      club_id: club?.id as number,
      name: data.name,
      address: data.address,
      identity_number: data.identity_number,
      identity_type: data.identity_type,
      birth_date: dayjs(data.birth_date).format('YYYY-MM-DD'),
      gender: data.gender,
      phone: data.phone,
      photo: data.photo as string | null,
      email: data.email,
      notes: data.notes as string | null,
      goals: data.goals as string | null,
      join_date: dayjs(data.join_date).format('YYYY-MM-DD'),
      enabled: data.enabled,
    }

    if (type === 'update') {
      update.mutate(payload)
      return
    }
    if (type === 'create') {
      create.mutate(payload)
      return
    }
  }

  const handleDelete = () => {
    deleteItem.mutate(watchData.code as string)
    setConfirmDelete(false)
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
              <FormItem
                label="Goals (Optional)"
                className="w-full"
                invalid={Boolean(errors.goals)}
                errorMessage={errors.goals?.message}
              >
                <Controller
                  name="goals"
                  control={control}
                  render={({ field }) => (
                    <Input
                      textArea
                      type="text"
                      autoComplete="off"
                      placeholder="Diet, Exercise, etc"
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />
              </FormItem>
            </Card>
          </div>
          <div className="md:w-[370px] gap-4 flex flex-col">
            <Card>
              <div className="text-center">
                <FormItem
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
                        <Upload showList={false} uploadLimit={1}>
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

export default FormPageMember
