import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import classNames from '@/utils/classNames'
import {
  CalendarOptions,
  DayCellContentArg,
  DayHeaderContentArg,
  EventClickArg,
  EventContentArg,
  MoreLinkArg,
} from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import Loading from './Loading'

type EventItemProps = {
  info: EventContentArg
}

type DayHeaderProps = {
  info: DayHeaderContentArg
}

type DayRenderProps = {
  info: DayCellContentArg
}

interface CalendarViewProps extends CalendarOptions {
  wrapperClass?: string
  isLoading?: boolean
  showHeader?: boolean
  initialView?: 'timeGridWeek' | 'timeGridDay' | 'dayGridMonth'
  onEventClick?: (arg: EventClickArg['event']) => void
  handleCreateEvent?: () => void
}

const CalendarView = (props: CalendarViewProps) => {
  const {
    wrapperClass,
    isLoading = false,
    showHeader = true,
    initialView = 'dayGridMonth',
    onEventClick,
    handleCreateEvent,
    ...rest
  } = props
  const calendarRef = useRef<any>(null)
  const [currentView, setCurrentView] = useState<string>(initialView)
  const [currentTime, setCurrentTime] = useState<string>(
    dayjs().format('HH:mm:ss')
  )
  const [currentDate, setCurrentDate] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  )
  const [calendarTitle, setCalendarTitle] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalEvents, setModalEvents] = useState<MoreLinkArg['allSegs']>([])

  const formatCalendarTitle = (date: string, view: string) => {
    const dateObj = dayjs(date)

    switch (view) {
      case 'dayGridMonth':
        return dateObj.format('MMMM YYYY')
      case 'timeGridWeek': {
        const start = dateObj.startOf('week')
        const end = dateObj.endOf('week')
        const isSameMonth = start.format('MMM') === end.format('MMM')
        const isSameYear = start.format('YYYY') === end.format('YYYY')

        if (isSameMonth && isSameYear) {
          return `${start.format('D')} - ${end.format('D')} ${start.format('MMM YYYY')}`
        } else if (isSameYear) {
          return `${start.format('D MMM')} - ${end.format('D MMM YYYY')}`
        } else {
          return `${start.format('D MMM YYYY')} - ${end.format('D MMM YYYY')}`
        }
      }
      case 'timeGridDay':
        return dateObj.format('D MMMM YYYY')
      default:
        return dateObj.format('MMMM YYYY')
    }
  }

  useEffect(() => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    setCurrentTime(`${hours}:${minutes}:00`)

    // Set tanggal awal sesuai view
    let initialDate = dayjs()
    if (currentView === 'timeGridWeek') {
      initialDate = initialDate.startOf('week')
    }
    setCurrentDate(initialDate.format('YYYY-MM-DD'))
    setCalendarTitle(
      formatCalendarTitle(initialDate.format('YYYY-MM-DD'), currentView)
    )
  }, [currentView])

  const handleViewChange = (newView: string) => {
    const api = calendarRef.current?.getApi()
    if (!api) return

    let newDate = dayjs()

    // Reset ke minggu ini atau hari ini saat ganti view
    if (newView === 'timeGridWeek') {
      newDate = dayjs().startOf('week')
      api.gotoDate(newDate.toDate())
    } else if (newView === 'timeGridDay') {
      newDate = dayjs()
      api.gotoDate(newDate.toDate())
    }

    setCurrentView(newView as any)
    setCurrentDate(newDate.format('YYYY-MM-DD'))
    setCalendarTitle(formatCalendarTitle(newDate.format('YYYY-MM-DD'), newView))
  }

  const handleNavigation = (action: 'prev' | 'next' | 'today') => {
    const api = calendarRef.current?.getApi()
    if (!api) return

    let newDate
    if (action === 'prev') {
      if (currentView === 'timeGridDay') {
        newDate = dayjs(api.getDate()).subtract(1, 'day')
      } else if (currentView === 'timeGridWeek') {
        newDate = dayjs(api.getDate()).subtract(1, 'week')
      } else {
        newDate = dayjs(api.getDate()).subtract(1, 'month')
      }
      api.gotoDate(newDate.toDate())
    } else if (action === 'next') {
      if (currentView === 'timeGridDay') {
        newDate = dayjs(api.getDate()).add(1, 'day')
      } else if (currentView === 'timeGridWeek') {
        newDate = dayjs(api.getDate()).add(1, 'week')
      } else {
        newDate = dayjs(api.getDate()).add(1, 'month')
      }
      api.gotoDate(newDate.toDate())
    } else {
      // Untuk today, langsung ke periode saat ini sesuai view
      if (currentView === 'timeGridWeek') {
        newDate = dayjs().startOf('week')
      } else if (currentView === 'timeGridDay') {
        newDate = dayjs()
      } else {
        newDate = dayjs().startOf('month')
      }
      api.gotoDate(newDate.toDate())
    }

    setCurrentDate(newDate.format('YYYY-MM-DD'))
    setCalendarTitle(
      formatCalendarTitle(newDate.format('YYYY-MM-DD'), currentView)
    )
  }

  const isCurrentRange = () => {
    const today = dayjs()
    const currentDate = dayjs(calendarRef.current?.getApi()?.getDate())

    if (currentView === 'timeGridDay') {
      return today.format('YYYY-MM-DD') === currentDate.format('YYYY-MM-DD')
    } else if (currentView === 'timeGridWeek') {
      const startOfWeek = currentDate.startOf('week')
      const endOfWeek = currentDate.endOf('week')
      return today.isAfter(startOfWeek) && today.isBefore(endOfWeek)
    } else {
      const startOfMonth = currentDate.startOf('month')
      const endOfMonth = currentDate.endOf('month')
      return today.isAfter(startOfMonth) && today.isBefore(endOfMonth)
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  const handleEventClick = (event: EventClickArg['event']) => {
    onEventClick?.(event)
  }

  const EventItem = ({ info }: EventItemProps) => {
    const { start, end, title, backgroundColor, textColor } = info.event
    const { isEnd, isStart } = info
    const startTime = start ? dayjs(start).format('HH:mm') : null
    const endTime = end ? dayjs(end).format('HH:mm') : null
    const startEndTime = [startTime, endTime].filter(Boolean).join('-')
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor,
          color: textColor,
        }}
        className={classNames(
          'custom-calendar-event cursor-pointer',
          isEnd &&
            !isStart &&
            '!rounded-tl-none !rounded-bl-none !rtl:rounded-tr-none !rtl:rounded-br-none',
          !isEnd &&
            isStart &&
            '!rounded-tr-none !rounded-br-none !rtl:rounded-tl-none !rtl:rounded-bl-none'
        )}
      >
        <div className="flex flex-col w-full">
          <span className="font-bold truncate">{title}</span>
          <div className="flex">
            <span className="text-xs whitespace-normal break-words overflow-wrap-anywhere">
              {startEndTime}
            </span>
          </div>
        </div>
      </motion.div>
    )
  }

  const DayHeader = ({ info }: DayHeaderProps) => {
    const [weekday] = info.text.split(' ')

    return (
      <div className="flex items-center h-full overflow-hidden">
        {info.view.type == 'timeGridDay' ? (
          <div className="flex flex-col rounded-sm">
            <p>
              {info.date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        ) : info.view.type == 'timeGridWeek' ? (
          <div className="flex flex-col space-y-0.5 rounded-sm items-center w-full text-xs sm:text-sm md:text-md">
            <p className="flex font-semibold">{weekday}</p>
            {info.isToday ? (
              <div className="flex bg-black dark:bg-white h-6 w-6 rounded-full items-center justify-center text-xs sm:text-sm md:text-md">
                <p className="font-light dark:text-black text-white">
                  {info.date.getDate()}
                </p>
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full items-center justify-center">
                <p className="font-light">{info.date.getDate()}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col rounded-sm">
            <p>{weekday}</p>
          </div>
        )}
      </div>
    )
  }

  const DayRender = ({ info }: DayRenderProps) => {
    return (
      <div className="flex">
        {info.view.type == 'dayGridMonth' && info.isToday ? (
          <div className="flex h-7 w-7 rounded-full bg-black dark:bg-white items-center justify-center text-sm text-white dark:text-black">
            {info.dayNumberText}
          </div>
        ) : (
          <div className="flex h-7 w-7 rounded-full items-center justify-center text-sm">
            {info.dayNumberText}
          </div>
        )}
      </div>
    )
  }

  return (
    <Loading loading={isLoading}>
      <div className={classNames('calendar', wrapperClass)}>
        {/* Navigation Buttons */}
        {showHeader && (
          <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold">{calendarTitle}</h2>

            <div className="flex flex-col md:flex-row justify-center gap-2">
              <div className="flex gap-2">
                <div className="flex">
                  <Button
                    size="xs"
                    className="rounded-r-none border-r-0 z-[1]"
                    onClick={() => handleNavigation('prev')}
                  >
                    <MdKeyboardArrowLeft className="text-lg" />
                  </Button>
                  <Button
                    size="xs"
                    className={classNames(
                      'rounded-none z-0',
                      isCurrentRange() &&
                        'border-primary text-primary hover:border-primary-dark dark:border-primary-dark'
                    )}
                    onClick={() => handleNavigation('today')}
                  >
                    {currentView === 'timeGridDay'
                      ? 'Today'
                      : currentView === 'timeGridWeek'
                        ? 'This Week'
                        : 'This Month'}
                  </Button>
                  <Button
                    size="xs"
                    className="rounded-l-none border-l-0 z-[1]"
                    onClick={() => handleNavigation('next')}
                  >
                    <MdKeyboardArrowRight className="text-lg" />
                  </Button>
                </div>
                <div className="flex">
                  <Button
                    size="xs"
                    className={classNames(
                      'rounded-r-none hover:border-r-0 z-[1]',
                      currentView === 'dayGridMonth' &&
                        'border-primary hover:border-primary-dark dark:border-primary-dark'
                    )}
                    onClick={() => handleViewChange('dayGridMonth')}
                  >
                    Month
                  </Button>
                  <Button
                    size="xs"
                    className={classNames(
                      'rounded-none z-0',
                      currentView === 'timeGridWeek' &&
                        'border-primary hover:border-primary-dark dark:border-primary-dark'
                    )}
                    onClick={() => handleViewChange('timeGridWeek')}
                  >
                    Week
                  </Button>
                  <Button
                    size="xs"
                    className={classNames(
                      'rounded-l-none hover:border-l-0 z-[1]',
                      currentView === 'timeGridDay' &&
                        'border-primary hover:border-primary-dark dark:border-primary-dark'
                    )}
                    onClick={() => handleViewChange('timeGridDay')}
                  >
                    Day
                  </Button>
                </div>
              </div>
              {handleCreateEvent ? (
                <Button size="xs" onClick={handleCreateEvent}>
                  Create Event
                </Button>
              ) : null}
            </div>
          </div>
        )}

        <motion.div
          key={`${currentView}-${currentDate}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.1 }}
        >
          <FullCalendar
            ref={calendarRef}
            nowIndicator
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={currentView}
            headerToolbar={false}
            height={currentView === 'dayGridMonth' ? 'auto' : '800px'}
            displayEventEnd={true}
            windowResizeDelay={0}
            allDaySlot={false}
            // disable drag
            // editable={false}
            // droppable={false}
            // eventStartEditable={false}
            // eventDurationEditable={false}
            // end drag
            dayCellContent={(dayInfo) => <DayRender info={dayInfo} />}
            eventContent={(eventInfo) => <EventItem info={eventInfo} />}
            dayHeaderContent={(headerInfo) => <DayHeader info={headerInfo} />}
            views={{
              dayGridMonth: {
                dayMaxEvents: 2,
                moreLinkClick: (info: MoreLinkArg) => {
                  setModalEvents(info.allSegs)
                  setIsModalOpen(true)
                  return 'background'
                },
                moreLinkContent: (args) => {
                  return `+${args.num} more`
                },
              },
              timeGridWeek: {
                dayMaxEvents: true,
              },
              timeGridDay: {
                dayMaxEvents: true,
              },
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }}
            scrollTime={currentTime}
            initialDate={currentDate}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            viewDidMount={(view) => {
              setCalendarTitle(formatCalendarTitle(currentDate, view.view.type))
            }}
            eventClick={(info) => {
              rest.eventClick?.(info)
              handleEventClick(info.event)
            }}
            {...rest}
          />
        </motion.div>
        <Dialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRequestClose={() => setIsModalOpen(false)}
        >
          <h4 className="mb-4">Events</h4>
          <div className="grid gap-2">
            {modalEvents.map((args, index) => {
              const { start, end, title, backgroundColor, textColor } =
                args.event
              const { isEnd, isStart } = args
              const startTime = start ? dayjs(start).format('HH:mm') : null
              const endTime = end ? dayjs(end).format('HH:mm') : null
              const startEndTime = [startTime, endTime]
                .filter(Boolean)
                .join('-')
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: 'easeOut',
                  }}
                  style={{
                    backgroundColor,
                    color: textColor,
                  }}
                  className={classNames(
                    'custom-calendar-event cursor-pointer p-2 rounded-md',
                    isEnd &&
                      !isStart &&
                      '!rounded-tl-none !rounded-bl-none !rtl:rounded-tr-none !rtl:rounded-br-none',
                    !isEnd &&
                      isStart &&
                      '!rounded-tr-none !rounded-br-none !rtl:rounded-tl-none !rtl:rounded-bl-none'
                  )}
                  onClick={() =>
                    handleEventClick(args.event as EventClickArg['event'])
                  }
                >
                  <div className="flex flex-col w-full">
                    <span className="font-bold truncate">{title}</span>
                    <div className="flex">
                      <span className="text-xs whitespace-normal break-words overflow-wrap-anywhere">
                        {startEndTime}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Dialog>
      </div>
    </Loading>
  )
}

export default CalendarView
