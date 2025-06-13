import {
  Avatar,
  Button,
  FormItem,
  Input,
  PhoneInput,
  Upload,
} from '@/components/ui'
import { ArrowRight2, Image } from 'iconsax-react'
import React from 'react'
import { Controller } from 'react-hook-form'
import { ReturnClubFormSchema } from './validation'

type PropsType = {
  onNext?: () => void
  formProps: ReturnClubFormSchema
}

const Step1: React.FC<PropsType> = ({ onNext, formProps }) => {
  const {
    control,
    formState: { errors },
  } = formProps

  const [avatarImg, setAvatarImg] = React.useState<string | null>(null)

  const onFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setAvatarImg(URL.createObjectURL(files[0]))
    }
  }

  const beforeUpload = (files: FileList | null) => {
    let valid: string | boolean = true

    const allowedFileType = ['image/jpeg', 'image/png']
    if (files) {
      for (const file of files) {
        if (!allowedFileType.includes(file.type)) {
          valid = 'Please upload a .jpeg or .png file!'
        }
      }
    }

    return valid
  }
  return (
    <div className="relative max-w-[30rem]">
      <h2>Beritahu kami sedikit tentang gym anda</h2>
      <span className="text-lg">
        Isi form ini untuk membantu kami mengetahui lebih lanjut tentang gym
        anda
      </span>
      <div className="w-full flex flex-col mt-4">
        <div className="w-full flex gap-4 items-center">
          <Upload
            className="cursor-pointer"
            showList={false}
            uploadLimit={1}
            beforeUpload={beforeUpload}
            onChange={onFileUpload}
          >
            <Avatar
              size={80}
              className="bg-gray-300 text-gray-600 dark:bg-gray-500/20 dark:text-gray-100"
              src={avatarImg as string}
              icon={<Image color="currentColor" size={50} variant="Bulk" />}
            />
          </Upload>
          <FormItem
            asterisk
            label="Nama Gym"
            className="w-full"
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
                  placeholder="Nama Gym"
                  {...field}
                />
              )}
            />
          </FormItem>
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
          label="Alamat Gym"
          className="w-full mb-2"
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
                placeholder="Tulis alamat lengkap untuk lokasi gym Anda."
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </FormItem>
      </div>
      <div className="flex justify-end items-center w-full">
        <Button
          type="submit"
          variant="solid"
          size="md"
          className="mt-4 w-full rounded-full"
          icon={
            <ArrowRight2 color="currentColor" size={18} variant="Outline" />
          }
          iconAlignment="end"
          onClick={onNext}
        >
          Step berikutnya
        </Button>
      </div>
    </div>
  )
}

export default Step1
