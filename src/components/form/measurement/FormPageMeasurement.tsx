import { Container } from '@/components/shared'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  FormItem,
  Input,
  Radio,
  Upload,
} from '@/components/ui'
import AlertConfirm from '@/components/ui/AlertConfirm'
import SelectAsyncPaginate, {
  ReturnAsyncSelect,
} from '@/components/ui/Select/SelectAsync'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { EmployeeDetail } from '@/services/api/@types/employee'
import { MemberMeasurementPayload } from '@/services/api/@types/measurement'
import { MemberDetail } from '@/services/api/@types/member'
import { apiGetEmployeeList } from '@/services/api/EmployeeService'
import {
  apiCreateMemberMeasurement,
  apiDeleteMemberMeasurement,
  apiUpdateMemberMeasurement,
} from '@/services/api/MeasurementService'
import { apiGetMemberList } from '@/services/api/MembeService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Trash } from 'iconsax-react'
import React from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'
import { HiOutlineUser } from 'react-icons/hi'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import type { GroupBase, OptionsOrGroups } from 'react-select'
import {
  MeasurementFormSchema,
  ReturnMeasurementFormSchema,
  resetMeasurementForm,
} from './validation'

type FormProps = {
  type: 'create' | 'update'
  formProps: ReturnMeasurementFormSchema
  onSuccess: () => void
}

