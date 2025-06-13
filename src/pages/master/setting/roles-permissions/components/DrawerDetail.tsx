import { TableQueries } from '@/@types/common'
import { DebounceInput } from '@/components/shared'
import { Avatar, Button, Card, Drawer, Skeleton } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { Filter } from '@/services/api/@types/api'
import { Role } from '@/services/api/@types/settings/role'
import { apiGetRoleUsersList } from '@/services/api/settings/Role'
import useInfiniteScroll from '@/utils/hooks/useInfiniteScroll'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Trash } from 'iconsax-react'
import React from 'react'
import { TbSearch } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router-dom'

type DrawerDetailProps = {
  role?: Role | null
  isOpen: boolean
  onDrawerClose: () => void
}

const DrawerDetail: React.FC<DrawerDetailProps> = ({
  role,
  isOpen,
  onDrawerClose,
}) => {
  const navigate = useNavigate()
  const [tableData, setTableData] = React.useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [QUERY_KEY.roleUsersList, role?.id, tableData],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const res = await apiGetRoleUsersList(role!.id, {
          page: tableData.pageIndex,
          per_page: tableData.pageSize,
          ...(tableData.sort?.key !== ''
            ? {
                sort_column: tableData.sort?.key as string,
                sort_type: tableData.sort?.order as 'asc' | 'desc',
              }
            : {
                sort_column: 'id',
                sort_type: 'asc',
              }),
          search: [
            ...((tableData.query === ''
              ? []
              : [
                  {
                    search_column: 'display_name',
                    search_condition: 'like',
                    search_text: tableData.query,
                  },
                ]) as Filter[]),
          ],
        })
        return res
      },
      enabled: !!role?.id,
      getNextPageParam: (lastPage) =>
        lastPage.data.meta.page !== lastPage.data.meta.total_page
          ? lastPage.data.meta.page + 1
          : undefined,
    })

  const listData = React.useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )
  const totalData = data?.pages[0]?.data.meta.total

  const { isLoading: isLoadingRoleUsers, containerRef: containerRefRoleUsers } =
    useInfiniteScroll({
      offset: '100px',
      shouldStop: !hasNextPage || !data || listData.length === 0,
      onLoadMore: async () => {
        if (hasNextPage && data && listData.length > 0) {
          await fetchNextPage()
        }
      },
    })

  const Footer = (
    <div className="text-right w-full flex gap-2 items-center justify-end">
      <Button
        icon={<Trash color="currentColor" size={24} />}
        size="sm"
        className="mr-2"
        onClick={() => onDrawerClose()}
      >
        Delete
      </Button>
      <Button
        size="sm"
        variant="solid"
        onClick={() => navigate(`/settings/roles-permissions/edit/${role?.id}`)}
      >
        Edit Role
      </Button>
    </div>
  )
  return (
    <>
      <Drawer
        title="Role Detail"
        isOpen={isOpen}
        footer={Footer}
        onClose={onDrawerClose}
        onRequestClose={onDrawerClose}
      >
        <div className="flex flex-col gap-4">
          <Card bodyClass="flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-semibold">Name</span>
              <h6>{role?.display_name}</h6>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Description</span>
              <h6>{role?.description}</h6>
            </div>
          </Card>

          <div className="flex flex-col gap-2 w-full">
            <h5>Users List</h5>
            <DebounceInput
              placeholder="Search"
              suffix={<TbSearch className="text-lg" />}
              handleOnchange={(value) => {
                setTableData({
                  ...tableData,
                  query: value,
                  pageIndex: 1,
                })
              }}
            />
            <div
              ref={containerRefRoleUsers}
              className="overflow-y-auto mt-3"
              style={{ height: 'calc(75vh - 170px)' }}
            >
              <div className="grid grid-cols-1 gap-4 mb-4">
                {data?.pages.map((page, pageIndex) => (
                  <React.Fragment key={pageIndex}>
                    {page.data.data.map((item, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600 p-2 rounded-lg"
                      >
                        <div className="w-12 h-12">
                          <Avatar src={item.photo || ''} size={40} />
                        </div>
                        <div className="flex flex-col">
                          <h6>
                            <Link
                              to={`/employee/detail/${item.code}`}
                              className="hover:text-primary"
                            >
                              {item.name}
                            </Link>
                          </h6>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.code}
                          </p>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
                {isFetchingNextPage &&
                  Array.from({ length: 12 }, (_, i) => i + 1).map((_, i) => (
                    <Skeleton key={i} height={120} className="rounded-xl" />
                  ))}
              </div>
              {totalData === listData.length && (
                <p className="col-span-full text-center text-gray-300 dark:text-gray-500">
                  No more users to load
                </p>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default DrawerDetail
