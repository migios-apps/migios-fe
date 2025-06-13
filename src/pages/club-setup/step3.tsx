import { Button, Card, Checkbox, FormItem } from '@/components/ui'
import cn from '@/utils/classNames'
import { Add, ArrowRight2 } from 'iconsax-react'
import { useState } from 'react'
import { ReturnClubFormSchema } from './validation'

type PropsType = {
  onSkip?: () => void
  onNext?: () => void
  formProps: ReturnClubFormSchema
}

type ProgramType = 'membership' | 'pt_program' | 'class'
type ProgramProps = {
  id: number
  title: string
  type: ProgramType
  desc: string
  img: string
  category: {
    label: string
    value: string
  }[]
}

const programs: ProgramProps[] = [
  {
    id: 1,
    title: 'Membership',
    type: 'membership',
    desc: 'Siapkan program membership untuk anggota Anda.',
    img: '/img/others/membership.jpg',
    category: [],
  },
  {
    id: 2,
    title: 'Personal Training',
    type: 'pt_program',
    desc: 'Siapkan program personal trainer untuk anggota Anda.',
    img: '/img/others/pt-program.jpg',
    category: [],
  },
  {
    id: 3,
    title: 'Class Program',
    type: 'class',
    desc: 'Siapkan program kelas untuk anggota Anda.',
    img: '/img/others/yoga.jpg',
    category: [
      {
        label: 'Yoga',
        value: 'Yoga',
      },
      {
        label: 'Pilates',
        value: 'Pilates',
      },
      {
        label: 'Zumba',
        value: 'Zumba',
      },
      {
        label: 'Cardio',
        value: 'Cardio',
      },
    ],
  },
]

const programTypeOrder = {
  membership: 0,
  pt_program: 1,
  class: 2,
}

