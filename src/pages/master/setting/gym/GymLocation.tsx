import { Badge, Button, Card, Input } from '@/components/ui'
import {
  Call,
  Clock,
  DirectRight,
  Edit,
  Location,
  Map1,
  SearchNormal1,
  Sms,
  Star1,
} from 'iconsax-react'
import { useState } from 'react'
import LayoutGymSetting from './Layout'

type GymBranch = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  coordinates: {
    lat: number
    lng: number
  }
  operatingHours: {
    weekdays: string
    weekend: string
  }
  facilities: string[]
  rating: number
  totalMembers: number
  isMainBranch: boolean
  image: string
  status: 'active' | 'maintenance' | 'coming_soon'
}

const GYM_BRANCHES: GymBranch[] = [
  {
    id: '1',
    name: 'FitZone Premium - Jakarta Pusat',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat 10220',
    phone: '+62 21 1234 5678',
    email: 'jakpus@fitzone.com',
    coordinates: { lat: -6.2088, lng: 106.8456 },
    operatingHours: {
      weekdays: '05:00 - 23:00',
      weekend: '06:00 - 22:00',
    },
    facilities: [
      'Cardio Zone',
      'Weight Training',
      'Swimming Pool',
      'Sauna',
      'Personal Training',
      'Group Classes',
    ],
    rating: 4.8,
    totalMembers: 1200,
    isMainBranch: true,
    image: '/img/gym-branch-1.jpg',
    status: 'active',
  },
  {
    id: '2',
    name: 'FitZone Premium - Jakarta Selatan',
    address: 'Jl. Senopati No. 45, Jakarta Selatan 12190',
    phone: '+62 21 2345 6789',
    email: 'jaksel@fitzone.com',
    coordinates: { lat: -6.2297, lng: 106.8175 },
    operatingHours: {
      weekdays: '05:00 - 23:00',
      weekend: '06:00 - 22:00',
    },
    facilities: [
      'Cardio Zone',
      'Weight Training',
      'Yoga Studio',
      'Personal Training',
      'Group Classes',
      'Cafe',
    ],
    rating: 4.7,
    totalMembers: 950,
    isMainBranch: false,
    image: '/img/gym-branch-2.jpg',
    status: 'active',
  },
  {
    id: '3',
    name: 'FitZone Premium - Tangerang',
    address: 'Jl. BSD Raya No. 88, Tangerang Selatan 15345',
    phone: '+62 21 3456 7890',
    email: 'tangerang@fitzone.com',
    coordinates: { lat: -6.3018, lng: 106.6519 },
    operatingHours: {
      weekdays: '05:00 - 23:00',
      weekend: '06:00 - 22:00',
    },
    facilities: [
      'Cardio Zone',
      'Weight Training',
      'Swimming Pool',
      'Kids Zone',
      'Personal Training',
    ],
    rating: 4.6,
    totalMembers: 800,
    isMainBranch: false,
    image: '/img/gym-branch-3.jpg',
    status: 'active',
  },
  {
    id: '4',
    name: 'FitZone Premium - Bekasi',
    address: 'Jl. Ahmad Yani No. 67, Bekasi 17141',
    phone: '+62 21 4567 8901',
    email: 'bekasi@fitzone.com',
    coordinates: { lat: -6.2383, lng: 106.9756 },
    operatingHours: {
      weekdays: '05:00 - 23:00',
      weekend: '06:00 - 22:00',
    },
    facilities: ['Cardio Zone', 'Weight Training', 'Group Classes'],
    rating: 4.5,
    totalMembers: 650,
    isMainBranch: false,
    image: '/img/gym-branch-4.jpg',
    status: 'maintenance',
  },
  {
    id: '5',
    name: 'FitZone Premium - Depok',
    address: 'Jl. Margonda Raya No. 234, Depok 16424',
    phone: '+62 21 5678 9012',
    email: 'depok@fitzone.com',
    coordinates: { lat: -6.4025, lng: 106.7942 },
    operatingHours: {
      weekdays: '05:00 - 23:00',
      weekend: '06:00 - 22:00',
    },
    facilities: [
      'Cardio Zone',
      'Weight Training',
      'Swimming Pool',
      'Sauna',
      'Personal Training',
    ],
    rating: 0,
    totalMembers: 0,
    isMainBranch: false,
    image: '/img/gym-branch-5.jpg',
    status: 'coming_soon',
  },
]

