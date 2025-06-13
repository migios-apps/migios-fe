import { Button, FormItem, Input, Select } from '@/components/ui'
import cn from '@/utils/classNames'
import { ArrowRight2 } from 'iconsax-react'
import React from 'react'
import { Controller } from 'react-hook-form'
import { ReturnClubFormSchema, howdidfindus } from './validation'

type PropsType = {
  onSkip?: () => void
  onNext?: () => void
  formProps: ReturnClubFormSchema
}

const homany_staff = [
  { value: '1', label: 'Just me' },
  { value: '2-4', label: '2-4' },
  { value: '5-9', label: '5-9' },
  { value: '10+', label: '10+' },
]

const howmany_member = [
  { value: '-50', label: 'Under 50' },
  { value: '50-100', label: '50-100' },
  { value: '101-200', label: '101-200' },
  { value: '201-400', label: '201-400' },
  { value: '400+', label: '400+' },
]

const howmany_location = [
  { value: '1', label: '1' },
  { value: '2-4', label: '2-4' },
  { value: '5-10', label: '5-10' },
  { value: '10+', label: '10+' },
]

const Step2: React.FC<PropsType> = ({ onNext, onSkip, formProps }) => {
  const {
    control,
    watch,
    formState: { errors },
  } = formProps

  const watchData = watch()

  return (
    <div className="relative">
      <h2>Ceritakan sedikit tentang bisnis Anda</h2>
      <span className="text-lg">
        Ini membantu mempersonalisasikan pengalaman Anda dengan sistem migios
      </span>
      <div className="w-full flex flex-col mt-8 gap-8">
        <div className="flex flex-col">
          <h6 className="mb-2">Berapa banyak anggota staf yang Anda miliki?</h6>
          <FormItem
            label=""
            className="mb-0"
            invalid={Boolean(errors.about_club?.total_staff)}
            errorMessage={errors.about_club?.total_staff?.message}
          >
            <Controller
              name="about_club.total_staff"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {homany_staff.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <Button
                        variant="default"
                        size="sm"
                        className={cn('w-full min-w-28', {
                          'border-primary text-primary border-2':
                            field.value === option.value,
                        })}
                        value={option.value}
                        onClick={() => field.onChange(option.value)}
                      >
                        {option.label}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            />
          </FormItem>
        </div>

        <div className="flex flex-col">
          <h6 className="mb-2">
            Berapa banyak anggota yang menghadiri gym Anda?
          </h6>
          <FormItem
            label=""
            className="mb-0"
            invalid={Boolean(errors.about_club?.total_member)}
            errorMessage={errors.about_club?.total_member?.message}
          >
            <Controller
              name="about_club.total_member"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {howmany_member.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <Button
                        variant="default"
                        size="sm"
                        className={cn('w-full min-w-28', {
                          'border-primary text-primary border-2':
                            field.value === option.value,
                        })}
                        value={option.value}
                        onClick={() => field.onChange(option.value)}
                      >
                        {option.label}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            />
          </FormItem>
        </div>

        <div className="flex flex-col">
          <h6 className="mb-2">
            Berapa banyak lokasi yang dimiliki bisnis Anda?
          </h6>
          <FormItem
            label=""
            className="mb-0"
            invalid={Boolean(errors.about_club?.total_location)}
            errorMessage={errors.about_club?.total_location?.message}
          >
            <Controller
              name="about_club.total_location"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {howmany_location.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <Button
                        variant="default"
                        size="sm"
                        className={cn('w-full min-w-28', {
                          'border-primary text-primary border-2':
                            field.value === option.value,
                        })}
                        value={option.value}
                        onClick={() => field.onChange(option.value)}
                      >
                        {option.label}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            />
          </FormItem>
        </div>

        <div className="flex flex-col">
          <h2>Bagaimana Anda menemukan kami? </h2>
          <span className="text-lg">* Opsional, tapi dihargai!</span>
          <FormItem
            label=""
            className="mb-0"
            invalid={Boolean(errors.about_club?.how_did_find_us)}
            errorMessage={errors.about_club?.how_did_find_us?.message}
          >
            <Controller
              name="about_club.how_did_find_us"
              control={control}
              render={({ field }) => (
                <div className="w-full flex flex-col mt-4 gap-4">
                  <Select
                    isSearchable={false}
                    placeholder="Select..."
                    value={
                      watch('about_club.is_other_find_us')
                        ? howdidfindus.find(
                            (option) => option.value === 'Other'
                          )
                        : howdidfindus.find(
                            (option) => option.value === field.value
                          )
                    }
                    options={howdidfindus}
                    onChange={(value) => {
                      formProps.setValue(
                        'about_club.is_other_find_us',
                        value?.value === 'Other'
                      )
                      if (value?.value !== 'Other') {
                        field.onChange(value?.value)
                      } else {
                        field.onChange(undefined)
                      }
                    }}
                  />
                  {watch('about_club.is_other_find_us') && (
                    <Input
                      textArea
                      type="text"
                      autoComplete="off"
                      placeholder="How did you find us?"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                </div>
              )}
            />
          </FormItem>
        </div>
      </div>
      <div className="flex justify-between items-end w-full mt-8">
        <Button
          variant="plain"
          size="md"
          className="rounded-full px-0 text-start"
          onClick={onSkip}
        >
          Lewati tahap ini
        </Button>
        <Button
          disabled={
            !watchData.about_club?.total_staff ||
            !watchData.about_club?.total_member ||
            !watchData.about_club?.total_location
          }
          type="submit"
          variant="solid"
          size="md"
          className="mt-4 min-w-32 rounded-full"
          icon={
            <ArrowRight2 color="currentColor" size={18} variant="Outline" />
          }
          iconAlignment="end"
          onClick={onNext}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  )
}

export default Step2
