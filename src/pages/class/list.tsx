import { TableQueries } from '@/@types/common'
import FormClassPage from '@/components/form/class/FormClassPage'
import {
  LevelClassOptions,
  useClassPageForm,
} from '@/components/form/class/validation'
import { EventFrequency } from '@/components/form/event/events'
import {
  AdaptiveCard,
  Container,
  DebounceInput,
  UsersAvatarGroup,
} from '@/components/shared'
import Loading from '@/components/shared/Loading'
import { Button, Pagination, Select, Tag } from '@/components/ui'
import SelectAsyncPaginate, {
  ReturnAsyncSelect,
} from '@/components/ui/Select/SelectAsync'
import { paginationOptions } from '@/constants'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { statusColor } from '@/constants/utils'
import { Filter } from '@/services/api/@types/api'
import { ClassCategoryDetail } from '@/services/api/@types/class'
import {
  apiGetClassCategory,
  apiGetClassList,
} from '@/services/api/ClassService'
import { useInfiniteQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Call, Chart21, Layer, Profile2User } from 'iconsax-react'
import React from 'react'
import { GiBurningPassion } from 'react-icons/gi'
import { TbArrowRight, TbSearch } from 'react-icons/tb'
import type { GroupBase, OptionsOrGroups } from 'react-select'
import LayoutClasses from './Layout'