const GymLocation = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBranch, setSelectedBranch] = useState<GymBranch | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [branches, setBranches] = useState<GymBranch[]>(GYM_BRANCHES)

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: GymBranch['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge
            content="Beroperasi"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          />
        )
      case 'maintenance':
        return (
          <Badge
            content="Maintenance"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          />
        )
      case 'coming_soon':
        return (
          <Badge
            content="Segera Hadir"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          />
        )
      default:
        return null
    }
  }

  return (
    <LayoutGymSetting>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Lokasi Gym
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Kelola informasi lokasi dan cabang gym
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="solid"
              size="sm"
              icon={<Edit size={16} />}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Selesai Edit' : 'Edit Lokasi'}
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari cabang berdasarkan nama atau alamat..."
                prefix={<SearchNormal1 size={16} className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="plain"
                size="sm"
                icon={<Map1 size={16} />}
                onClick={() => setSelectedBranch(null)}
              >
                Lihat Peta
              </Button>
            </div>
          </div>
        </Card>

        {/* Map View */}
        <Card
          header={{
            content: (
              <div className="flex items-center gap-2">
                <Map1 size={20} className="text-primary" />
                <h3 className="text-lg font-semibold">Peta Lokasi</h3>
              </div>
            ),
            bordered: false,
          }}
          bodyClass="pt-0"
        >
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Map1 size={48} className="mx-auto mb-2" />
              <p className="text-sm">
                Peta interaktif akan ditampilkan di sini
              </p>
              <p className="text-xs mt-1">
                Integrasi dengan Google Maps atau Mapbox
              </p>
            </div>
          </div>
        </Card>

        {/* Branch Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card bodyClass="text-center">
            <div className="text-2xl font-bold text-primary">
              {branches.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Cabang
            </div>
          </Card>
          <Card bodyClass="text-center">
            <div className="text-2xl font-bold text-green-600">
              {branches.filter((b) => b.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Beroperasi
            </div>
          </Card>
          <Card bodyClass="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {branches
                .filter((b) => b.status === 'active')
                .reduce((sum, b) => sum + b.totalMembers, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Member
            </div>
          </Card>
          <Card bodyClass="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {(
                branches
                  .filter((b) => b.status === 'active')
                  .reduce((sum, b) => sum + b.rating, 0) /
                branches.filter((b) => b.status === 'active').length
              ).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Rata-rata Rating
            </div>
          </Card>
        </div>

        {/* Branch List */}
        <Card
          header={{
            content: (
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold">Daftar Cabang</h3>
                <Badge
                  content={`${filteredBranches.length} cabang`}
                  className="bg-primary/10 text-primary"
                />
              </div>
            ),
            bordered: false,
          }}
          bodyClass="pt-0"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBranches.map((branch) => (
              <Card
                key={branch.id}
                bodyClass="p-0"
                className="hover:shadow-lg transition-shadow"
              >
                {/* Branch Image */}
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {branch.isMainBranch && (
                      <Badge
                        content="Pusat"
                        className="bg-primary text-white"
                      />
                    )}
                    {getStatusBadge(branch.status)}
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h4 className="font-bold text-lg">{branch.name}</h4>
                  </div>
                </div>

                {/* Branch Info */}
                <div className="p-4 space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-2">
                    <Location size={16} className="text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {branch.address}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2">
                      <Call size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {branch.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sms size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {branch.email}
                      </span>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div>Sen-Jum: {branch.operatingHours.weekdays}</div>
                      <div>Sab-Min: {branch.operatingHours.weekend}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  {branch.status === 'active' && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <Star1
                          size={14}
                          className="text-yellow-500"
                          variant="Bold"
                        />
                        <span className="text-sm font-medium">
                          {branch.rating}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {branch.totalMembers.toLocaleString()} member
                      </div>
                    </div>
                  )}

                  {/* Facilities */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Fasilitas:</p>
                    <div className="flex flex-wrap gap-1">
                      {branch.facilities.slice(0, 3).map((facility) => (
                        <Badge
                          key={facility}
                          content={facility}
                          className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs"
                        />
                      ))}
                      {branch.facilities.length > 3 && (
                        <Badge
                          content={`+${branch.facilities.length - 3} lainnya`}
                          className="bg-primary/10 text-primary text-xs"
                        />
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="plain"
                      className="flex-1"
                      icon={<DirectRight size={14} />}
                    >
                      Petunjuk Arah
                    </Button>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="solid"
                        icon={<Edit size={14} />}
                        onClick={() => setSelectedBranch(branch)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredBranches.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Location size={48} className="mx-auto mb-2" />
              <p>Tidak ada cabang yang ditemukan</p>
              <p className="text-sm mt-1">
                Coba ubah kata kunci pencarian Anda
              </p>
            </div>
          )}
        </Card>

        {/* Add New Branch (when editing) */}
        {isEditing && (
          <Card>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Location size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tambah Cabang Baru</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Buat cabang gym baru dengan informasi lengkap
              </p>
              <Button variant="solid" size="sm">
                Tambah Cabang
              </Button>
            </div>
          </Card>
        )}
      </div>
    </LayoutGymSetting>
  )
}

export default GymLocation
