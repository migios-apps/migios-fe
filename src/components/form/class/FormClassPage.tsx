import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  Form,
  FormItem,
  Input,
  Select,
  Switcher,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import SelectAsyncPaginate, {
  ReturnAsyncSelect,
} from '@/components/ui/Select/SelectAsync'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import {
  ClassCategoryDetail,
  CreateClassPage,
} from '@/services/api/@types/class'
import { TrainerPackageTypes } from '@/services/api/@types/package'
import {
  apiCreateClass,
  apiGetAllInstructorByClass,
  apiGetClassCategory,
  apiUpdateClass,
} from '@/services/api/ClassService'
import { apiDeletePackage } from '@/services/api/PackageService'
import { apiGetTrainerList } from '@/services/api/TrainerService'
import { useSessionUser } from '@/store/authStore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { HiOutlineUser } from 'react-icons/hi'
import type { GroupBase, OptionsOrGroups } from 'react-select'
import FormClassEvent from './FormClassEvent'
import {
  ClassPageFormSchema,
  LevelClassOptions,
  ReturnClassPageFormSchema,
} from './validation'

type FormProps = {
  open: boolean
  type: 'create' | 'update'
  formProps: ReturnClassPageFormSchema
  onClose: () => void
}

const FormClassPage: React.FC<FormProps> = ({
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
  const [eventModal, setEventModal] = React.useState(false)

  // console.log('watchData', watchData)
  // console.log('errors', errors)

  const {
    data: instructors,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY.trainers, watchData.id],
    queryFn: () => apiGetAllInstructorByClass(watchData.id as number),
    select: (res) => res.data,
    enabled: !!watchData.id,
  })

  React.useEffect(() => {
    if (type === 'update' && !error) {
      formProps.setValue('instructors', instructors)
    }
  }, [error, formProps, instructors, type, watchData.allow_all_instructor])

  const getTrainerList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<TrainerPackageTypes, GroupBase<TrainerPackageTypes>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetTrainerList({
        page: additional?.page,
        per_page: 10,
        sort_column: 'id',
        sort_type: 'desc',
        search: [
          (inputValue || '').length > 0
            ? ({
                search_column: 'name',
                search_condition: 'like',
                search_text: `${inputValue}`,
              } as any)
            : null,
          {
            search_operator: 'and',
            search_column: 'enabled',
            search_condition: '=',
            search_text: 'true',
          },
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
    },
    []
  )

  const getClassCategoryList = async (
    inputValue: string,
    _: OptionsOrGroups<ClassCategoryDetail, GroupBase<ClassCategoryDetail>>,
    additional?: { page: number }
  ) => {
    const response = await apiGetClassCategory({
      page: additional?.page,
      per_page: 10,
      sort_column: 'id',
      sort_type: 'desc',
      search: [
        (inputValue || '').length > 0
          ? ({
              search_column: 'name',
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

  const handleClose = () => {
    formProps.reset({})
    onClose()
  }

  const handlePrefecth = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.classes] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.events] })
    handleClose()
  }

  // Mutations
  const create = useMutation({
    mutationFn: (data: CreateClassPage) => apiCreateClass(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefecth,
  })

  const update = useMutation({
    mutationFn: (data: CreateClassPage) =>
      apiUpdateClass(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeletePackage(id),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefecth,
  })

  const onSubmit: SubmitHandler<ClassPageFormSchema> = (data) => {
    if (type === 'update') {
      update.mutate({
        club_id: club?.id as number,
        photo: data.photo,
        burn_calories: data.burn_calories,
        name: data.name,
        enabled: data.enabled,
        allow_all_instructor: data.allow_all_instructor,
        phone: data.phone,
        capacity: data.capacity,
        level: data.level,
        category_id: data?.category?.id || null,
        description: data.description,
        instructors: data.allow_all_instructor
          ? []
          : (data.instructors as CreateClassPage['instructors']),
        events: data.events.map((event) => ({
          ...event,
          start: dayjs(event.start).format('YYYY-MM-DD HH:mm'),
          end: dayjs(event.end).format('YYYY-MM-DD HH:mm'),
        })) as CreateClassPage['events'],
      })
      return
    }
    if (type === 'create') {
      create.mutate({
        club_id: club?.id as number,
        photo: data.photo,
        burn_calories: data.burn_calories,
        name: data.name,
        enabled: data.enabled,
        allow_all_instructor: data.allow_all_instructor,
        phone: data.phone,
        capacity: data.capacity,
        level: data.level,
        category_id: data?.category?.id || null,
        description: data.description,
        instructors: data.allow_all_instructor
          ? []
          : (data.instructors as CreateClassPage['instructors']),
        events: data.events.map((event) => ({
          ...event,
          start: dayjs(event.start).format('YYYY-MM-DD HH:mm'),
          end: dayjs(event.end).format('YYYY-MM-DD HH:mm'),
        })) as CreateClassPage['events'],
      })
      return
    }
  }

  const handleDelete = () => {
    deleteItem.mutate(watchData.id as number)
    setConfirmDelete(false)
    handleClose()
  }

  return (
    <>
      <Dialog
        scrollBody
        width={620}
        isOpen={open}
        onClose={handleClose}
        onRequestClose={handleClose}
      >
        <div className="flex flex-col h-full justify-between">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <h5 className="mb-4">
              {type === 'create' ? 'Create Class' : 'Update Class'}
            </h5>
            <div className="">
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
              <FormItem
                asterisk
                label="Instructors"
                invalid={Boolean(errors.instructors)}
                errorMessage={errors.instructors?.message}
                labelClass="w-full flex justify-between items-center"
                extra={
                  <Controller
                    name="allow_all_instructor"
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-1">
                        <span>Assign All Instructors</span>
                        <Switcher
                          name="allow_all_instructor"
                          checked={field.value ?? false}
                          onChange={(checked) => {
                            field.onChange(checked)
                          }}
                        />
                      </div>
                    )}
                  />
                }
              >
                <Controller
                  name="instructors"
                  control={control}
                  render={({ field }) => (
                    <SelectAsyncPaginate
                      isClearable
                      isMulti
                      isLoading={isLoading}
                      loadOptions={getTrainerList as any}
                      additional={{ page: 1 }}
                      placeholder="Select Instructor"
                      value={field.value}
                      cacheUniqs={[watchData.instructors]}
                      isOptionDisabled={() =>
                        ((watchData.instructors as any[]) ?? []).length >= 5
                      }
                      getOptionLabel={(option) => option.name!}
                      getOptionValue={(option) => option.code.toString()}
                      debounceTimeout={500}
                      isDisabled={watchData.allow_all_instructor}
                      formatOptionLabel={({ name, photo }) => {
                        return (
                          <div className="flex justify-start items-center gap-2">
                            <Avatar
                              size="sm"
                              {...(photo && { src: photo || '' })}
                              {...(!photo && { icon: <HiOutlineUser /> })}
                            />
                            <span className="text-sm">{name}</span>
                          </div>
                        )
                      }}
                      onChange={(option) => field.onChange(option)}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Category (Optional)"
                invalid={Boolean(errors.category)}
                errorMessage={errors.category?.message}
                labelClass="w-full flex justify-between items-center"
              >
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <SelectAsyncPaginate
                      isClearable
                      isLoading={isLoading}
                      loadOptions={getClassCategoryList as any}
                      additional={{ page: 1 }}
                      placeholder="Select Category"
                      value={field.value}
                      cacheUniqs={[watchData.category]}
                      getOptionLabel={(option) => option.name!}
                      getOptionValue={(option) => option.id.toString()}
                      debounceTimeout={500}
                      onChange={(option) => field.onChange(option)}
                    />
                  )}
                />
              </FormItem>
              <div className="w-full flex flex-col md:flex-row items-start gap-0 md:gap-2">
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
                      <Input
                        type="string"
                        autoComplete="off"
                        placeholder="Phone Number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                          // Hanya izinkan angka dan satu karakter +
                          const formattedValue = value
                            .replace(/[^\d+]/g, '') // Hapus semua karakter kecuali angka dan +
                            .replace(/\+/g, (match, offset, string) =>
                              string.indexOf('+') === offset ? '+' : ''
                            ) // Pastikan hanya ada satu tanda +
                          field.onChange(formattedValue)
                        }}
                      />
                    )}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Calorie Burn"
                  className="w-full"
                  invalid={Boolean(errors.burn_calories)}
                  errorMessage={errors.burn_calories?.message}
                >
                  <Controller
                    name="burn_calories"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        autoComplete="off"
                        placeholder="Calorie Burn"
                        {...field}
                      />
                    )}
                  />
                </FormItem>
              </div>
              <div className="w-full flex flex-col md:flex-row items-start gap-0 md:gap-2">
                <FormItem
                  asterisk
                  label="Capacity"
                  className="w-full"
                  invalid={Boolean(errors.capacity)}
                  errorMessage={errors.capacity?.message}
                >
                  <Controller
                    name="capacity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        autoComplete="off"
                        placeholder="Capacity"
                        {...field}
                      />
                    )}
                  />
                </FormItem>
                <FormItem
                  asterisk
                  label="Level"
                  className="w-full"
                  invalid={Boolean(errors.level)}
                  errorMessage={errors.level?.message}
                >
                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isSearchable={false}
                        placeholder="Select Level"
                        value={LevelClassOptions.filter(
                          (option) => option.value === field.value
                        )}
                        options={LevelClassOptions}
                        onChange={(option) => field.onChange(option?.value)}
                      />
                    )}
                  />
                </FormItem>
              </div>
              <FormItem
                label="Description"
                className="w-full mb-2"
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
                      placeholder="description"
                      {...field}
                      value={field.value ?? ''}
                    />
                  )}
                />
              </FormItem>
              <div className="w-full flex flex-col">
                <h5 className="font-semibold text-lg mb-2">Events Schedule</h5>
                {watchData.events?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col border border-gray-200 p-4 rounded-lg mb-4"
                  >
                    <div className="flex flex-col">
                      <div className="grid grid-cols-[140px_1fr] items-start space-x-2">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold flex items-center gap-1">
                            Frequency
                          </span>
                          <span className="text-sm">:</span>
                        </div>
                        <div className="flex justify-start capitalize">
                          {item.frequency}
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start space-x-2">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold flex items-center gap-1">
                            Start End
                          </span>
                          <span className="text-sm">:</span>
                        </div>
                        <div className="flex justify-start">
                          {dayjs(item.start).format('DD MMMM YYYY')}{' '}
                          {item.end_type === 'on' &&
                            `- ${dayjs(item.end).format('DD MMMM YYYY')}`}
                        </div>
                      </div>

                      {item.frequency === 'hourly' ||
                      item.frequency === 'daily' ? (
                        <>
                          <div className="grid grid-cols-[140px_1fr] items-start space-x-2">
                            <div className="flex justify-between items-center w-full">
                              <span className="font-bold flex items-center gap-1">
                                Start Time
                              </span>
                              <span className="text-sm">:</span>
                            </div>
                            <div className="flex justify-start">
                              {dayjs(item.start).format('HH:mm')}
                            </div>
                          </div>

                          <div className="grid grid-cols-[140px_1fr] items-start space-x-2">
                            <div className="flex justify-between items-center w-full">
                              <span className="font-bold flex items-center gap-1">
                                End Time
                              </span>
                              <span className="text-sm">:</span>
                            </div>
                            <div className="flex justify-start">
                              {dayjs(item.end).format('HH:mm')}
                            </div>
                          </div>
                        </>
                      ) : null}

                      <div className="grid grid-cols-[140px_1fr] items-start space-x-2">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold flex items-center gap-1">
                            Color
                          </span>
                          <span className="text-sm">:</span>
                        </div>
                        <div className="flex justify-start gap-1 items-center">
                          <div
                            className="w-4 h-4"
                            style={{ background: `${item.color}` }}
                          ></div>
                          {item.color}
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start space-x-2">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold flex items-center gap-1">
                            Background Color
                          </span>
                          <span className="text-sm">:</span>
                        </div>
                        <div className="flex justify-start gap-1 items-center">
                          <div
                            className="w-4 h-4"
                            style={{ background: `${item.background_color}` }}
                          ></div>
                          {item.background_color}
                        </div>
                      </div>

                      <div className="grid grid-cols-[140px_1fr] items-start space-x-2">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold flex items-center gap-1">
                            End Type
                          </span>
                          <span className="text-sm">:</span>
                        </div>
                        <div className="flex justify-start">
                          {item.end_type}
                        </div>
                      </div>

                      {item.frequency === 'monthly' ? (
                        <div className="grid grid-cols-[140px_1fr] items-start space-x-2">
                          <div className="flex justify-between items-center w-full">
                            <span className="font-bold flex items-center gap-1">
                              Weeks
                            </span>
                            <span className="text-sm">:</span>
                          </div>
                          <div className="flex justify-start">
                            <div className="flex flex-wrap gap-2">
                              {item.week_number?.map((week) => (
                                <span
                                  key={week}
                                  className="capitalize border border-gray-200 px-1 rounded-md"
                                >
                                  {week === -1 ? 'Last Week' : `Week ${week}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {item.frequency === 'yearly' ? (
                        <div className="grid grid-cols-[140px_1fr] items-start space-x-2">
                          <div className="flex justify-between items-center w-full">
                            <span className="font-bold flex items-center gap-1">
                              Selected Months
                            </span>
                            <span className="text-sm">:</span>
                          </div>
                          <div className="flex justify-start">
                            <div className="flex flex-wrap gap-2">
                              {item.selected_months?.map((month) => (
                                <span
                                  key={month}
                                  className="capitalize border border-gray-200 px-1 rounded-md"
                                >
                                  {dayjs(new Date(0, month!)).format('MMMM')}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {item.frequency === 'weekly' ||
                      item.frequency === 'monthly' ||
                      item.frequency === 'yearly' ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center w-[200px]">
                            <span className="font-bold flex items-center gap-1">
                              Weekdays
                            </span>
                            <span className="text-sm">:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.selected_weekdays?.map((item, index) => (
                              <div
                                key={index}
                                className="flex flex-col border border-gray-200 p-2 rounded-xl"
                              >
                                <span className="font-semibold capitalize">
                                  {item.day_of_week}
                                </span>
                                <span className="text-xs">
                                  {item.start_time} - {item.end_time}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
                <FormItem
                  label=""
                  className="w-full"
                  invalid={Boolean(errors.events)}
                  errorMessage={errors.events?.message}
                >
                  <Button
                    variant="solid"
                    type="button"
                    className="w-full"
                    onClick={() => setEventModal(true)}
                  >
                    {watchData.events?.length > 0
                      ? 'Edit Schedule'
                      : 'Add Schedule'}
                  </Button>
                </FormItem>
              </div>
              <FormItem
                label=""
                className="w-full mb-2"
                invalid={Boolean(errors.enabled)}
                errorMessage={errors.enabled?.message}
              >
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <Checkbox checked={field.value} {...field}>
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

      <FormClassEvent
        open={eventModal}
        formProps={formProps}
        onClose={() => setEventModal(false)}
      />

      <AlertConfirm
        open={confirmDelete}
        title="Delete Class Package"
        description="Are you sure want to delete this Class Package?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default FormClassPage
