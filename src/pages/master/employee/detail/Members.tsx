import { TableQueries } from '@/@types/common'
import { DataTable, DebounceInput } from '@/components/shared'
import { DataTableColumnDef } from '@/components/shared/DataTable'
import { Avatar, Tag } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { statusColor } from '@/constants/utils'
import { EmployeeDetailPage } from '@/services/api/@types/employee'
import { TrainerMembers } from '@/services/api/@types/package'
import { apiGetMembersEmployee } from '@/services/api/EmployeeService'
import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React from 'react'
import { TbSearch } from 'react-icons/tb'

type MembersProps = {
  data: EmployeeDetailPage
}

const NameColumn = ({ row }: { row: TrainerMembers['member'] }) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar
        size={40}
        shape="circle"
        src={
          (row?.photo as unknown as string) ||
          'https://placehold.co/100x100/png'
        }
      />
      <div className="flex flex-col">
        <span className={`font-semibold text-gray-900 dark:text-gray-100`}>
          {row?.name}
        </span>
        <span className="text-sm text-gray-500 font-semibold">{row?.code}</span>
      </div>
    </div>
  )
}

const Members: React.FC<MembersProps> = ({ data: trainer }) => {
  const [tableData, setTableData] = React.useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })

  const { data, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
    queryKey: [QUERY_KEY.trainerMembers, tableData, trainer.code],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetMembersEmployee(`${trainer.code}`, {
        page: tableData.pageIndex,
        per_page: tableData.pageSize,
        ...(tableData.sort?.key !== ''
          ? {
              sort_column: tableData.sort?.key as string,
              sort_type: tableData.sort?.order as 'asc' | 'desc',
            }
          : {
              sort: [
                {
                  sort_column: 'status',
                  sort_type: 'desc',
                },
                {
                  sort_column: 'id',
                  sort_type: 'desc',
                },
              ],
            }),
        ...(tableData.query === ''
          ? {}
          : {
              search: [
                {
                  search_column: 'member.name',
                  search_condition: 'like',
                  search_text: tableData.query,
                },
              ],
            }),
      })
      return res
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.page !== lastPage.data.meta.total_page
        ? lastPage.data.meta.page + 1
        : undefined,
  })

  const trainerMemberList = React.useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )
  const total = data?.pages[0]?.data.meta.total

  const columns = React.useMemo<DataTableColumnDef<TrainerMembers>[]>(
    () => [
      {
        accessorKey: 'member.name',
        header: 'Name',
        cell: (props) => {
          const row = props.row.original.member
          return <NameColumn row={row} />
        },
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ row }) => {
          return <div className="capitalize">{row.original.fduration}</div>
        },
      },
      {
        accessorKey: 'start_date',
        header: 'Date',
        size: 250,
        cell: ({ row }) => {
          return (
            <div className="capitalize">
              <span>
                {/* use format date 1 jan 2023 */}
                {dayjs(row.original.start_date).format('D MMM YYYY')} -{' '}
                {dayjs(row.original.end_date).format('D MMM YYYY')}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: 'package.type',
        header: 'Type',
        cell: ({ row }) => {
          return <div className="capitalize">{row.original.package?.type}</div>
        },
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const row = props.row.original
          return (
            <div className="flex items-center">
              <Tag className={statusColor[row.status]}>
                <span className="capitalize">{row.status}</span>
              </Tag>
            </div>
          )
        },
      },
    ],

    []
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <DebounceInput
          placeholder="Quick search..."
          suffix={<TbSearch className="text-lg" />}
          handleOnchange={(value) => {
            setTableData({
              ...tableData,
              query: value,
              pageIndex: 1,
            })
          }}
        />
      </div>
      <DataTable
        columns={columns}
        data={trainerMemberList}
        noData={(!isLoading && trainerMemberList.length === 0) || !!error}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ width: 28, height: 28 }}
        loading={isLoading || isFetchingNextPage}
        pagingData={{
          total: total as number,
          pageIndex: tableData.pageIndex as number,
          pageSize: tableData.pageSize as number,
        }}
        onPaginationChange={(val) => {
          setTableData({
            ...tableData,
            pageIndex: val,
          })
        }}
        onSelectChange={(val) => {
          setTableData({
            ...tableData,
            pageSize: val,
            pageIndex: 1,
          })
        }}
        onSort={(val) => {
          setTableData({
            ...tableData,
            sort: val,
          })
        }}
      />
    </div>
  )
}

export default Members
