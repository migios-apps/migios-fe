import CalendarView from '@/components/shared/CalendarView'
import Container from '@/components/shared/Container'
import type {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
} from '@fullcalendar/core'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import { useCallback, useState } from 'react'
import EventDialog, { EventParam } from './components/EventDialog'
import type { SelectedCell } from './types'
// import { calendarData } from '@/mock/data/calendarData'
import { EventsData } from '@/services/api/@types/event'
import { apiGetEventList } from '@/services/api/EventService'
import { useSessionUser } from '@/store/authStore'
// import { DateRange } from '@fullcalendar/core/internal'
import { Card } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { getStartAndEndOfMonth } from '@/utils/getStartAndEndDate'
import { useQuery } from '@tanstack/react-query'

const Calendar = () => {
  const club = useSessionUser((state) => state.club)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [view, setView] = useState<
    'timeGridWeek' | 'timeGridDay' | 'dayGridMonth'
  >('dayGridMonth')

  const [selectedCell, setSelectedCell] = useState<SelectedCell>({ type: '' })
  const { startDate, endDate } = getStartAndEndOfMonth()
  const [dateRange, setDateRange] = useState({
    start: dayjs(startDate).format('YYYY-MM-DD'),
    end: dayjs(endDate).format('YYYY-MM-DD'),
  })

  const { data: events, isLoading: loadingEvents } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [QUERY_KEY.events, dateRange],
    enabled: !!dateRange.start && !!dateRange.end,
    queryFn: async () => {
      const res = await apiGetEventList(Number(club.id), {
        start_date: dayjs(dateRange.start).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.end).format('YYYY-MM-DD'),
        show_all: true,
      })
      return res
    },
    select: (res) => {
      const data = res.data.data as EventsData[]
      return data.map((item) => ({
        id: item.id,
        title: item.title,
        start: item.start,
        end: item.end,
        backgroundColor: item.background_color,
        textColor: item.color,
        dayOfWeek: item.day_of_week,
        originalData: item,
      }))
    },
  })

  const handleCellSelect = (event: DateSelectArg) => {
    const { start, end } = event
    setSelectedCell({
      type: 'NEW',
      start: dayjs(start).format(),
      end: dayjs(end).format(),
    })
    setDialogOpen(true)
  }

  const handleEventClick = (arg: EventClickArg) => {
    const { start, end, id, title, extendedProps } = arg.event

    setSelectedCell({
      type: 'EDIT',
      id,
      title,
      start: start ? dayjs(start).toISOString() : undefined,
      end: end ? dayjs(end).toISOString() : undefined,
      textColor: extendedProps.color,
      backgroundColor: extendedProps.backgroundColor,
      dayOfWeek: extendedProps.day_of_week,
      originalData: extendedProps.originalData,
    })
    setDialogOpen(true)
  }

  const handleSubmit = (data: EventParam, type: string) => {
    let newEvents = cloneDeep(events) as any
    if (type === 'NEW') {
      newEvents?.push(data)
    }

    if (type === 'EDIT') {
      newEvents = newEvents?.map((event: EventParam) => {
        if (data.id === event.id) {
          event = data
        }
        return event
      })
    }
    // mutate(newEvents, false)
    console.log('newEvents', newEvents)
  }

  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    const { currentStart, currentEnd, type } = arg.view
    const startDate = dayjs(currentStart).format('YYYY-MM-DD')
    const endDate = dayjs(currentEnd).format('YYYY-MM-DD')
    setView(type as any)
    setDateRange({ start: startDate, end: endDate })
  }, [])

  return (
    <Card>
      <Container className="h-full">
        <CalendarView
          editable={false}
          droppable={false}
          eventStartEditable={false}
          eventDurationEditable={false}
          isLoading={loadingEvents}
          initialView={view}
          events={events}
          eventClick={handleEventClick}
          select={handleCellSelect}
          datesSet={handleDatesSet}
          handleCreateEvent={() => {
            setSelectedCell({
              type: 'NEW',
              start: dayjs().format(),
              end: dayjs().format(),
            })
            setDialogOpen(true)
          }}
        />
        <EventDialog
          open={dialogOpen}
          selected={selectedCell}
          submit={handleSubmit}
          onDialogOpen={setDialogOpen}
        />
      </Container>
    </Card>
  )
}

export default Calendar
