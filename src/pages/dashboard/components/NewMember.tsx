import { Tag } from '@/components/ui'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { statusColor } from '@/constants/utils'
import { apiGetMemberList } from '@/services/api/MembeService'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const NewMember = () => {
  const navigate = useNavigate()

  const handleViewAll = () => {
    navigate('/members')
  }

  const handleView = useCallback(
    (code: string) => {
      navigate(`/members/details/${code}`)
    },
    [navigate]
  )

  const {
    data: members,
    // isFetchingNextPage,
    // isLoading,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.memberDashboard],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetMemberList({
        page: 1,
        per_page: 3,
        sort_column: 'id',
        sort_type: 'desc',
      })
      return res
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.page !== lastPage.data.meta.total_page
        ? lastPage.data.meta.page + 1
        : undefined,
  })

  const memberList = useMemo(
    () => (members ? members.pages.flatMap((page) => page.data.data) : []),
    [members]
  )

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h4 className="leading-5">Member baru</h4>
          <p>Dengan status membership.</p>
        </div>
        <Button size="sm" onClick={handleViewAll}>
          Lihat semua
        </Button>
      </div>
      <div className="mt-5">
        {memberList.map((item, index) => (
          <div
            key={item.id}
            className={classNames(
              'group cursor-pointer flex items-center justify-between py-2 dark:border-gray-600',
              !isLastChild(memberList, index) && 'mb-2'
            )}
            onClick={() => handleView(item.code)}
          >
            <div className="flex items-center gap-2">
              <Avatar
                className="bg-white border border-gray-300 dark:border-gray-500"
                size={50}
                src={item.photo}
                shape="circle"
              />
              <div>
                <div className="heading-text font-bold capitalize group-hover:text-primary">
                  {item.name}
                </div>
                <div>{item.code}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag className={statusColor[item.membeship_status]}>
                <span className="capitalize">{item.membeship_status}</span>
              </Tag>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default NewMember
