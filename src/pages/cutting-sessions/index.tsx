import { TableQueries } from '@/@types/common'
import { useChangeStatusForm } from '@/components/form/cutting-session/changeStatusValidation'
import FormChangeStatus from '@/components/form/cutting-session/FormChangeStatus'
import FormCuttingSession from '@/components/form/cutting-session/FormCuttingSession'
import { useCuttingSessionForm } from '@/components/form/cutting-session/validation'
import { DebounceInput } from '@/components/shared'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import DataTable, { DataTableColumnDef } from '@/components/shared/DataTable'
import { Avatar, Button, Tag, Tooltip } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import {
  cuttingSessionStatusColor,
  cuttingSessionStatusText,
  statusColor,
} from '@/constants/utils'
import { CuttingSessionLists } from '@/services/api/@types/cutting-session'
import { apiGetCuttingSessionLists } from '@/services/api/CuttingSessionService'
import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { MdOutlineEditRoad } from 'react-icons/md'
import { TbEdit, TbPlus, TbSearch } from 'react-icons/tb'

export const MemberColumn = ({ row }: { row: CuttingSessionLists }) => {
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

export const TrainerColumn = ({ row }: { row: CuttingSessionLists }) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar size={32} shape="circle" src={row.trainer?.photo || ''} />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
          {row.trainer?.name}
        </span>
        <span className="text-sm text-gray-500">{row.trainer?.code}</span>
      </div>
    </div>
  )
}

const CuttingSessions = () => {
  const [tableData, setTableData] = useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })
  const [showForm, setShowForm] = useState<boolean>(false)
  const [formType, setFormType] = useState<'create' | 'update'>('create')
  const [selectedStatusCode, setSelectedStatusCode] = useState<number | null>(
    null
  )
  const [showChangeStatus, setShowChangeStatus] = useState<boolean>(false)

  const formProps = useCuttingSessionForm()
  const formChangeStatusProps = useChangeStatusForm()

  const { data, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [QUERY_KEY.cuttingSessions, tableData],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetCuttingSessionLists({
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

  const cuttingSessionList = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )
  const total = data?.pages[0]?.data.meta.total

  const handleEdit = (item: CuttingSessionLists) => {
    setShowForm(true)
    setFormType('update')
    setSelectedStatusCode(item.status_code)
    formProps.setValue('id', item.id)
    formProps.setValue('club_id', item.club_id)
    formProps.setValue('member_id', item.member_id)
    formProps.setValue('member', item.member)
    formProps.setValue('member_package_id', item.member_package_id)
    formProps.setValue('member_package', { id: item.member_package_id })
    formProps.setValue('trainer_id', item.trainer_id)
    formProps.setValue('trainer', item.trainer)
    formProps.setValue('type', item.type)
    formProps.setValue('session_cut', item.session_cut || 0)
    formProps.setValue('description', item.description)
    formProps.setValue('due_date', item.due_date)
    formProps.setValue('start_date', item.start_date)
    formProps.setValue('end_date', item.end_date)
    formProps.setValue('exercises', item.exercises || [])
  }

  const columns = useMemo<DataTableColumnDef<CuttingSessionLists>[]>(
    () => [
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          const row = props.row.original
          const statusCode = row.status_code ?? 0
          return (
            <Tag
              className={
                cuttingSessionStatusColor[statusCode] ||
                cuttingSessionStatusColor[0]
              }
            >
              <span className="capitalize">
                {cuttingSessionStatusText[statusCode] || 'Pending'}
              </span>
            </Tag>
          )
        },
      },
      {
        header: 'Member',
        accessorKey: 'member',
        cell: (props) => {
          const row = props.row.original
          return <MemberColumn row={row} />
        },
      },
      {
        header: 'Trainer',
        accessorKey: 'trainer',
        cell: (props) => {
          const row = props.row.original
          return <TrainerColumn row={row} />
        },
      },
      {
        header: 'Package',
        accessorKey: 'package',
        cell: (props) => {
          const row = props.row.original
          return <span>{row.package?.name || '-'}</span>
        },
      },
      {
        header: 'Type',
        accessorKey: 'type',
        cell: (props) => {
          const row = props.row.original
          return (
            <Tag className={statusColor[row.type] || statusColor.active}>
              <span className="capitalize">
                {row.type?.split('_').join(' ')}
              </span>
            </Tag>
          )
        },
      },
      {
        header: 'Session Cut',
        accessorKey: 'session_cut',
        cell: (props) => {
          const row = props.row.original
          return (
            <span>
              {row.session_cut || '-'} {row.session_cut ? 'Session' : ''}
            </span>
          )
        },
      },
      {
        header: 'Start Date',
        accessorKey: 'start_date',
        size: 150,
        cell: (props) => {
          const row = props.row.original
          return dayjs(row.start_date).format('DD MMM YYYY HH:mm')
        },
      },
      {
        header: 'End Date',
        accessorKey: 'end_date',
        size: 150,
        cell: (props) => {
          const row = props.row.original
          return dayjs(row.end_date).format('DD MMM YYYY HH:mm')
        },
      },
      {
        header: 'Due Date',
        accessorKey: 'due_date',
        size: 150,
        cell: (props) => {
          const row = props.row.original
          return dayjs(row.due_date).format('DD MMM YYYY')
        },
      },
      {
        header: '',
        id: 'action',
        enableColumnActions: false,
        cell: (props) => {
          const row = props.row.original
          return (
            <div className="flex items-center gap-3">
              <Tooltip title="Edit">
                <div
                  className={`text-xl cursor-pointer select-none font-semibold`}
                  role="button"
                  onClick={() => handleEdit(row)}
                >
                  <TbEdit />
                </div>
              </Tooltip>
              {row.status_code !== null && row.status_code !== 1 && (
                <Tooltip title="Change Status">
                  <Button
                    size="sm"
                    variant="plain"
                    onClick={() => {
                      formChangeStatusProps.setValue('id', row.id)
                      setShowChangeStatus(true)
                    }}
                  >
                    <MdOutlineEditRoad className="text-xl" />
                  </Button>
                </Tooltip>
              )}
            </div>
          )
        },
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
              <h3>Cutting Sessions</h3>
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
                  formProps.reset({})
                  setSelectedStatusCode(null)
                  setShowForm(true)
                  setFormType('create')
                }}
              >
                Add new
              </Button>
            </div>
            <DataTable
              columns={columns}
              data={cuttingSessionList}
              noData={!isLoading && cuttingSessionList.length === 0}
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

      <FormCuttingSession
        open={showForm}
        type={formType}
        formProps={formProps}
        statusCode={selectedStatusCode}
        onClose={() => {
          setShowForm(false)
          setSelectedStatusCode(null)
        }}
      />

      <FormChangeStatus
        open={showChangeStatus}
        onClose={() => {
          setShowChangeStatus(false)
        }}
      />
    </>
  )
}

export default CuttingSessions
