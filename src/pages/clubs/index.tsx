import { useAuth } from '@/auth'
import Split from '@/components/layouts/AuthLayout/Split'
import DebounceInput from '@/components/shared/DebounceInput'
import AlertDialogExpiredSubscription from '@/components/template/AlertDialogExpiredSubscription'
import Logo from '@/components/template/Logo'
import { Button, Card, ScrollBar, Tag } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { Filter } from '@/services/api/@types/api'
import { apiGetUserClubList } from '@/services/api/ClubService'
import { useThemeStore } from '@/store/themeStore'
import classNames from '@/utils/classNames'
import { dayjs } from '@/utils/dayjs'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Add, LogoutCurve } from 'iconsax-react'
import React, { useMemo } from 'react'

const Clubs = () => {
  const { setClubData, signOut } = useAuth()
  const mode = useThemeStore((state) => state.mode)
  const [search, setSearch] = React.useState('')
  const [openRenewSubscription, setOpenRenewSubscription] =
    React.useState(false)
  const [clubId, setClubId] = React.useState<number | undefined>(undefined)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const { data, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [QUERY_KEY.clubs, search],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const data = await apiGetUserClubList({
          page: pageParam,
          per_page: 10,
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
          ],
        })

        // if (data.data.data.length === 0) {
        //   navigatorRef('/club-setup')
        // }

        return data
      },
      getNextPageParam: (lastPage) =>
        lastPage.data.meta.page !== lastPage.data.meta.total_page
          ? lastPage.data.meta.page + 1
          : undefined,
    })

  const dataMemo = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data.data) : []),
    [data]
  )
  const metaData = data?.pages[0]?.data.meta

  return (
    <>
      <Split type="blank">
        <div className="w-full flex flex-col items-start px-4 gap-4">
          <div className="relative w-full flex justify-between items-center gap-4">
            <Logo type="full" mode={mode} imgClass="mx-auto" logoWidth={200} />
            <Button
              icon={
                <LogoutCurve
                  color="currentColor"
                  size="32"
                  variant="Bulk"
                  className="rotate-180"
                />
              }
              iconAlignment="end"
              className="px-2"
              onClick={() => {
                signOut()
              }}
            >
              Sign Out
            </Button>
          </div>
          <div className="relative">
            <h2 className="mb-2">Welcome!</h2>
            <p className="font-semibold heading-text">
              Please select a club to continue
            </p>
          </div>
          <div className="w-full flex items-center gap-2">
            <DebounceInput
              placeholder="Search..."
              wait={1000}
              onChange={handleSearch}
            />
            <Button
              icon={<Add color="#000" className="w-5 h-5" />}
              className="px-3"
              onClick={() => {
                signOut()
              }}
            >
              Add
            </Button>
          </div>
          <ScrollBar className="w-full h-full max-h-[70vh] overflow-y-scroll pr-3 pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-3">
              {data?.pages.map((page) =>
                page.data.data.map((data, index) => (
                  <Card
                    key={index}
                    // clickable={['active'].includes(data.subscription_status!)}
                    bodyClass="p-0 relative"
                    // disabled={!['active'].includes(data.subscription_status!)}
                  >
                    {!['active'].includes(data.subscription_status!) ? (
                      <Button
                        className="absolute bottom-1 right-1 z-10 p-2 py-0 h-8"
                        variant="solid"
                        onClick={() => {
                          setOpenRenewSubscription(true)
                          setClubId(data.id)
                        }}
                      >
                        Renew
                      </Button>
                    ) : null}
                    <div
                      className={classNames('p-6 cursor-pointer', {
                        'cursor-not-allowed opacity-50 rounded-2xl': ![
                          'active',
                        ].includes(data.subscription_status!),
                      })}
                      onClick={async () => {
                        if (['active'].includes(data.subscription_status!)) {
                          await setClubData(data)
                        }
                      }}
                    >
                      <h5 className="mb-2 text-lg font-semibold leading-5 text-gray-900 dark:text-gray-200">
                        {data.name}
                      </h5>
                      <p className="text-gray-900 dark:text-gray-200">
                        {data.address}
                      </p>
                      {data.roles?.map((role, index) => (
                        <Tag
                          key={index}
                          className="bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900 mt-2"
                        >
                          <span className="capitalize">{role.name}</span>
                        </Tag>
                      ))}
                      {!['active'].includes(data.subscription_status!) ? (
                        <Tag className="bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900 mt-2">
                          <span className="capitalize">
                            Subscription {data.subscription_status}
                          </span>
                        </Tag>
                      ) : (
                        <Tag>
                          Expires on{' '}
                          {dayjs(data.subscription_end_date).format(
                            'DD MMM YYYY'
                          )}
                        </Tag>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
            <div className="text-center mt-4">
              {dataMemo.length !== metaData?.total ? (
                <Button
                  loading={isLoading || isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                >
                  Load More
                </Button>
              ) : null}
            </div>
          </ScrollBar>
        </div>
      </Split>
      <AlertDialogExpiredSubscription
        showCloseButton
        open={openRenewSubscription}
        clubId={clubId}
        onOpenChange={() => setOpenRenewSubscription(false)}
      />
    </>
  )
}

export default Clubs
