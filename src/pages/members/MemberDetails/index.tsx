import BannerImage from '@/assets/images/gym-equipment-banner.jpg'
import Loading from '@/components/shared/Loading'
import { Card, Tabs, Tag } from '@/components/ui'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { statusColor } from '@/constants/utils'
import { useMember } from '@/pages/members/store/useMember'
import { apiGetMember } from '@/services/api/MembeService'
import { useQuery } from '@tanstack/react-query'
import { Edit } from 'iconsax-react'
import isEmpty from 'lodash/isEmpty'
import React from 'react'
import { useParams } from 'react-router-dom'
import ActivitySection from './Activity'
import FreezProgram from './FreezProgram'
import MemberPackage from './MemberPackage'
import Profile from './Profile'
import { userDetailData } from './usersData'

const DetailMember = () => {
  const { id } = useParams()
  const { setMember } = useMember()
  const [tabName, setTabName] = React.useState('profile')
  const dataDummy = userDetailData[0]

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY.members, id],
    queryFn: async () => {
      const res = await apiGetMember(id as string)
      setMember(res.data)

      return res
    },
    select: (res) => res.data,
    enabled: !!id,
  })

  return (
    <Loading loading={isLoading}>
      {!isEmpty(data) && !error && (
        <div className="flex flex-col gap-4">
          <Card className="w-full flex flex-col gap-4" bodyClass="p-3">
            <div className="relative">
              <div className="w-full h-32 md:h-56 relative">
                <img
                  className="w-full h-32 md:h-56 object-cover rounded-xl"
                  src={BannerImage}
                  alt="header"
                />
                <div className="absolute right-3 top-3 cursor-pointer">
                  <Edit color="currentColor" size="20" variant="Outline" />
                </div>
                <div className="absolute right-3 bottom-3">
                  <Tag className={statusColor[data.membeship_status]}>
                    <span className="capitalize">{data.membeship_status}</span>
                  </Tag>
                </div>
              </div>
              <div className="relative inset-0 flex flex-col items-center md:flex-row md:justify-between md:items-end md:pl-4 -mt-10">
                <div className="w-full flex justify-center flex-col md:flex-row md:justify-start items-center gap-2">
                  <img
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white"
                    src={data?.photo || 'https://placehold.co/100x100/png'}
                    alt="profile"
                  />
                  <div className="flex flex-col items-center md:items-start md:pt-8">
                    <span className="text-lg font-bold leading-5 text-black dark:text-white">
                      {data.name}
                    </span>
                    <span className="text-gray">ID: {data.code}</span>
                  </div>
                </div>
                <div className="w-full flex justify-between px-0 sm:px-4 md:px-0 md:justify-end items-center gap-4 pt-4 mt-0 md:mt-11">
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-xl font-bold">
                      {data.total_active_membership}
                    </span>
                    <span className="text-gray font-semibold">Membership</span>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-xl font-bold">
                      {data.total_active_class}
                    </span>
                    <span className="text-gray font-semibold">Class</span>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-xl font-bold">
                      {data.total_active_ptprogram}
                    </span>
                    <span className="text-gray font-semibold">PT Program</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className="w-full flex flex-col gap-4">
            <Tabs defaultValue="profile" onChange={setTabName}>
              <TabList>
                <TabNav value="profile">Profile</TabNav>
                <TabNav value="memberPackage">Member Package</TabNav>
                <TabNav value="freeze">Freez Program</TabNav>
                <TabNav value="measurement">Measurement</TabNav>
                <TabNav value="loyalityPoint">Loyality Point</TabNav>
                <TabNav value="activity">Activity</TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="profile">
                  <Profile data={data} />
                </TabContent>
                <TabContent value="memberPackage">
                  {tabName === 'memberPackage' && <MemberPackage data={data} />}
                </TabContent>
                <TabContent value="freeze">
                  {tabName === 'freeze' && <FreezProgram data={data} />}
                </TabContent>
                <TabContent value="activity">
                  <ActivitySection customerName={dataDummy.name} />
                </TabContent>
              </div>
            </Tabs>
          </Card>
        </div>
      )}
    </Loading>
  )
}

export default DetailMember
