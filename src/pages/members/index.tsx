import { TableQueries } from '@/@types/common'
// import FormMember from '@/components/form/member/FormMember'
// import {
//   resetMemberForm,
//   useMemberValidation,
// } from '@/components/form/member/memberValidation'
import { DebounceInput } from '@/components/shared'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import DataTable, { DataTableColumnDef } from '@/components/shared/DataTable'
import { Avatar, Button, Tag, Tooltip } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { statusColor } from '@/constants/utils'
import { MemberDetail } from '@/services/api/@types/member'
import { apiGetMemberList } from '@/services/api/MembeService'
import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { TbEdit, TbEye, TbSearch, TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

export const NameColumn = ({ row }: { row: MemberDetail }) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar size={40} shape="circle" src={row.photo || ''} />
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
          {row.name}
        </span>
        <span className="text-sm text-gray-500">{row.email}</span>
        <span className="text-sm text-gray-500 font-bold">{row.code}</span>
      </div>
    </div>
  )
}

const MemberList = () => {
  const navigate = useNavigate()
  const [tableData, setTableData] = useState<TableQueries>({
    pageIndex: 1,
    pageSize: 5,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })
  // Dialog form (old version) - Dikomentar karena sekarang menggunakan dedicated pages
  // const [showForm, setShowForm] = useState<boolean>(false)
  // const [formType, setFormType] = useState<'create' | 'update'>('create')
  // const formProps = useMemberValidation()

  const { data, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [QUERY_KEY.members, tableData],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetMemberList({
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
                  search_column: 'name',
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

  const memberList = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )
  const total = data?.pages[0]?.data.meta.total

  const handleViewDetails = (member: MemberDetail) => {
    // Navigate ke detail page
    navigate(`/members/details/${member.code}`)
    // Old version (dialog form) - Dikomentar
    // setShowForm(true)
    // setFormType('update')
  }

  // Handler untuk navigate ke edit page (dedicated page)
  const handleEditMember = (member: MemberDetail) => {
    navigate(`/members/edit/${member.code}`)
  }

  const columns = useMemo<DataTableColumnDef<MemberDetail>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: (props) => {
          const row = props.row.original
          return <NameColumn row={row} />
        },
      },
      {
        header: 'Age',
        accessorKey: 'age',
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
      },
      {
        header: 'Gender',
        accessorKey: 'gender',
        cell: (props) => {
          const row = props.row.original
          return row.gender === 'm' ? 'Male' : 'Female'
        },
      },
      {
        header: 'Birth Date',
        accessorKey: 'birth_date',
        size: 190,
        cell: (props) => {
          const row = props.row.original
          return dayjs(row.birth_date).format('DD MMM YYYY')
        },
      },
      {
        header: 'Status Membership',
        accessorKey: 'membeship_status',
        size: 190,
        cell: (props) => {
          const row = props.row.original
          return (
            <div className="flex items-center">
              <Tag className={statusColor[row.membeship_status]}>
                <span className="capitalize">{row.membeship_status}</span>
              </Tag>
            </div>
          )
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
                onClick={() => handleEditMember(props.row.original)}
              >
                <TbEdit />
              </div>
            </Tooltip>
            <Tooltip title="View">
              <div
                className={`text-xl cursor-pointer select-none font-semibold`}
                role="button"
                onClick={() => handleViewDetails(props.row.original)}
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
              <h3>Members</h3>
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
                icon={<TbUserPlus className="text-xl" />}
                onClick={() => {
                  // Navigate ke dedicated create page
                  navigate('/members/create')
                  // Old version (dialog form) - Dikomentar
                  // resetMemberForm(formProps)
                  // setShowForm(true)
                  // setFormType('create')
                }}
              >
                Add new
              </Button>
            </div>
            <DataTable
              columns={columns}
              data={memberList}
              noData={!isLoading && memberList.length === 0}
              skeletonAvatarColumns={[0]}
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

      {/* Old version (dialog form) - Dikomentar karena sekarang menggunakan dedicated pages */}
      {/* <FormMember
        open={showForm}
        type={formType}
        formProps={formProps}
        onClose={() => setShowForm(false)}
      /> */}
    </>
  )
}

export default MemberList
