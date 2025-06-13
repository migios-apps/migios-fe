import Loading from '@/components/shared/Loading'
import WelcomeUser from '@/components/template/MagicUI/WelcomeUser'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { apiGetReportHead } from '@/services/api/analytic'
import { useSessionUser } from '@/store/authStore'
import { useQuery } from '@tanstack/react-query'
import { People, Profile2User, UserMinus, Weight } from 'iconsax-react'
import AttendanceToday from './components/AttendanceToday'
import CardOverview from './components/CardOverview'
import NewMember from './components/NewMember'
import Overview from './components/Overview'
import UpcomingSchedule from './components/UpcomingSchedule'

const Dashboard = () => {
  const club = useSessionUser((state) => state.club)
  const {
    data: head,
    // isLoading,
    // error,
  } = useQuery({
    queryKey: [QUERY_KEY.reportHead],
    queryFn: () => apiGetReportHead(),
    select: (res) => res.data,
    enabled: !!club.id,
  })

  return (
    <Loading loading={false}>
      <div className="flex flex-col gap-4 max-w-full overflow-x-hidden">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1 xl:col-span-3">
            <CardOverview
              data={[
                {
                  name: 'Program Membership',
                  value: head?.total_member_in_membership || 0,
                  className: 'bg-sky-100 dark:bg-opacity-75',
                  description: 'Total member yang mengikuti program membership',
                  icon: (
                    <Profile2User
                      size="24"
                      color="currentColor"
                      variant="Bulk"
                    />
                  ),
                },
                {
                  name: 'PT Program',
                  value: head?.total_member_in_pt || 0,
                  className: 'bg-amber-100 dark:bg-opacity-75',
                  description: 'Total member yang mengikuti program PT',
                  icon: (
                    <Weight size="24" color="currentColor" variant="Bulk" />
                  ),
                },
                {
                  name: 'Program Kelas',
                  value: head?.total_member_in_class || 0,
                  className: 'bg-purple-100 dark:bg-opacity-75',
                  description: 'Total member yang mengikuti program kelas',
                  icon: (
                    <People size="24" color="currentColor" variant="Bulk" />
                  ),
                },
              ]}
            />
            <Overview />
            <AttendanceToday />
          </div>
          <div className="flex flex-col gap-4 2xl:min-w-[360px]">
            <NewMember />
            <CardOverview
              className="!grid-cols-1"
              data={[
                {
                  name: 'Aktif Member',
                  value: head?.total_active_membership || 0,
                  className: 'bg-emerald-100 dark:bg-opacity-75',
                  icon: (
                    <Profile2User
                      size="24"
                      color="currentColor"
                      variant="Bold"
                    />
                  ),
                },
                {
                  name: 'Non Aktif Member',
                  value: head?.total_inactive_membership || 0,
                  className: 'bg-rose-100 dark:bg-opacity-75',
                  icon: (
                    <Profile2User
                      size="24"
                      color="currentColor"
                      variant="Broken"
                    />
                  ),
                },
                {
                  name: 'Freeze Member',
                  value: head?.total_freeze_members || 0,
                  className: 'bg-cyan-100 dark:bg-opacity-75',
                  icon: (
                    <UserMinus
                      size="24"
                      color="currentColor"
                      variant="Broken"
                    />
                  ),
                },
              ]}
            />
            <UpcomingSchedule />
          </div>
        </div>
      </div>
      <WelcomeUser />
    </Loading>
  )
}

export default Dashboard
