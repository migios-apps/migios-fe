import { TableQueries } from '@/@types/common'
import { DebounceInput } from '@/components/shared'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import DataTable, { DataTableColumnDef } from '@/components/shared/DataTable'
import { Avatar, Button, Tag, Tooltip } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { statusColor } from '@/constants/utils'
import { MemberMeasurement } from '@/services/api/@types/measurement'
import { apiGetMemberMeasurementList } from '@/services/api/MeasurementService'
import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { TbEdit, TbEye, TbPlus, TbSearch } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

export const MemberColumn = ({ row }: { row: MemberMeasurement }) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar size={40} shape="circle" src={row.member?.photo || ''} />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
          {row.member?.name}
        </span>
        <span className="text-sm text-gray-500">{row.member?.code}</span>
      </div>
    </div>
  )
}

const Measurement = () => {
  const navigate = useNavigate()
  const [tableData, setTableData] = useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })

  const { data, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [QUERY_KEY.measurements, tableData],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetMemberMeasurementList({
        page: tableData.pageIndex,
        per_page: tableData.pageSize,
        ...(tableData.sort?.key !== ''
          ? {
              sort_column: tableData.sort?.key as string,
              sort_type: tableData.sort?.order as 'asc' | 'desc',
            }
          : {
              sort_column: 'id',
              sort_type: 'desc',
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

  const measurementList = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )
  const total = data?.pages[0]?.data.meta.total

  const handleEdit = (item: MemberMeasurement) => {
    navigate(`/measurement/edit/${item.id}`)
  }

  const handleView = (item: MemberMeasurement) => {
    navigate(`/measurement/details/${item.id}`)
  }

  const columns = useMemo<DataTableColumnDef<MemberMeasurement>[]>(
    () => [
      {
        header: 'Member',
        accessorKey: 'member',
        cell: (props) => {
          const row = props.row.original
          return <MemberColumn row={row} />
        },
      },
      {
        header: 'Weight',
        accessorKey: 'weight_kg',
        cell: (props) => {
          const row = props.row.original
          return <span>{row.weight_kg ? `${row.weight_kg} Kg` : '-'}</span>
        },
      },
      {
        header: 'Body Fat',
        accessorKey: 'body_fat_percent',
        cell: (props) => {
          const row = props.row.original
          return (
            <span>
              {row.body_fat_percent ? `${row.body_fat_percent}%` : '-'}
            </span>
          )
        },
      },
      {
        header: 'BMI',
        accessorKey: 'bmi',
        cell: (props) => {
          const row = props.row.original
          return <span>{row.bmi ? row.bmi.toFixed(2) : '-'}</span>
        },
      },
      {
        header: 'Result',
        accessorKey: 'result',
        cell: (props) => {
          const row = props.row.original
          return (
            <Tag className={statusColor[row.result] || statusColor.active}>
              <span className="capitalize">
                {row.result?.replace('_', ' ') || '-'}
              </span>
            </Tag>
          )
        },
      },
      {
        header: 'Date of Measurement',
        accessorKey: 'measured_at',
        size: 180,
        cell: (props) => {
          const row = props.row.original
          return dayjs(row.measured_at).format('DD MMM YYYY HH:mm')
        },
      },
      {
        header: '',
        id: 'action',
        size: 100,
        enableColumnActions: false,
        cell: (props) => (
          <div className="flex items-center gap-3">
            <Tooltip title="Edit">
              <div
                className={`text-xl cursor-pointer select-none font-semibold`}
                role="button"
                onClick={() => handleEdit(props.row.original)}
              >
                <TbEdit />
              </div>
            </Tooltip>
            <Tooltip title="View">
              <div
                className={`text-xl cursor-pointer select-none font-semibold`}
                role="button"
                onClick={() => handleView(props.row.original)}
              >
                <TbEye />
              </div>
            </Tooltip>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>Measurements</h3>
            </div>
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
              <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => {
                  navigate('/measurement/create')
                }}
              >
                Add new
              </Button>
            </div>
            <DataTable
              columns={columns}
              data={measurementList}
              noData={!isLoading && measurementList.length === 0}
              skeletonAvatarColumns={[0, 1]}
              skeletonAvatarProps={{ width: 28, height: 28 }}
              loading={isLoading || isFetchingNextPage}
              pagingData={{
                total: total as number,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
              }}
              pinnedColumns={{
                right: ['action'],
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
        </AdaptiveCard>
      </Container>
    </>
  )
}

export default Measurement