const FormPageMeasurement: React.FC<FormProps> = ({
  type,
  formProps,
  onSuccess,
}) => {
  const queryClient = useQueryClient()
  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = formProps
  const watchData = watch()
  const [confirmDelete, setConfirmDelete] = React.useState(false)
  const [photoFiles, setPhotoFiles] = React.useState<{
    front?: File | null
    back?: File | null
    left?: File | null
    right?: File | null
  }>({})

  const getMemberList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<MemberDetail, GroupBase<MemberDetail>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetMemberList({
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

  const getTrainerList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<EmployeeDetail, GroupBase<EmployeeDetail>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetEmployeeList({
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
          {
            search_operator: 'and',
            search_column: 'type',
            search_condition: '=',
            search_text: 'trainer',
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

  const handleClose = () => {
    resetMeasurementForm(formProps)
    onSuccess()
  }

  const handlePrefetch = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.measurements] })
    handleClose()
  }

  const create = useMutation({
    mutationFn: (data: MemberMeasurementPayload) =>
      apiCreateMemberMeasurement(data),
    onError: (error) => {
      console.log('error create', error)
    },
    onSuccess: handlePrefetch,
  })

  const update = useMutation({
    mutationFn: (data: MemberMeasurementPayload) =>
      apiUpdateMemberMeasurement(watchData.id as number, data),
    onError: (error) => {
      console.log('error update', error)
    },
    onSuccess: handlePrefetch,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => apiDeleteMemberMeasurement(id),
    onError: (error) => {
      console.log('error delete', error)
    },
    onSuccess: handlePrefetch,
  })

  const onSubmit: SubmitHandler<MeasurementFormSchema> = (data) => {
    const photos = []
    if (photoFiles.front) {
      photos.push({
        view: 'front' as const,
        url: URL.createObjectURL(photoFiles.front),
      })
    }
    if (photoFiles.back) {
      photos.push({
        view: 'back' as const,
        url: URL.createObjectURL(photoFiles.back),
      })
    }
    if (photoFiles.left) {
      photos.push({
        view: 'left' as const,
        url: URL.createObjectURL(photoFiles.left),
      })
    }
    if (photoFiles.right) {
      photos.push({
        view: 'right' as const,
        url: URL.createObjectURL(photoFiles.right),
      })
    }

    const payload: MemberMeasurementPayload = {
      member_id: data.member_id,
      trainer_id: data.trainer_id || undefined,
      measured_at: data.measured_at
        ? dayjs(data.measured_at).format('YYYY-MM-DD HH:mm')
        : undefined,
      weight_kg: data.weight_kg || undefined,
      body_fat_percent: data.body_fat_percent || undefined,
      muscle_mass_kg: data.muscle_mass_kg || undefined,
      bone_mass_kg: data.bone_mass_kg || undefined,
      total_body_water_percent: data.total_body_water_percent || undefined,
      visceral_fat_level: data.visceral_fat_level || undefined,
      metabolic_age_years: data.metabolic_age_years || undefined,
      protein_percent: data.protein_percent || undefined,
      body_age_years: data.body_age_years || undefined,
      physique_rating: data.physique_rating || undefined,
      neck_cm: data.neck_cm || undefined,
      right_arm_cm: data.right_arm_cm || undefined,
      left_arm_cm: data.left_arm_cm || undefined,
      chest_cm: data.chest_cm || undefined,
      abdominal_cm: data.abdominal_cm || undefined,
      hip_cm: data.hip_cm || undefined,
      right_thigh_cm: data.right_thigh_cm || undefined,
      left_thigh_cm: data.left_thigh_cm || undefined,
      right_calf_cm: data.right_calf_cm || undefined,
      left_calf_cm: data.left_calf_cm || undefined,
      result: data.result || undefined,
      notes: data.notes || undefined,
      calorie_target_kcal: data.calorie_target_kcal || undefined,
      adherence_score: data.adherence_score || undefined,
      activity_factor: data.activity_factor || undefined,
      photos: photos.length > 0 ? photos : undefined,
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
    deleteItem.mutate(watchData.id as number)
    setConfirmDelete(false)
  }

  const resultOptions = [
    { label: 'Sangat Baik', value: 'excellent' },
    { label: 'Baik', value: 'good' },
    { label: 'Rata-rata', value: 'average' },
    { label: 'Perlu Perbaikan', value: 'need_improvement' },
    { label: 'Buruk', value: 'poor' },
  ]

  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="plain"
                icon={<TbArrowNarrowLeft />}
                onClick={handleClose}
              >
                Kembali
              </Button>
              <h3>
                {type === 'create' ? 'Buat Pengukuran' : 'Ubah Pengukuran'}
              </h3>
            </div>
            {type === 'update' && (
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                variant="solid"
                icon={<Trash />}
                onClick={() => setConfirmDelete(true)}
              >
                Hapus
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {/* Basic Information */}
            <Card>
              <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                <h4 className="font-semibold">Informasi Dasar</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                  asterisk
                  label="Nama Member"
                  invalid={Boolean(errors.member_id)}
                  errorMessage={errors.member_id?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Pilih member yang akan diukur dari daftar member aktif
                  </p>
                  <Controller
                    name="member"
                    control={control}
                    render={({ field }) => (
                      <SelectAsyncPaginate
                        isClearable
                        loadOptions={getMemberList as any}
                        additional={{ page: 1 }}
                        placeholder="Pilih Member"
                        value={field.value}
                        cacheUniqs={[watchData.member]}
                        getOptionLabel={(option) => option.name!}
                        getOptionValue={(option) => `${option.id}`}
                        debounceTimeout={500}
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
                        onChange={(option) => {
                          field.onChange(option)
                          setValue('member_id', option?.id || 0)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem label="Jenis Kelamin" invalid={false} errorMessage="">
                  <Input
                    disabled
                    type="text"
                    value={
                      watchData.member?.gender === 'm'
                        ? 'Laki-laki'
                        : watchData.member?.gender === 'f'
                          ? 'Perempuan'
                          : ''
                    }
                  />
                </FormItem>

                <FormItem
                  asterisk
                  label="Nama Trainer"
                  invalid={Boolean(errors.trainer_id)}
                  errorMessage={errors.trainer_id?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Pilih trainer yang melakukan pengukuran (dari login atau
                    dropdown)
                  </p>
                  <Controller
                    name="trainer"
                    control={control}
                    render={({ field }) => (
                      <SelectAsyncPaginate
                        isClearable
                        loadOptions={getTrainerList as any}
                        additional={{ page: 1 }}
                        placeholder="Pilih Trainer"
                        value={field.value}
                        cacheUniqs={[watchData.trainer]}
                        getOptionLabel={(option) => option.name!}
                        getOptionValue={(option) => `${option.id}`}
                        debounceTimeout={500}
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
                        onChange={(option) => {
                          field.onChange(option)
                          setValue('trainer_id', option?.id || undefined)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem label="Usia" invalid={false} errorMessage="">
                  <Input
                    disabled
                    type="text"
                    value={
                      watchData.member?.age
                        ? `${watchData.member.age} tahun`
                        : ''
                    }
                  />
                </FormItem>

                <FormItem
                  asterisk
                  label="Tanggal Pengukuran"
                  invalid={Boolean(errors.measured_at)}
                  errorMessage={errors.measured_at?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Tanggal dan waktu pengukuran dilakukan (boleh auto
                    &quot;sekarang&quot;, atau ganti jika input mundur)
                  </p>
                  <Controller
                    name="measured_at"
                    control={control}
                    render={({ field }) => (
                      <DatePicker.DateTimepicker
                        inputFormat="DD-MM-YYYY HH:mm"
                        amPm={false}
                        placeholder="Tanggal Pengukuran"
                        {...field}
                        value={field.value ? dayjs(field.value).toDate() : null}
                        onChange={(date) => {
                          field.onChange(
                            date ? dayjs(date).format('YYYY-MM-DD HH:mm') : null
                          )
                        }}
                      />
                    )}
                  />
                </FormItem>
              </div>
            </Card>

            {/* Body Composition Measurement */}
            <Card>
              <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                <h4 className="font-semibold">Pengukuran Komposisi Tubuh</h4>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <FormItem
                  label="Berat Badan"
                  invalid={Boolean(errors.weight_kg)}
                  errorMessage={errors.weight_kg?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    WAJIB diisi. Salin langsung dari hasil timbangan (dalam Kg)
                  </p>
                  <Controller
                    name="weight_kg"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Berat Badan (Kg)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Lemak Visceral"
                  invalid={Boolean(errors.visceral_fat_level)}
                  errorMessage={errors.visceral_fat_level?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Salin dari hasil mesin body composition (InBody/Tanita) jika
                    tersedia
                  </p>
                  <Controller
                    name="visceral_fat_level"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Tingkat Lemak Visceral"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Persentase Lemak Tubuh"
                  invalid={Boolean(errors.body_fat_percent)}
                  errorMessage={errors.body_fat_percent?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Salin dari hasil mesin body composition (dalam persentase)
                  </p>
                  <Controller
                    name="body_fat_percent"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Lemak Tubuh (%)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Usia Metabolik"
                  invalid={Boolean(errors.metabolic_age_years)}
                  errorMessage={errors.metabolic_age_years?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Salin dari hasil mesin body composition (dalam tahun)
                  </p>
                  <Controller
                    name="metabolic_age_years"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Usia Metabolik (Tahun)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Massa Otot"
                  invalid={Boolean(errors.muscle_mass_kg)}
                  errorMessage={errors.muscle_mass_kg?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Salin dari hasil mesin body composition (dalam Kg)
                  </p>
                  <Controller
                    name="muscle_mass_kg"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Massa Otot (Kg)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Massa Tubuh Tanpa Lemak (LBM)"
                  invalid={false}
                  errorMessage=""
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Dihitung otomatis oleh sistem dari berat badan dan lemak
                    tubuh
                  </p>
                  <Input disabled type="text" value="Otomatis Dihitung" />
                </FormItem>

                <FormItem label="BMI" invalid={false} errorMessage="">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Dihitung otomatis oleh sistem dari berat badan (kg) dan
                    tinggi badan (cm) member
                  </p>
                  <Input disabled type="text" value="Otomatis Dihitung" />
                </FormItem>

                <FormItem
                  label="Kadar Protein"
                  invalid={Boolean(errors.protein_percent)}
                  errorMessage={errors.protein_percent?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Salin dari hasil mesin body composition (dalam persentase)
                  </p>
                  <Controller
                    name="protein_percent"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Protein (%)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Massa Tulang"
                  invalid={Boolean(errors.bone_mass_kg)}
                  errorMessage={errors.bone_mass_kg?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Salin dari hasil mesin body composition (dalam Kg)
                  </p>
                  <Controller
                    name="bone_mass_kg"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Massa Tulang (Kg)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Usia Tubuh"
                  invalid={Boolean(errors.body_age_years)}
                  errorMessage={errors.body_age_years?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Salin dari hasil mesin body composition (dalam tahun)
                  </p>
                  <Controller
                    name="body_age_years"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Usia Tubuh (Tahun)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Persentase Total Air Tubuh"
                  invalid={Boolean(errors.total_body_water_percent)}
                  errorMessage={errors.total_body_water_percent?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Salin dari hasil mesin body composition (dalam persentase)
                  </p>
                  <Controller
                    name="total_body_water_percent"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Total Air Tubuh (%)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Rating Bentuk Tubuh"
                  invalid={Boolean(errors.physique_rating)}
                  errorMessage={errors.physique_rating?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Salin dari hasil mesin body composition (skala 1-9)
                  </p>
                  <Controller
                    name="physique_rating"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Rating Bentuk Tubuh (1-9)"
                        min={1}
                        max={9}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>
              </div>
            </Card>

            {/* Body Size Measurement */}
            <Card>
              <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                <h4 className="font-semibold">Pengukuran Ukuran Tubuh</h4>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <FormItem
                  label="Lingkar Leher"
                  invalid={Boolean(errors.neck_cm)}
                  errorMessage={errors.neck_cm?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Ukur dengan meteran (dalam Cm)
                  </p>
                  <Controller
                    name="neck_cm"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Leher (Cm)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Lingkar Pinggul"
                  invalid={Boolean(errors.hip_cm)}
                  errorMessage={errors.hip_cm?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Ukur dengan meteran (dalam Cm) - minimal diisi untuk
                    tracking
                  </p>
                  <Controller
                    name="hip_cm"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Pinggul (Cm)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Lingkar Lengan Kanan"
                  invalid={Boolean(errors.right_arm_cm)}
                  errorMessage={errors.right_arm_cm?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Ukur dengan meteran (dalam Cm)
                  </p>
                  <Controller
                    name="right_arm_cm"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Lengan Kanan (Cm)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Lingkar Paha Kanan"
                  invalid={Boolean(errors.right_thigh_cm)}
                  errorMessage={errors.right_thigh_cm?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Ukur dengan meteran (dalam Cm) - minimal diisi untuk
                    tracking
                  </p>
                  <Controller
                    name="right_thigh_cm"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Paha Kanan (Cm)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Lingkar Lengan Kiri"
                  invalid={Boolean(errors.left_arm_cm)}
                  errorMessage={errors.left_arm_cm?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Ukur dengan meteran (dalam Cm)
                  </p>
                  <Controller
                    name="left_arm_cm"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Lengan Kiri (Cm)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Lingkar Paha Kiri"
                  invalid={Boolean(errors.left_thigh_cm)}
                  errorMessage={errors.left_thigh_cm?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Ukur dengan meteran (dalam Cm) - minimal diisi untuk
                    tracking
                  </p>
                  <Controller
                    name="left_thigh_cm"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Paha Kiri (Cm)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Lingkar Dada"
                  invalid={Boolean(errors.chest_cm)}
                  errorMessage={errors.chest_cm?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Ukur dengan meteran (dalam Cm) - minimal diisi untuk
                    tracking
                  </p>
                  <Controller
                    name="chest_cm"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Dada (Cm)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Lingkar Betis Kanan"
                  invalid={Boolean(errors.right_calf_cm)}
                  errorMessage={errors.right_calf_cm?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Ukur dengan meteran (dalam Cm)
                  </p>
                  <Controller
                    name="right_calf_cm"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Betis Kanan (Cm)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Lingkar Perut"
                  invalid={Boolean(errors.abdominal_cm)}
                  errorMessage={errors.abdominal_cm?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Ukur dengan meteran (dalam Cm) - minimal diisi untuk
                    tracking
                  </p>
                  <Controller
                    name="abdominal_cm"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Perut (Cm)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Lingkar Betis Kiri"
                  invalid={Boolean(errors.left_calf_cm)}
                  errorMessage={errors.left_calf_cm?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Ukur dengan meteran (dalam Cm)
                  </p>
                  <Controller
                    name="left_calf_cm"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Betis Kiri (Cm)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>
              </div>
            </Card>

            {/* Pict of Measurement */}
            <Card>
              <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                <h4 className="font-semibold">Foto Pengukuran</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                  label="Tampak Samping Kanan"
                  invalid={false}
                  errorMessage=""
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Unggah foto pengukuran dari samping kanan
                  </p>
                  <Upload
                    showList={false}
                    uploadLimit={1}
                    onChange={(files) => {
                      if (files.length > 0) {
                        setPhotoFiles({ ...photoFiles, right: files[0] })
                      }
                    }}
                  >
                    <Button variant="solid" type="button">
                      Unggah di sini
                    </Button>
                  </Upload>
                </FormItem>

                <FormItem
                  label="Tampak Samping Kiri"
                  invalid={false}
                  errorMessage=""
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Unggah foto pengukuran dari samping kiri
                  </p>
                  <Upload
                    showList={false}
                    uploadLimit={1}
                    onChange={(files) => {
                      if (files.length > 0) {
                        setPhotoFiles({ ...photoFiles, left: files[0] })
                      }
                    }}
                  >
                    <Button variant="solid" type="button">
                      Unggah di sini
                    </Button>
                  </Upload>
                </FormItem>

                <FormItem label="Tampak Depan" invalid={false} errorMessage="">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Unggah foto pengukuran dari depan
                  </p>
                  <Upload
                    showList={false}
                    uploadLimit={1}
                    onChange={(files) => {
                      if (files.length > 0) {
                        setPhotoFiles({ ...photoFiles, front: files[0] })
                      }
                    }}
                  >
                    <Button variant="solid" type="button">
                      Unggah di sini
                    </Button>
                  </Upload>
                </FormItem>

                <FormItem
                  label="Tampak Belakang"
                  invalid={false}
                  errorMessage=""
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Unggah foto pengukuran dari belakang
                  </p>
                  <Upload
                    showList={false}
                    uploadLimit={1}
                    onChange={(files) => {
                      if (files.length > 0) {
                        setPhotoFiles({ ...photoFiles, back: files[0] })
                      }
                    }}
                  >
                    <Button variant="solid" type="button">
                      Unggah di sini
                    </Button>
                  </Upload>
                </FormItem>
              </div>
            </Card>

            {/* Result of Measurement */}
            <Card>
              <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                <h4 className="font-semibold">Hasil Pengukuran</h4>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Berdasarkan hasil pengukuran, dapat disimpulkan bahwa hasil
                  latihan member dengan trainer adalah:
                </p>
              </div>
              <FormItem
                label="Penilaian"
                invalid={Boolean(errors.result)}
                errorMessage={errors.result?.message}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                  WAJIB diisi. Pilih penilaian hasil latihan member berdasarkan
                  pengukuran
                </p>
                <Controller
                  name="result"
                  control={control}
                  render={({ field }) => (
                    <Radio.Group
                      value={field.value || ''}
                      onChange={(val) => field.onChange(val)}
                    >
                      {resultOptions.map((option) => (
                        <Radio key={option.value} value={option.value}>
                          {option.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  )}
                />
              </FormItem>

              <FormItem
                label="Catatan"
                className="w-full mt-4"
                invalid={Boolean(errors.notes)}
                errorMessage={errors.notes?.message}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                  WAJIB diisi. Catatan bebas (misal: &quot;kurang tidur&quot;,
                  &quot;baru sembuh sakit&quot;)
                </p>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Input
                      textArea
                      type="text"
                      placeholder="Catatan"
                      {...field}
                      value={field.value || ''}
                    />
                  )}
                />
              </FormItem>
            </Card>

            {/* Nutrition Target */}
            <Card>
              <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                <h4 className="font-semibold">Target Nutrisi</h4>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <FormItem
                  label="Target Kalori"
                  invalid={Boolean(errors.calorie_target_kcal)}
                  errorMessage={errors.calorie_target_kcal?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    WAJIB jika main nutrisi. Contoh: Fat loss = berat (kg) ×
                    25-30, Muscle gain = berat (kg) × 30-35 (dalam Kcal)
                  </p>
                  <Controller
                    name="calorie_target_kcal"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Target Kalori (Kcal)"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Skor Kepatuhan"
                  invalid={Boolean(errors.adherence_score)}
                  errorMessage={errors.adherence_score?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    WAJIB jika main nutrisi. Penilaian kepatuhan periode
                    sebelumnya (1-10): 8-10 = patuh, 5-7 = lumayan, 1-4 = sering
                    &quot;ngaco&quot;
                  </p>
                  <Controller
                    name="adherence_score"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Skor Kepatuhan (1-10)"
                        min={1}
                        max={10}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  label="Faktor Aktivitas"
                  invalid={Boolean(errors.activity_factor)}
                  errorMessage={errors.activity_factor?.message}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                    Opsional. Lebih baik dihitung otomatis oleh sistem dari
                    history sesi latihan (1.2-1.8)
                  </p>
                  <Controller
                    name="activity_factor"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Faktor Aktivitas (1.2-1.8)"
                        min={1.2}
                        max={1.8}
                        step={0.1}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || null
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </FormItem>
              </div>
            </Card>
          </div>

          <BottomStickyBar className="px-4 py-3">
            <div className="flex items-center justify-between">
              <Button variant="plain" onClick={handleClose}>
                Batal
              </Button>
              <Button
                variant="solid"
                type="submit"
                loading={create.isPending || update.isPending}
              >
                {type === 'create' ? 'Buat' : 'Simpan'}
              </Button>
            </div>
          </BottomStickyBar>
        </Form>
      </Container>

      <AlertConfirm
        open={confirmDelete}
        title="Hapus Pengukuran"
        description="Apakah Anda yakin ingin menghapus pengukuran ini?"
        type="delete"
        loading={deleteItem.isPending}
        onClose={() => setConfirmDelete(false)}
        onLeftClick={() => setConfirmDelete(false)}
        onRightClick={handleDelete}
      />
    </>
  )
}

export default FormPageMeasurement
