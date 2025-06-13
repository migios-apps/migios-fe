import { TableQueries } from '@/@types/common'
import { DebounceInput } from '@/components/shared'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import { Avatar, Button, Card, Pagination, Select } from '@/components/ui'
import { paginationOptions } from '@/constants'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { EmployeeDetail } from '@/services/api/@types/employee'
import { apiGetEmployeeList } from '@/services/api/EmployeeService'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Eye, Filter } from 'iconsax-react'
import { useMemo, useState } from 'react'
import { TbSearch, TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

const EmployeeCard = ({ data }: { data: EmployeeDetail }) => {
  const navigate = useNavigate()
  const handleViewDetails = (member: EmployeeDetail) => {
    navigate(`/employee/detail/${member.code}`)
  }
  return (
    <Card className="bg-[#f8fafb] dark:bg-[#1e1e1e]">
      <div className="flex justify-between items-start mb-2">
        <Avatar
          size={70}
          alt={data.name}
          shape="circle"
          src={data.photo || ''}
        />

        <Button
          variant="plain"
          className="p-0"
          onClick={() => handleViewDetails(data)}
        >
          <Eye size="24" variant="TwoTone" color="currentColor" />
        </Button>
      </div>
      <div className="flex flex-col mb-2">
        <span className="font-semibold text-gray-900 line-clamp-1 dark:text-white">
          {data.name}
        </span>
        <span className="text-sm text-gray-500 line-clamp-1 capitalize dark:text-gray-400">
          {data.type ?? '-'}
        </span>
      </div>
      <div className="flex flex-col bg-white p-4 rounded-lg gap-2 dark:bg-gray-800 dark:text-white">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Email</span>
          <span className="font-semibold truncate text-gray-900 dark:text-white">
            {data.email ?? '-'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Phone</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {data.phone ?? '-'}
          </span>
        </div>
      </div>
    </Card>
  )
}

const EmployeeList = () => {
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
    queryKey: [QUERY_KEY.employees, tableData],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetEmployeeList({
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

  const employeeList = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )
  const total = data?.pages[0]?.data.meta.total

  return (
    <>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>
                <span className="text-primary mr-2">{total}</span>
                Employees
              </h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="default"
                  icon={
                    <Filter size="20" color="currentColor" variant="Outline" />
                  }
                >
                  Filter
                </Button>

                <Button
                  variant="solid"
                  icon={<TbUserPlus className="text-xl" />}
                  onClick={() => {
                    navigate('/employee/create')
                  }}
                >
                  Tambah
                </Button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <DebounceInput
                placeholder="Search name..."
                suffix={<TbSearch className="text-lg" />}
                handleOnchange={(value) => {
                  setTableData({ ...tableData, query: value, pageIndex: 1 })
                }}
              />
            </div>

            <div
              className="grid gap-4 mb-4"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              }}
            >
              {employeeList.map((employee) => (
                <EmployeeCard key={employee.id} data={employee} />
              ))}
            </div>

            <div className="flex justify-center flex-col md:flex-row md:justify-between items-center gap-2 mt-3">
              <div style={{ minWidth: 150 }}>
                <Select
                  size="sm"
                  className="w-full"
                  menuPlacement="top"
                  isSearchable={false}
                  defaultValue={paginationOptions[0]}
                  value={paginationOptions.find(
                    (option) => option.value === tableData.pageSize
                  )}
                  options={paginationOptions}
                  onChange={(selected) => {
                    setTableData({
                      ...tableData,
                      pageSize: selected?.value,
                      pageIndex: 1,
                    })
                  }}
                />
              </div>
              <Pagination
                displayTotal
                total={total}
                pageSize={tableData.pageSize}
                currentPage={tableData.pageIndex}
                onChange={(value) => {
                  setTableData({
                    ...tableData,
                    pageIndex: value,
                  })
                }}
              />
            </div>
          </div>
        </AdaptiveCard>
      </Container>
    </>
  )
}

export default EmployeeList
