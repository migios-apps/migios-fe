import {
  Button,
  Calendar,
  DatePicker,
  Popover,
  RangeCalendar,
} from '@/components/ui'
import { PopoverContentProps } from '@/components/ui/Popover'
import {
  MenuDatePicker,
  NamesActionDatePicker,
  TypesActionDatePicker,
  getMenuShortcutDatePickerByType,
  menusShortcutDatePicker,
} from '@/components/ui/hooks/useDatePicker'
import cn from '@/utils/classNames'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useEffect, useState } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

dayjs.extend(isBetween)

export type DatePickerAIOPropsValue = {
  type: TypesActionDatePicker | undefined
  name: string | undefined
  date: Array<string | null | undefined>
}

export type ValueRangeDatePickerAIO = {
  startDate: Dayjs | null | undefined
  endDate: Dayjs | null | undefined
}

export type ValueSingleDatePickerAIO = Dayjs | null | undefined

export interface DatePickerAIOProps {
  onChange?: (value: DatePickerAIOPropsValue) => void
  formatCalendar?: string
  variant: 'single' | 'range'
  value: DatePickerAIOPropsValue
  className?: string
  align?: PopoverContentProps['align']
  options?: TypesActionDatePicker[]
}

const DatePickerAIO = ({
  variant = 'single',
  value,
  onChange,
  className,
  align,
  options = [
    'today',
    'yesterday',
    'sevenDaysAgo',
    'thirtyDaysAgo',
    'thisMonth',
    'lastMonth',
    'thisYear',
    'all',
    'custom',
  ],
}: DatePickerAIOProps) => {
  const [date, setDate] = useState<Dayjs | null | undefined>(
    value ? dayjs(value?.date[0]) : undefined
  )
  const [startDate, setStartDate] = useState<Dayjs | null | undefined>(
    value ? dayjs(value?.date[0]) : undefined
  )
  const [endDate, setEndDate] = useState<Dayjs | null | undefined>(
    value ? dayjs(value?.date[1]) : undefined
  )
  const defaultMenu = value?.type
    ? getMenuShortcutDatePickerByType(value.type).menu
    : undefined
  const [menuSelected, setMenuSelected] = useState<MenuDatePicker | undefined>(
    defaultMenu
  )
  const [errorMessage, setErrorMessage] = useState('')

  const [open, setOpen] = useState(false)
  const [isCustom, setIsCustom] = useState<boolean>(false)

  useEffect(() => {
    setDate(value ? dayjs(value?.date[0]) : undefined)
    setStartDate(value ? dayjs(value?.date[0]) : undefined)
    setEndDate(value ? dayjs(value?.date[1]) : undefined)
    setMenuSelected(defaultMenu)
  }, [defaultMenu, value])

  const onChangeDateCalender = (date: Dayjs | null) => {
    setDate(date)
    onChange?.({
      type: 'today',
      name: NamesActionDatePicker.today,
      date: [date?.format(), date?.format()],
    })
    setOpen(false)
  }

  // const onChangeDateCalenderRange = (date: Dayjs | null) => {
  //   if (endDate?.isValid()) {
  //     setStartDate(date)
  //     setEndDate(null)
  //   } else {
  //     if (date?.isBefore(startDate)) {
  //       setStartDate(date)
  //       setEndDate(null)
  //     } else {
  //       setEndDate(date)
  //     }
  //   }
  // }

  const onChangeStartPicker = (value: Dayjs | null) => {
    setStartDate(value)
  }
  const onChangeEndPicker = (value: Dayjs | null) => {
    setEndDate(value)
  }

  const onChangeMenuSelected = (type: string) => {
    const getMenuSelected = menusShortcutDatePicker.find(
      (val) => type === val.type
    )
    if (!getMenuSelected) return
    setMenuSelected(getMenuSelected)
    setStartDate(dayjs(getMenuSelected.options.defaultStartDate))
    setEndDate(dayjs(getMenuSelected.options.defaultEndDate))
  }

  useEffect(() => {
    // Handle is custom
    if (variant === 'single') return

    if (
      startDate?.isSame(menuSelected?.options.defaultStartDate) &&
      endDate?.isSame(menuSelected?.options.defaultEndDate)
    ) {
      if (value.type === menuSelected?.type) setIsCustom(false)
    } else {
      setIsCustom(true)
    }
  }, [
    variant,
    endDate,
    menuSelected?.options.defaultEndDate,
    menuSelected?.options.defaultStartDate,
    startDate,
    value.type,
    menuSelected?.type,
  ])

  const onPrevSingle = () => {
    const prevDate = date?.add(-1, 'day')
    setDate(prevDate)
    onChange?.({
      type: 'today',
      name: NamesActionDatePicker.today,
      date: [prevDate?.format(), prevDate?.format()],
    })
  }
  const onNextSingle = () => {
    const nextDate = date?.add(1, 'day')
    setDate(nextDate)
    onChange?.({
      type: 'today',
      name: NamesActionDatePicker.today,
      date: [nextDate?.format(), nextDate?.format()],
    })
  }

  const onPrevRange = () => {
    if (!startDate || !endDate || menuSelected?.type === 'all') return

    const totalDays = endDate.diff(startDate, 'day') + 1
    const prevStartDate = startDate.clone().subtract(totalDays, 'days')
    const prevEndDate = endDate.clone().subtract(totalDays, 'days')

    setStartDate(prevStartDate)
    setEndDate(prevEndDate)

    onChange?.({
      type: menuSelected?.type,
      name: menuSelected?.name,
      date: [prevStartDate.format(), prevEndDate.format()],
    })
  }

  const onNextRange = () => {
    if (!startDate || !endDate || menuSelected?.type === 'all') return

    const totalDays = endDate.diff(startDate, 'day') + 1
    const nextStartDate = startDate.clone().add(totalDays, 'days')
    const nextEndDate = endDate.clone().add(totalDays, 'days')

    setStartDate(nextStartDate)
    setEndDate(nextEndDate)

    onChange?.({
      type: menuSelected?.type,
      name: menuSelected?.name,
      date: [nextStartDate.format(), nextEndDate.format()],
    })
  }

  const onApplyPicker = () => {
    if (variant === 'single') {
      onChange?.({
        type: 'today',
        name: NamesActionDatePicker.today,
        date: [date?.format(), date?.format()],
      })
    } else {
      if (startDate?.isAfter(endDate)) {
        setErrorMessage('Start date must be before end date')
      } else {
        setIsCustom(false)
        onChange?.({
          type: menuSelected?.type,
          name: menuSelected?.name,
          date: [startDate?.format(), endDate?.format()],
        })
      }
    }

    if (startDate?.isAfter(endDate)) return
    setOpen(false)
    setErrorMessage('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full cursor-pointer select-none transition-all duration-100',
          className
        )}
      >
        <Button
          variant="plain"
          className="p-2 text-xl text-gray-700 dark:text-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={value?.type === 'all'}
          onClick={variant === 'single' ? onPrevSingle : onPrevRange}
        >
          <HiChevronLeft className="w-5 h-5" />
        </Button>

        <Popover.PopoverTrigger asChild>
          <div className="flex flex-col items-center justify-center w-full text-xl">
            {variant === 'single' ? (
              <>
                <h6 className="text-base font-semibold text-center text-primary line-clamp-1">
                  {dayjs(value?.date[0]).format('YYYY-MM-DD') ===
                  dayjs().format('YYYY-MM-DD')
                    ? 'Hari ini'
                    : ''}
                </h6>
                <p className="text-sm text-gray-500 dark:text-gray-300 text-center line-clamp-1">
                  {dayjs(value?.date[0]).format('DD MMMM YYYY')}
                </p>
              </>
            ) : null}

            {variant === 'range' ? (
              <>
                <h6 className="text-base font-semibold text-center text-primary line-clamp-1">
                  {!isCustom && value.type !== 'custom' ? value?.name : ''}
                </h6>
                <p className="text-sm text-gray-500 dark:text-gray-300 text-center line-clamp-1">
                  {value?.type !== 'all'
                    ? `${dayjs(value?.date[0]).format('DD MMM YYYY')} - ${dayjs(
                        value?.date[1]
                      ).format('DD MMM YYYY')}`
                    : ''}
                </p>
              </>
            ) : null}
          </div>
        </Popover.PopoverTrigger>

        <Button
          variant="plain"
          className="p-2 text-xl text-gray-700 dark:text-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={value?.type === 'all'}
          onClick={variant === 'single' ? onNextSingle : onNextRange}
        >
          <HiChevronRight className="w-5 h-5" />
        </Button>
      </div>
      <Popover.PopoverContent
        align={align}
        className="w-auto bg-white shadow-md dark:bg-gray-800 p-0 rounded-xl border-gray-200 dark:border-gray-500"
      >
        {variant === 'single' ? (
          <div className="flex flex-col p-2">
            <Calendar
              value={date?.toDate()}
              onChange={(date) => onChangeDateCalender(dayjs(date))}
            />
            <div className="flex justify-between gap-4 px-4 py-2">
              <span>{date?.format('DD MMMM YYYY')}</span>
              <span className="text-base font-semibold">
                {date?.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
                  ? 'Hari ini'
                  : ''}
              </span>
            </div>
          </div>
        ) : (
          ''
        )}
        {variant === 'range' ? (
          <div className="flex flex-col">
            <div className="px-4 py-2">
              <h6 className="text-lg font-semibold">Tanggal</h6>
            </div>
            <div className="flex flex-col md:flex-row gap-4 px-4">
              <div className="min-w-[128px] grid grid-cols-2 md:grid-cols-1 h-max gap-2">
                {menusShortcutDatePicker
                  .filter((menu) => options.includes(menu.type))
                  .map((menu, index) => (
                    <Button
                      key={index}
                      variant="plain"
                      className={cn(
                        `!px-6 !py-2 !h-auto truncate cursor-pointer select-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:!border-primary hover:!text-primary`,
                        {
                          '!bg-primary !text-white hover:bg-primary hover:!text-white':
                            menuSelected?.type === menu.type,
                        }
                      )}
                      onClick={() => onChangeMenuSelected(menu.type)}
                    >
                      {menu.name}
                    </Button>
                  ))}
              </div>
              <div className="flex flex-col">
                {menuSelected?.options.readOnlyCalendar ? (
                  <RangeCalendar
                    maxDate={dayjs().toDate()}
                    value={[
                      startDate?.toDate() ?? null,
                      endDate?.toDate() ?? null,
                    ]}
                    onChange={(range) => {
                      if (range[0] && dayjs(range[0]).isValid())
                        setStartDate(dayjs(range[0]))
                      if (range[1] && dayjs(range[1]).isValid())
                        setEndDate(dayjs(range[1]))
                    }}
                  />
                ) : (
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal mulai
                      </label>
                      <DatePicker
                        value={startDate?.toDate()}
                        clearable={false}
                        disabled={menuSelected?.options.readOnlyCalendar}
                        onChange={(date) =>
                          onChangeStartPicker(date ? dayjs(date as any) : null)
                        }
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal akhir
                      </label>
                      <DatePicker
                        value={endDate?.toDate()}
                        clearable={false}
                        disabled={menuSelected?.options.readOnlyCalendar}
                        onChange={(date) =>
                          onChangeEndPicker(date ? dayjs(date as any) : null)
                        }
                      />
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
              </div>
            </div>
            <div className="px-4 py-2 flex gap-2 mt-4">
              <Button
                variant="default"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Batalkan
              </Button>
              <Button
                variant="solid"
                className="w-full"
                onClick={onApplyPicker}
              >
                Terapkan
              </Button>
            </div>
          </div>
        ) : null}
      </Popover.PopoverContent>
    </Popover>
  )
}

export default DatePickerAIO