const ClassIndex = () => {
  const [tableData, setTableData] = React.useState<TableQueries>({
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  })
  const [showForm, setShowForm] = React.useState<boolean>(false)
  const [formType, setFormType] = React.useState<'create' | 'update'>('create')
  const [category, setCategory] = React.useState<ClassCategoryDetail>()

  const formProps = useClassPageForm()

  const { data, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [QUERY_KEY.classes, tableData, category?.id],
    initialPageParam: 1,
    queryFn: async () => {
      const res = await apiGetClassList({
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
        search: [
          ...((tableData.query === ''
            ? []
            : [
                {
                  search_operator: 'and',
                  search_column: 'name',
                  search_condition: 'like',
                  search_text: tableData.query,
                },
              ]) as Filter[]),
          ...(category?.id
            ? ([
                {
                  search_operator: 'and',
                  search_column: 'category.id',
                  search_condition: 'eq',
                  search_text: category?.id.toString(),
                },
              ] as unknown as Filter[])
            : []),
        ],
      })
      return res
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.meta.page !== lastPage.data.meta.total_page
        ? lastPage.data.meta.page + 1
        : undefined,
  })

  const listData = React.useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )
  const total = data?.pages[0]?.data.meta.total

  const getClassCategoryList = React.useCallback(
    async (
      inputValue: string,
      _: OptionsOrGroups<ClassCategoryDetail, GroupBase<ClassCategoryDetail>>,
      additional?: { page: number }
    ) => {
      const response = await apiGetClassCategory({
        page: additional?.page,
        per_page: 10,
        sort_column: 'id',
        sort_type: 'desc',
        search: [
          (inputValue || '').length > 0
            ? ({
                search_column: 'name',
                search_condition: 'like',
                search_text: `${inputValue}`,
              } as any)
            : null,
        ],
      })
      return new Promise<ReturnAsyncSelect>((resolve) => {
        resolve({
          options: response.data.data,
          hasMore: response.data.data.length >= 1,
          additional: {
            page: additional!.page + 1,
          },
        })
      })
    },
    []
  )

  return (
    <LayoutClasses>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-4">
              <SelectAsyncPaginate
                isClearable
                isLoading={isLoading}
                loadOptions={getClassCategoryList as any}
                additional={{ page: 1 }}
                placeholder="Filter by Category"
                className="md:max-w-max w-full"
                value={category}
                getOptionLabel={(option) => option.name!}
                getOptionValue={(option) => option.id.toString()}
                debounceTimeout={500}
                onChange={(option) => setCategory(option!)}
              />
              <DebounceInput
                placeholder="Search..."
                className="w-full"
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
            <Loading loading={isLoading}>
              <div className="mt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {isLoading || isFetchingNextPage
                    ? // Skeleton cards
                      Array(6)
                        .fill(null)
                        .map((_, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-between rounded-2xl p-5 bg-gray-100 dark:bg-gray-700 min-h-[140px] animate-pulse"
                          >
                            <div className="flex flex-col dark:text-white">
                              <div className="flex items-center justify-between">
                                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                              </div>
                              <div className="h-0.5 bg-gray-200 dark:bg-gray-600 my-2"></div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                                  <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                                </div>
                              </div>
                              <div className="mt-4">
                                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mt-2"></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded-full w-24"></div>
                              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                            </div>
                          </div>
                        ))
                    : listData.map((item, index) => {
                        const status = item.enabled ? 'active' : 'inactive'
                        const event = item.events[0]
                        return (
                          <div
                            key={index}
                            className="flex flex-col justify-between rounded-2xl p-5 bg-white card-border dark:bg-gray-700 min-h-[140px]"
                          >
                            <div className="flex flex-col dark:text-white">
                              <div className="flex items-center justify-between">
                                <h6 className="font-bold">{item.name}</h6>
                                <div className="flex items-center">
                                  <Tag className={statusColor[status]}>
                                    <span className="capitalize">{status}</span>
                                  </Tag>
                                </div>
                              </div>
                              {/* divider */}
                              <div className="h-0.5 bg-gray-200 dark:bg-gray-600 my-2"></div>

                              <div className="flex flex-col">
                                <div className="grid grid-cols-[120px_1fr] items-start space-x-2">
                                  <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                      <Call
                                        color="currentColor"
                                        size="16"
                                        variant="Bulk"
                                      />
                                      Phone
                                    </span>
                                    <span className="text-sm">:</span>
                                  </div>
                                  <div className="font-bold flex justify-start capitalize">
                                    {item.phone}
                                  </div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-start space-x-2">
                                  <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                      <Profile2User
                                        color="currentColor"
                                        size="16"
                                        variant="Bulk"
                                      />
                                      Capacity
                                    </span>
                                    <span className="text-sm">:</span>
                                  </div>
                                  <div className="font-bold flex justify-start capitalize">
                                    {item.capacity}
                                  </div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-start space-x-2">
                                  <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                      <Chart21
                                        color="currentColor"
                                        size="16"
                                        variant="Bulk"
                                      />
                                      Level
                                    </span>
                                    <span className="text-sm">:</span>
                                  </div>
                                  <div className="font-bold flex justify-start capitalize">
                                    {
                                      LevelClassOptions.find(
                                        (cls) => cls.value === item.level
                                      )?.label
                                    }
                                  </div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-start space-x-2">
                                  <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                      <Layer
                                        color="currentColor"
                                        size="16"
                                        variant="Bulk"
                                      />
                                      Category
                                    </span>
                                    <span className="text-sm">:</span>
                                  </div>
                                  <div className="font-bold flex justify-start capitalize">
                                    {item.category?.name}
                                  </div>
                                </div>
                                <div className="grid grid-cols-[120px_1fr] items-start space-x-2">
                                  <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1">
                                      <GiBurningPassion size="16" />
                                      Calorie Burn
                                    </span>
                                    <span className="text-sm">:</span>
                                  </div>
                                  <div className="font-bold flex justify-start capitalize">
                                    {item.burn_calories} Cal
                                  </div>
                                </div>
                              </div>

                              <div className="relative mt-2">
                                <span className="align-top flex items-center gap-1">
                                  Schedule
                                </span>
                                {item.events.length > 0 && (
                                  <>
                                    {event?.frequency ===
                                    EventFrequency.daily ? (
                                      `${dayjs(event.start).format('DD MMM YYYY HH:mm')} - ${dayjs(event.end).format('DD MMM YYYY HH:mm')}`
                                    ) : (
                                      <div className="flex flex-wrap gap-1">
                                        {event.selected_weekdays?.map(
                                          (item, index) => (
                                            <div
                                              key={index}
                                              className="flex flex-col p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
                                            >
                                              <span className="font-semibold capitalize">
                                                {item.day_of_week}
                                              </span>
                                              <span className="text-xs">
                                                {item.start_time} -{' '}
                                                {item.end_time}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>

                              <div className="relative mt-2">
                                <span className="align-top flex items-center gap-1">
                                  Description
                                </span>
                                <p className="align-top">
                                  {item.description ?? '-'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex flex-col">
                                <div className="-ml-2">
                                  {item.allow_all_instructor ? (
                                    <div className="flex items-center">
                                      <Tag className={statusColor['active']}>
                                        <span className="capitalize">
                                          All Instructor
                                        </span>
                                      </Tag>
                                    </div>
                                  ) : (
                                    <UsersAvatarGroup
                                      avatarProps={{
                                        className:
                                          'cursor-pointer -mr-2 border-2 border-white dark:border-500',
                                        size: 28,
                                      }}
                                      imgKey="photo"
                                      avatarGroupProps={{ maxCount: 3 }}
                                      chained={false}
                                      users={item.instructors as any[]}
                                    />
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="plain"
                                size="sm"
                                className="py-0 h-auto"
                                icon={<TbArrowRight />}
                                iconAlignment="end"
                                onClick={() => {
                                  setShowForm(true)
                                  setFormType('update')
                                  formProps.setValue('id', item.id)
                                  formProps.setValue('photo', item.photo)
                                  formProps.setValue('name', item.name)
                                  formProps.setValue('phone', item.phone)
                                  formProps.setValue('capacity', item.capacity)
                                  formProps.setValue('level', item.level)
                                  formProps.setValue(
                                    'burn_calories',
                                    item.burn_calories
                                  )
                                  formProps.setValue('category', item.category)
                                  formProps.setValue(
                                    'description',
                                    item.description
                                  )
                                  formProps.setValue(
                                    'allow_all_instructor',
                                    item.allow_all_instructor
                                  )
                                  formProps.setValue('enabled', item.enabled)
                                  // formProps.setValue('instructors', item.instructors)
                                  formProps.setValue(
                                    'events',
                                    item.events as []
                                  )
                                }}
                              >
                                Edit class
                              </Button>
                            </div>
                          </div>
                        )
                      })}
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
            </Loading>

            <FormClassPage
              open={showForm}
              type={formType}
              formProps={formProps}
              onClose={() => setShowForm(false)}
            />
          </div>
        </AdaptiveCard>
      </Container>
    </LayoutClasses>
  )
}

export default ClassIndex