const Step3: React.FC<PropsType> = ({ onNext, onSkip, formProps }) => {
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const { watch, setValue } = formProps

  const watchData = watch()
  const dataPrograms = watchData.programs || []

  return (
    <div className="relative max-w-[35rem] w-full">
      <h2>Program apa yang Anda jalankan?</h2>
      <span className="text-lg">
        Program digunakan untuk mengatur keanggotaan dan akses sesi, serta
        melacak kemajuan member.
      </span>
      <div className="w-full flex flex-col mt-8 gap-4">
        {programs.map((item, index) => (
          <div key={index} className="flex flex-col">
            <Card
              bordered
              className={cn(
                'relative bg-cover bg-center overflow-hidden border-none',
                item.category?.length > 0 &&
                  watchData.programs?.map((p) => p.type).includes(item.type)
                  ? 'rounded-bl-none rounded-br-none'
                  : ''
              )}
              style={{
                backgroundImage: `url('${item.img}')`,
                backgroundPositionY: item.id === 2 ? '30%' : 'center',
              }}
            >
              <div className="absolute inset-0 bg-black opacity-55 z-0"></div>
              <div className="relative flex justify-between items-center gap-4 w-full text-white z-10">
                <div className="flex flex-col">
                  <h5 className="text-white">{item.title}</h5>
                  <span>{item.desc}</span>
                </div>
                <div className="flex">
                  <Checkbox
                    checked={Boolean(
                      dataPrograms.map((p) => p.type).includes(item.type)
                    )}
                    onChange={(value) => {
                      if (value) {
                        setValue(
                          'programs',
                          [
                            ...dataPrograms,
                            {
                              name: item.title,
                              type: item.type,
                              classes: [],
                            },
                          ].sort(
                            (a, b) =>
                              programTypeOrder[a.type as ProgramType] -
                              programTypeOrder[b.type as ProgramType]
                          )
                        )
                      } else {
                        setValue(
                          'programs',
                          dataPrograms
                            .filter((p) => p.type !== item.type)
                            .sort(
                              (a, b) =>
                                programTypeOrder[a.type as ProgramType] -
                                programTypeOrder[b.type as ProgramType]
                            )
                        )
                      }
                    }}
                  />
                </div>
              </div>
            </Card>
            <div
              className={cn(
                'flex flex-wrap gap-2',
                item.category?.length > 0 &&
                  watchData.programs?.map((p) => p.type).includes(item.type)
                  ? 'border-2 border-primary dark:border-gray-700 rounded-bl-2xl rounded-br-2xl p-3 pt-8 -mt-4'
                  : 'hidden'
              )}
            >
              {item.category?.map((option, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex gap-2 border border-gray-300 dark:border-gray-600 rounded-xl p-2">
                    <span>{option.label}</span>
                    <Checkbox
                      checked={Boolean(
                        dataPrograms
                          .find((p) => p.type === item.type)
                          ?.classes?.includes(option.value)
                      )}
                      onChange={(checked) => {
                        const program = dataPrograms.find(
                          (p) => p.type === item.type
                        )

                        if (checked && program) {
                          setValue(
                            'programs',
                            dataPrograms.map((p) =>
                              p.type === item.type
                                ? {
                                    ...p,
                                    classes: [...p.classes, option.value],
                                  }
                                : p
                            )
                          )
                        } else if (program) {
                          setValue(
                            'programs',
                            dataPrograms.map((p) =>
                              p.type === item.type
                                ? {
                                    ...p,
                                    classes: p.classes.filter(
                                      (c) => c !== option.value
                                    ),
                                  }
                                : p
                            )
                          )
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
              {dataPrograms
                .find((p) => p.type === item.type)
                ?.classes?.filter(
                  (className) =>
                    !item.category?.some((c) => c.value === className)
                )
                .map((className, index) => (
                  <div key={`custom-${index}`} className="flex items-center">
                    <div className="flex gap-2 border border-gray-300 dark:border-gray-600 rounded-xl p-2">
                      <span>{className}</span>
                      <Checkbox
                        checked
                        onChange={(checked) => {
                          const program = dataPrograms.find(
                            (p) => p.type === item.type
                          )

                          if (!checked && program) {
                            setValue(
                              'programs',
                              dataPrograms.map((p) =>
                                p.type === item.type
                                  ? {
                                      ...p,
                                      classes: p.classes.filter(
                                        (c) => c !== className
                                      ),
                                    }
                                  : p
                              )
                            )
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              {item.category.length > 0 && (
                <>
                  {!showNewCategory ? (
                    <div className="flex items-center">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex gap-2"
                        icon={<Add color="currentColor" size={24} />}
                        onClick={() => setShowNewCategory(true)}
                      >
                        Tambahkan lainnya
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FormItem className="mb-0 flex-1">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Nama kategori baru"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newCategory.trim()) {
                              const classProgram = dataPrograms.find(
                                (p) => p.type === item.type
                              )

                              if (classProgram) {
                                setValue(
                                  'programs',
                                  dataPrograms.map((p) =>
                                    p.type === 'class'
                                      ? {
                                          ...p,
                                          classes: [
                                            ...p.classes,
                                            newCategory.trim(),
                                          ],
                                        }
                                      : p
                                  )
                                )
                              }
                              setNewCategory('')
                              setShowNewCategory(false)
                            } else if (e.key === 'Escape') {
                              setNewCategory('')
                              setShowNewCategory(false)
                            }
                          }}
                        />
                      </FormItem>
                      <Button
                        variant="default"
                        size="sm"
                        disabled={!newCategory.trim()}
                        onClick={() => {
                          if (newCategory.trim()) {
                            const classProgram = dataPrograms.find(
                              (p) => p.type === item.type
                            )

                            if (classProgram) {
                              setValue(
                                'programs',
                                dataPrograms.map((p) =>
                                  p.type === 'class'
                                    ? {
                                        ...p,
                                        classes: [
                                          ...p.classes,
                                          newCategory.trim(),
                                        ],
                                      }
                                    : p
                                )
                              )
                            }
                            setNewCategory('')
                            setShowNewCategory(false)
                          }
                        }}
                      >
                        Tambah
                      </Button>
                      <Button
                        variant="plain"
                        size="sm"
                        onClick={() => {
                          setNewCategory('')
                          setShowNewCategory(false)
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
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

export default Step3
