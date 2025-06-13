import { CalendarView } from '@/components/shared'
import Loading from '@/components/shared/Loading'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { EventsData } from '@/services/api/@types/event'
import { apiGetEventList } from '@/services/api/EventService'
import { useSessionUser } from '@/store/authStore'
import { getStartAndEndOfWeek } from '@/utils/getStartAndEndDate'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import LayoutClasses from '../Layout'

const ScheduleIndex = () => {
  const club = useSessionUser((state) => state.club)
  const dateRange = getStartAndEndOfWeek()

  const { data: events, isLoading: loadingEvents } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [QUERY_KEY.events, dateRange],
    enabled: !!dateRange.startDate && !!dateRange.endDate,
    queryFn: async () => {
      const res = await apiGetEventList(Number(club.id), {
        start_date: dayjs(dateRange.startDate).format('YYYY-MM-DD'),
        end_date: dayjs(dateRange.endDate).format('YYYY-MM-DD'),
        show_all: true,
        only_class: true,
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
  return (
    <LayoutClasses>
      <Loading loading={false}>
        <div className="mt-4">
          <CalendarView
            showHeader={false}
            editable={false}
            droppable={false}
            eventStartEditable={false}
            eventDurationEditable={false}
            isLoading={loadingEvents}
            initialView={'timeGridWeek'}
            events={events}
          />
        </div>
      </Loading>
    </LayoutClasses>
  )
}

export default ScheduleIndex
