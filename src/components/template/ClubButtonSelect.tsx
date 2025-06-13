import { useAuth } from '@/auth'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { Filter } from '@/services/api/@types/api'
import { UserClubListData } from '@/services/api/@types/club'
import { apiSetClubData } from '@/services/api/AuthService'
import { apiGetUserClubList } from '@/services/api/ClubService'
import { useSessionUser } from '@/store/authStore'
import cn from '@/utils/classNames'
import useDateDifference from '@/utils/hooks/useDateDifference'
import useDebounce from '@/utils/hooks/useDebounce'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Add, SearchNormal1 } from 'iconsax-react'
import { useMemo, useState } from 'react'
import { HiChevronUpDown } from 'react-icons/hi2'
import { components } from 'react-select'
import { Avatar, Button, Popover, Select, Tag, Tooltip } from '../ui'
import Logo from './Logo'
import { BorderBeam } from './MagicUI/BorderBeam'

type ClubButtonSelectProps = { sideNavCollapse: boolean }
type NewClubListData = UserClubListData & {
  key: string
  type: 'option'
  label: string
}

const ClubButtonSelect = ({ sideNavCollapse }: ClubButtonSelectProps) => {
  const { authDashboard, setManualDataClub } = useAuth()
  const queryClient = useQueryClient()
  const club = useSessionUser((state) => state.club)
  const selectedClub = {
    ...club,
    key: `${club.id}`,
    label: club.name,
    type: 'option',
  } as NewClubListData

  const expairy = useDateDifference(
    dayjs().format('YYYY-MM-DD'),
    dayjs(club?.subscription_end_date).format('YYYY-MM-DD')
  )
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  //   const avatarProps = {
  //     ...(club?.photo ? { src: club?.photo } : { icon: <SiOpenaigym /> }),
  //   }

  const getAvatar = (photo: any) => {
    const clubPhoto = {
      ...(photo
        ? { src: photo }
        : {
            className: 'bg-transparent',
            icon: (
              <Logo
                type="streamline"
                mode={'dark'}
                imgClass="mx-auto"
                logoWidth={30}
              />
            ),
          }),
    }

    return clubPhoto
  }

  const customFilter = (option: any, rawInput: string) => {
    const inputValue = rawInput.toLowerCase()
    if (!inputValue) {
      return true
    }
    if (option?.data?.fixed) {
      return true
    }
    return (
      option.label?.toLowerCase().includes(inputValue) ||
      option.key?.toLowerCase().includes(inputValue)
    )
  }

  function handleDebounceFn(value: string) {
    setSearch(value)
  }

  const debounceFn = useDebounce(handleDebounceFn, 500)

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [QUERY_KEY.clubs, search, authDashboard],
      initialPageParam: 1,
      enabled: authDashboard,
      queryFn: async ({ pageParam }) => {
        const { data, meta } = await apiGetUserClubList({
          page: pageParam,
          per_page: 5,
          search: [
            ...(search !== ''
              ? ([
                  {
                    search_column: 'name',
                    search_condition: 'like',
                    search_text: search,
                  },
                ] as Filter[])
              : []),
            {
              search_column: 'subscription_status',
              search_condition: '=',
              search_text: 'active',
            },
          ],
        }).then((data) => data.data)

        const customData = data.map((item) => ({
          ...item,
          label: item.name,
          key: `${item.id}`,
          type: 'option',
        })) as NewClubListData[]

        return { data: customData, meta }
      },
      getNextPageParam: (lastPage) =>
        lastPage?.meta
          ? lastPage.meta.page !== lastPage.meta.total_page
            ? lastPage.meta.page + 1
            : undefined
          : undefined,
    })

  const dataMemo = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data) : []),
    [data]
  ) as (UserClubListData & { type: 'option' })[]
  const metaData = data?.pages[0]?.meta

  const customListButton = [
    ...(metaData?.total !== dataMemo.length
      ? [
          {
            key: 'load-more',
            type: 'btn',
            label: 'Muat Lebih banyak',
            name: 'load-more',
            isDisabled: true,
            fixed: true,
          },
        ]
      : []),
    {
      key: 'add',
      type: 'btn',
      label: <Add size="24" color="currentColor" variant="Outline" />,
      name: 'add',
      isDisabled: true,
      fixed: true,
    },
  ]

  const setClubData = (data: UserClubListData) => {
    apiSetClubData(data.id!).then((resp) => {
      setManualDataClub({ authData: resp, data, isRedirect: false })
      setOpen(false)

      window.location.reload()
      //   const query_key = Object.keys(QUERY_KEY).filter(
      //     (key) => !['clubList', 'userProfile', 'clubDetail'].includes(key)
      //   )
      //   query_key.forEach((key) => {
      //     queryClient.invalidateQueries({ queryKey: [key] })
      //   })
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.PopoverTrigger asChild>
        <Button
          variant="plain"
          className={cn(
            'group relative overflow-hidden border border-gray-800 px-2 hover:bg-gray-800 h-13 mb-2',
            sideNavCollapse ? 'w-auto rounded-full' : 'w-full'
          )}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar size={32} {...getAvatar(club?.photo)} />
              {!sideNavCollapse ? (
                <div className="flex flex-col text-start max-w-[150px]">
                  <span className="text-white truncate">
                    <Tooltip title={club.name}>{club.name}</Tooltip>
                  </span>
                  <span className="text-xs font-light text-gray-400 capitalize">
                    [{club.club_type}] Aktif {expairy}
                  </span>

                  {/* <Tag className="capitalize text-[10px] p-0 px-1 w-fit font-light text-center flex items-center justify-center">
                    Aktif {expairy}
                  </Tag> */}
                </div>
              ) : null}
            </div>
            {!sideNavCollapse && (
              <HiChevronUpDown className="size-6 shrink-0" />
            )}
          </div>
          <BorderBeam size={40} initialOffset={20} />
        </Button>
      </Popover.PopoverTrigger>
      <Popover.PopoverContent
        align="start"
        className="w-auto bg-gray-800 shadow-md p-0 rounded-xl border-gray-800 max-w-[300px] px-1"
      >
        <Select
          autoFocus
          menuIsOpen
          isLoading={isLoading || isFetchingNextPage}
          backspaceRemovesValue={false}
          tabIndex={-1}
          controlShouldRenderValue={false}
          hideSelectedOptions={false}
          isClearable={false}
          filterOption={customFilter}
          options={
            [
              selectedClub,
              ...dataMemo.filter((option) => option.id !== club.id),
              ...customListButton,
            ] as NewClubListData[]
          }
          getOptionLabel={(option) => option.label!}
          getOptionValue={(option) => option.key!}
          placeholder="Search..."
          tabSelectsValue={false}
          value={selectedClub}
          styles={{
            control: (provided) => ({
              ...provided,
              minWidth: 200,
              margin: 8,
              borderRadius: 10,
            }),
            menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
          }}
          classNames={{
            control: (state) =>
              cn(
                'select-control !mx-0',
                state.isDisabled && 'opacity-50 cursor-not-allowed',
                (() => {
                  const classes: string[] = ['!border-gray-900 !bg-gray-900']

                  const { isFocused } = state

                  if (isFocused) {
                    classes.push(
                      'select-control-focused !ring-1 !ring-primary !border-primary bg-transparent'
                    )
                  }

                  return classes
                })()
              ),
            input: ({ value, isDisabled }) =>
              cn(
                '!text-gray-100',
                isDisabled ? 'invisible' : 'visible',
                value && '[transform:translateZ(0)]'
              ),
            menu: () =>
              'bg-gray-900 rounded-xl my-2 px-2 py-1 min-h-[50px] border-none ring-none',
          }}
          components={{
            DropdownIndicator: () => (
              <SearchNormal1 color="currentColor" size="24" />
            ),
            IndicatorSeparator: null,
            Option: (props) => {
              const { isSelected, isFocused, isDisabled, data } = props

              if (data.type === 'option') {
                return (
                  <components.Option
                    {...props}
                    className={cn(
                      'select-option !w-full !min-w-[274px]',
                      !isDisabled && '!cursor-pointer',
                      isFocused && '!bg-gray-800',
                      isSelected && '!text-unset !bg-primary-subtle',
                      !isDisabled && !isSelected && '!text-gray-100'
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar size={32} {...getAvatar(data?.photo)} />
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              'flex-1 truncate max-w-[150px]',
                              isSelected && '!text-primary'
                            )}
                          >
                            <Tooltip title={data.name}>{data.name}</Tooltip>
                          </span>
                          <p className="text-[10px] text-gray-400">
                            Berakhir pada{' '}
                            {dayjs(data.subscription_end_date).format(
                              'MMM DD, YYYY'
                            )}
                          </p>
                        </div>
                      </div>
                      <Tag className="capitalize w-14 border-gray-600 bg-gray-700 text-white text-center flex items-center justify-center">
                        {data.subscription_plan_type === 'enterprise'
                          ? 'Entprs'
                          : data.subscription_plan_type}
                      </Tag>
                    </div>
                  </components.Option>
                )
              } else if (data.type === 'btn') {
                return (
                  <components.Option
                    {...props}
                    className={cn(
                      '!p-0 !rounded-md',
                      customListButton[0].name === data.name && '!mt-2'
                    )}
                  >
                    <Button
                      className="w-full h-9 cursor-pointer text-xs text-white bg-gray-800 hover:!bg-gray-700 !border-none ring-0 hover:!ring-0 hover:!border-none mb-2 shadow-md p-2 rounded-md flex justify-center items-center"
                      loading={
                        data.key === 'load-more' &&
                        (isLoading || isFetchingNextPage)
                      }
                      onClick={() => {
                        if (data.key === 'load-more') {
                          fetchNextPage()
                        } else if (data.key === 'add') {
                          setOpen(false)
                        }
                      }}
                    >
                      {data.label}
                    </Button>
                  </components.Option>
                )
              }
            },
          }}
          onInputChange={debounceFn}
          onChange={(newValue) => {
            setClubData(newValue as UserClubListData)
          }}
        />
      </Popover.PopoverContent>
    </Popover>
  )
}

export default ClubButtonSelect
