import Loading from '@/components/shared/Loading'
import { Avatar, Button, Card, Tabs, Tooltip } from '@/components/ui'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import {
  EmployeeDetailPage,
  EmployeeHeadType,
} from '@/services/api/@types/employee'
import {
  apiGetEmployeeDetailPage,
  apiGetEmployeeHead,
} from '@/services/api/EmployeeService'
import useCopyToClipboard from '@/utils/hooks/useCopyToClipboard'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  Calendar2,
  CalendarTick,
  Copy,
  HomeHashtag,
  MessageText1,
  Notepad2,
  ScanBarcode,
  SecurityUser,
  TagUser,
  TickSquare,
  Whatsapp,
} from 'iconsax-react'
import isEmpty from 'lodash/isEmpty'
import { useState } from 'react'
import { HiPencil } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import Activity from './Activity'
import InformasiDetail from './InformasiDetail'
import Members from './Members'
import PtPrograms from './PtPrograms'

const EmployeeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { copy } = useCopyToClipboard()

  const {
    data: employee,
    isLoading: isLoadingEmployee,
    error: errorEmployee,
  } = useQuery({
    queryKey: [QUERY_KEY.employeeDetail, id],
    queryFn: () => apiGetEmployeeDetailPage(id as string),
    select: (res: { data: EmployeeDetailPage }) => res.data,
    enabled: !!id,
  })

  const {
    data: employeeHead,
    isLoading: isLoadingEmployeeHead,
    error: errorEmployeeHead,
  } = useQuery({
    queryKey: [QUERY_KEY.employeeHead, id],
    queryFn: () => apiGetEmployeeHead(id as string, '2025-04-01', '2025-04-30'),
    select: (res: { data: EmployeeHeadType }) => res.data,
    enabled: !!id,
  })

  return (
    <Loading loading={isLoadingEmployee}>
      {!isEmpty(employee) && !errorEmployee && (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 w-full">
          <aside className="col-span-1 lg:col-span-2 flex flex-col gap-4">
            <div className="flex justify-center items-center w-full flex-col relative">
              <div className="w-16 h-16 relative rounded-[100px] outline-[5px] outline-[#f1f5f9] z-10">
                <Avatar
                  size={64}
                  alt={employee?.name || ''}
                  shape="circle"
                  src={employee?.photo || 'https://placehold.co/64x64'}
                />
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 pt-14 -mt-11 flex justify-center items-center w-full relative">
                <div className="absolute top-3 right-3 ">
                  <Tooltip title="Edit employee">
                    <button
                      className="close-button bg-gray-200/20 text-gray-200 button-press-feedback"
                      type="button"
                      onClick={() => navigate(`/employee/edit/${id}`)}
                    >
                      <HiPencil />
                    </button>
                  </Tooltip>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-white font-semibold text-lg text-center">
                      {employee?.name}
                    </span>
                  </div>
                  <span className="text-white text-sm text-center capitalize">
                    {employee?.type}
                  </span>
                </div>
              </div>
            </div>

            {employee?.type === 'trainer' && (
              <div className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-col">
                    <div className="text-lg font-semibold text-gray-950 dark:text-white text-center">
                      {employee?.total_members || 0}
                    </div>
                    <div className="text-xs font-normal text-center">
                      Membership
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full pl-4 border-l-2 border-solid border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col">
                    <div className="text-lg font-semibold text-gray-950 dark:text-white text-center">
                      {employee?.total_pt_program || 0}
                    </div>
                    <div className="text-xs font-normal text-center">
                      PT Program
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full pl-4 border-l-2 border-solid border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col">
                    <div className="text-lg font-semibold text-gray-950 dark:text-white text-center">
                      {employee?.total_class || 0}
                    </div>
                    <div className="text-xs font-normal text-center">Class</div>
                  </div>
                </div>
              </div>
            )}

            <Card>
              <div className="flex items-center gap-2 w-full pb-2">
                <ScanBarcode size="32" color="currentColor" variant="Outline" />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span>Kode pegawai</span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {employee?.code}
                    </span>
                  </div>

                  <Button
                    variant="plain"
                    className="!px-1"
                    onClick={() => {
                      copy(employee?.code || '')
                      setCopiedField('code')
                      setTimeout(() => setCopiedField(null), 2000)
                    }}
                  >
                    {copiedField === 'code' ? (
                      <TickSquare size="20" color="#22C55E" variant="Outline" />
                    ) : (
                      <Copy
                        size="20"
                        color={copiedField === 'code' ? '#22C55E' : '#CBD5E1'}
                        variant="Outline"
                      />
                    )}
                  </Button>
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2 w-full py-2">
                <Whatsapp size="32" color="currentColor" variant="Outline" />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span>No. Hp</span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {employee?.phone || '-'}
                    </span>
                  </div>

                  <Button
                    variant="plain"
                    className="!px-1"
                    onClick={() => {
                      copy(employee?.phone || '')
                      setCopiedField('phone')
                      setTimeout(() => setCopiedField(null), 2000)
                    }}
                  >
                    {copiedField === 'phone' ? (
                      <TickSquare size="20" color="#22C55E" variant="Outline" />
                    ) : (
                      <Copy
                        size="20"
                        color={copiedField === 'phone' ? '#22C55E' : '#CBD5E1'}
                        variant="Outline"
                      />
                    )}
                  </Button>
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2 w-full pt-2">
                <MessageText1
                  size="32"
                  color="currentColor"
                  variant="Outline"
                />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span>Email</span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {employee?.email || '-'}
                    </span>
                  </div>

                  <Button
                    variant="plain"
                    className="!px-1"
                    onClick={() => {
                      copy(employee?.email || '')
                      setCopiedField('email')
                      setTimeout(() => setCopiedField(null), 2000)
                    }}
                  >
                    {copiedField === 'email' ? (
                      <TickSquare size="20" color="#22C55E" variant="Outline" />
                    ) : (
                      <Copy
                        size="20"
                        color={copiedField === 'email' ? '#22C55E' : '#CBD5E1'}
                        variant="Outline"
                      />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-2 w-full pb-2">
                <TagUser size="32" color="currentColor" variant="Outline" />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span>Jenis kelamin</span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {employee?.gender
                        ? employee.gender === 'm'
                          ? 'Laki-laki'
                          : 'Perempuan'
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2 w-full py-2">
                <Calendar2 size="32" color="currentColor" variant="Outline" />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span>Tanggal lahir</span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {employee?.birth_date
                        ? dayjs(employee?.birth_date).format('DD MMM YYYY')
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2 w-full py-2">
                <CalendarTick
                  size="32"
                  color="currentColor"
                  variant="Outline"
                />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span>Tanggal bergabung</span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {employee?.join_date
                        ? dayjs(employee?.join_date).format('DD MMM YYYY')
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2 w-full py-2">
                <HomeHashtag size="32" color="currentColor" variant="Outline" />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span>Alamat</span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {employee?.address || '-'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2 w-full py-2">
                <Notepad2 size="32" color="currentColor" variant="Outline" />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span>Spesialis</span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {employee?.specialist || '-'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-[1px] bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex items-center gap-2 w-full py-2">
                <SecurityUser
                  size="32"
                  color="currentColor"
                  variant="Outline"
                />
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span>Role</span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {employee.roles
                        ?.map((role) => role.display_name)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </aside>
          <main className="col-span-1 lg:col-span-5 flex flex-col gap-4">
            <div className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-200 dark:border-gray-700 rounded-lg grid grid-cols-4 gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <div className="text-lg font-semibold text-gray-950 dark:text-white">
                    {employeeHead?.total_sales || 0}
                  </div>
                  <div className="text-xs font-normal">
                    Total penjualan bulan ini
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 pl-4 border-l-2 border-solid border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <div className="text-lg font-semibold text-gray-950 dark:text-white">
                    {employeeHead?.total_session || 0}
                  </div>
                  <div className="text-xs font-normal">
                    Total sesi bulan ini
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 pl-4 border-l-2 border-solid border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <div className="text-lg font-semibold text-gray-950 dark:text-white">
                    {employeeHead?.total_class || 0}
                  </div>
                  <div className="text-xs font-normal">
                    Total class bulan ini
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 pl-4 border-l-2 border-solid border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <div className="text-lg font-semibold text-gray-950 dark:text-white">
                    {employeeHead?.ftotal_commission_amount || 0}
                  </div>
                  <div className="text-xs font-normal">
                    Komisi didapatkan bulan ini
                  </div>
                </div>
              </div>
            </div>

            <Card bodyClass="p-0">
              <Tabs defaultValue="tab1">
                <Tabs.TabList>
                  <Tabs.TabNav value="tab1" className="min-w-fit w-full">
                    Informasi detail
                  </Tabs.TabNav>
                  {employee && employee.type === 'trainer' && (
                    <>
                      <Tabs.TabNav value="tab2" className="min-w-fit w-full">
                        Daftar Member
                      </Tabs.TabNav>
                      <Tabs.TabNav value="tab3" className="min-w-fit w-full">
                        Daftar Program
                      </Tabs.TabNav>
                    </>
                  )}
                  <Tabs.TabNav value="tab4" className="min-w-fit w-full">
                    Aktivitas
                  </Tabs.TabNav>
                </Tabs.TabList>
                <div className="p-4">
                  <Tabs.TabContent value="tab1">
                    <InformasiDetail employee={employee} />
                  </Tabs.TabContent>
                  {employee && employee.type === 'trainer' && (
                    <>
                      <Tabs.TabContent value="tab2">
                        <Members data={employee} />
                      </Tabs.TabContent>
                      <Tabs.TabContent value="tab3">
                        <PtPrograms data={employee} />
                      </Tabs.TabContent>
                    </>
                  )}
                  <Tabs.TabContent value="tab4">
                    <Activity />
                  </Tabs.TabContent>
                </div>
              </Tabs>
            </Card>
          </main>
        </div>
      )}
    </Loading>
  )
}

export default EmployeeDetail
