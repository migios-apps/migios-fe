import { Avatar, Badge, Button, Card, Input } from '@/components/ui'
import {
  Call,
  Camera,
  Clock,
  Edit,
  Facebook,
  Instagram,
  Location,
  Sms,
  Star1,
  Youtube,
} from 'iconsax-react'
import { useState } from 'react'
import LayoutGymSetting from './Layout'

// Validation types
interface ValidationErrors {
  name?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  description?: string
  socialMedia?: {
    [key: string]: string
  }
}

type OperatingHours = {
  day: string
  open: string
  close: string
  isOpen: boolean
}

type Facility = {
  id: string
  name: string
  icon: string
  available: boolean
}

type SocialMedia = {
  platform: string
  username: string
  url: string
  icon: React.ReactNode
}

const INITIAL_GYM_INFO = {
  name: 'FitZone Premium Gym',
  tagline: 'Your Ultimate Fitness Destination',
  description:
    'FitZone Premium Gym adalah pusat kebugaran terdepan yang menyediakan fasilitas lengkap dan modern untuk membantu Anda mencapai tujuan fitness. Dengan peralatan terbaru, trainer berpengalaman, dan suasana yang mendukung, kami berkomitmen memberikan pengalaman fitness terbaik.',
  established: '2018',
  totalMembers: '2,500+',
  branches: '5',
  rating: '4.8',
  address: 'Jl. Sudirman No. 123, Jakarta Pusat 10220',
  phone: '+62 21 1234 5678',
  email: 'info@fitzone.com',
  website: 'www.fitzone.com',
}

const OPERATING_HOURS: OperatingHours[] = [
  { day: 'Senin', open: '05:00', close: '23:00', isOpen: true },
  { day: 'Selasa', open: '05:00', close: '23:00', isOpen: true },
  { day: 'Rabu', open: '05:00', close: '23:00', isOpen: true },
  { day: 'Kamis', open: '05:00', close: '23:00', isOpen: true },
  { day: 'Jumat', open: '05:00', close: '23:00', isOpen: true },
  { day: 'Sabtu', open: '06:00', close: '22:00', isOpen: true },
  { day: 'Minggu', open: '07:00', close: '21:00', isOpen: true },
]

const FACILITIES: Facility[] = [
  { id: '1', name: 'Cardio Zone', icon: '🏃', available: true },
  { id: '2', name: 'Weight Training', icon: '🏋️', available: true },
  { id: '3', name: 'Group Classes', icon: '🤸', available: true },
  { id: '4', name: 'Personal Training', icon: '👨‍🏫', available: true },
  { id: '5', name: 'Swimming Pool', icon: '🏊', available: true },
  { id: '6', name: 'Sauna & Steam', icon: '🧖', available: true },
  { id: '7', name: 'Locker Room', icon: '🚿', available: true },
  { id: '8', name: 'Parking Area', icon: '🚗', available: true },
  { id: '9', name: 'Cafe & Juice Bar', icon: '🥤', available: true },
  { id: '10', name: 'Massage Therapy', icon: '💆', available: false },
  { id: '11', name: 'Yoga Studio', icon: '🧘', available: true },
  { id: '12', name: 'Basketball Court', icon: '🏀', available: false },
]

const SOCIAL_MEDIA: SocialMedia[] = [
  {
    platform: 'Instagram',
    username: '@fitzonegym',
    url: 'https://instagram.com/fitzonegym',
    icon: <Instagram size={20} className="text-pink-500" />,
  },
  {
    platform: 'Facebook',
    username: 'FitZone Premium Gym',
    url: 'https://facebook.com/fitzonegym',
    icon: <Facebook size={20} className="text-blue-600" />,
  },
  {
    platform: 'YouTube',
    username: 'FitZone Gym',
    url: 'https://youtube.com/fitzonegym',
    icon: <Youtube size={20} className="text-red-500" />,
  },
]

const AboutGym = () => {
  const [gymInfo, setGymInfo] = useState(INITIAL_GYM_INFO)
  const [isEditing, setIsEditing] = useState(false)
  const [operatingHours, setOperatingHours] =
    useState<OperatingHours[]>(OPERATING_HOURS)
  const [facilities, setFacilities] = useState<Facility[]>(FACILITIES)
  const [socialMedia, setSocialMedia] = useState(SOCIAL_MEDIA)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email wajib diisi'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Format email tidak valid'
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return 'Nomor telepon wajib diisi'
    const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/
    if (!phoneRegex.test(phone.replace(/\s/g, '')))
      return 'Format nomor telepon tidak valid'
    return undefined
  }

  const validateWebsite = (website: string): string | undefined => {
    if (!website) return undefined
    const urlRegex = /^https?:\/\/.+/
    if (!urlRegex.test(website))
      return 'Website harus dimulai dengan http:// atau https://'
    return undefined
  }

  const validateRequired = (
    value: string,
    fieldName: string
  ): string | undefined => {
    if (!value || value.trim() === '') return `${fieldName} wajib diisi`
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Validate basic info
    newErrors.name = validateRequired(gymInfo.name, 'Nama gym')
    newErrors.email = validateEmail(gymInfo.email)
    newErrors.phone = validatePhone(gymInfo.phone)
    newErrors.website = validateWebsite(gymInfo.website)
    newErrors.address = validateRequired(gymInfo.address, 'Alamat')
    newErrors.description = validateRequired(gymInfo.description, 'Deskripsi')

    // Validate social media
    newErrors.socialMedia = {}
    socialMedia.forEach((social) => {
      if (social.username && social.username.trim() !== '') {
        if (
          social.platform === 'instagram' &&
          !social.username.match(/^[a-zA-Z0-9._]+$/)
        ) {
          newErrors.socialMedia![social.platform] =
            'Username Instagram tidak valid'
        }
        if (social.platform === 'facebook' && social.username.length < 3) {
          newErrors.socialMedia![social.platform] =
            'Username Facebook minimal 3 karakter'
        }
      }
    })

    setErrors(newErrors)

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => {
      if (typeof error === 'string') return error !== undefined
      if (typeof error === 'object' && error !== null) {
        return Object.values(error).some((subError) => subError !== undefined)
      }
      return false
    })

    return !hasErrors
  }

  const handleSave = async () => {
    // Validate form before saving
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSaveSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // TODO: Replace with actual API call
      console.log('Saving gym info:', {
        gymInfo,
        operatingHours,
        facilities,
        socialMedia,
      })

      setIsEditing(false)
      setSaveSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving gym info:', error)
      // You could set an error state here for user feedback
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setErrors({})
    // Reset form to original values if needed
  }

  const toggleFacility = (facilityId: string) => {
    setFacilities((prev) =>
      prev.map((facility) =>
        facility.id === facilityId
          ? { ...facility, available: !facility.available }
          : facility
      )
    )
  }

  const toggleOperatingDay = (index: number) => {
    setOperatingHours((prev) =>
      prev.map((hour, i) =>
        i === index ? { ...hour, isOpen: !hour.isOpen } : hour
      )
    )
  }

  return (
    <LayoutGymSetting>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tentang Gym
          </h1>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="plain"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Batal
                </Button>
                <Button variant="solid" size="sm" onClick={handleSave}>
                  Simpan
                </Button>
              </>
            ) : (
              <Button
                variant="solid"
                size="sm"
                icon={<Edit size={16} />}
                onClick={() => setIsEditing(true)}
              >
                Edit Informasi
              </Button>
            )}
          </div>
        </div>

        {/* Gym Profile Card */}
        <Card>
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            {/* Gym Logo/Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar
                  size={200}
                  src="/img/gym-logo.jpg"
                  alt={gymInfo.name}
                  className="border-4 border-gray-200 dark:border-gray-700"
                />
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 rounded-full w-8 h-8"
                    icon={<Camera size={16} />}
                  />
                )}
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star1 size={16} className="text-yellow-500" variant="Bold" />
                  <span className="font-bold text-lg">{gymInfo.rating}</span>
                  <span className="text-gray-500 text-sm">Rating</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-bold text-lg text-primary">
                      {gymInfo.totalMembers}
                    </div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-primary">
                      {gymInfo.branches}
                    </div>
                    <div className="text-xs text-gray-500">Cabang</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-primary">
                      {gymInfo.established}
                    </div>
                    <div className="text-xs text-gray-500">Berdiri</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gym Information */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Gym
                  </label>
                  {isEditing ? (
                    <Input
                      value={gymInfo.name}
                      className="text-lg font-bold"
                      onChange={(e) =>
                        setGymInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {gymInfo.name}
                    </h2>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tagline
                  </label>
                  {isEditing ? (
                    <div>
                      <Input
                        value={gymInfo.name}
                        disabled={!isEditing}
                        className="text-2xl font-bold"
                        placeholder="Nama Gym"
                        onChange={(e) =>
                          setGymInfo({ ...gymInfo, name: e.target.value })
                        }
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-primary font-medium">
                      {gymInfo.tagline}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deskripsi
                  </label>
                  {isEditing ? (
                    <textarea
                      value={gymInfo.description}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                      rows={4}
                      onChange={(e) =>
                        setGymInfo((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {gymInfo.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alamat
                  </label>
                  {isEditing ? (
                    <Input
                      value={gymInfo.address}
                      prefix={<Location size={16} className="text-gray-400" />}
                      onChange={(e) =>
                        setGymInfo((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-start gap-2">
                      <Location size={16} className="text-gray-400 mt-1" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {gymInfo.address}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telepon
                  </label>
                  {isEditing ? (
                    <Input
                      value={gymInfo.phone}
                      prefix={<Call size={16} className="text-gray-400" />}
                      onChange={(e) =>
                        setGymInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Call size={16} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {gymInfo.phone}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      value={gymInfo.email}
                      prefix={<Sms size={16} className="text-gray-400" />}
                      onChange={(e) =>
                        setGymInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sms size={16} className="text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {gymInfo.email}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  {isEditing ? (
                    <Input
                      value={gymInfo.website}
                      onChange={(e) =>
                        setGymInfo((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <span className="text-primary hover:underline cursor-pointer">
                      {gymInfo.website}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Operating Hours */}
        <Card
          header={{
            content: (
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                <h3 className="text-lg font-semibold">Jam Operasional</h3>
              </div>
            ),
            bordered: false,
          }}
          bodyClass="pt-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operatingHours.map((hour, index) => (
              <div
                key={hour.day}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  hour.isOpen
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {hour.day}
                  </span>
                  {isEditing && (
                    <Button
                      size="xs"
                      variant={hour.isOpen ? 'solid' : 'plain'}
                      onClick={() => toggleOperatingDay(index)}
                    >
                      {hour.isOpen ? 'Buka' : 'Tutup'}
                    </Button>
                  )}
                </div>
                {hour.isOpen ? (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Input
                          type="time"
                          value={hour.open}
                          size="sm"
                          onChange={(e) => {
                            const newHours = [...operatingHours]
                            newHours[index].open = e.target.value
                            setOperatingHours(newHours)
                          }}
                        />
                        <span className="self-center">-</span>
                        <Input
                          type="time"
                          value={hour.close}
                          size="sm"
                          onChange={(e) => {
                            const newHours = [...operatingHours]
                            newHours[index].close = e.target.value
                            setOperatingHours(newHours)
                          }}
                        />
                      </div>
                    ) : (
                      <span>
                        {hour.open} - {hour.close}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-red-500">Tutup</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Facilities */}
        <Card
          header={{
            content: (
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold">Fasilitas & Layanan</h3>
                <Badge
                  content={`${facilities.filter((f) => f.available).length}/${facilities.length} tersedia`}
                  className="bg-primary/10 text-primary"
                />
              </div>
            ),
            bordered: false,
          }}
          bodyClass="pt-0"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  facility.available
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 hover:border-green-300'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 hover:border-gray-300'
                }`}
                onClick={() => isEditing && toggleFacility(facility.id)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{facility.icon}</div>
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                    {facility.name}
                  </div>
                  <Badge
                    content={facility.available ? 'Tersedia' : 'Tidak Tersedia'}
                    className={`text-xs ${
                      facility.available
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 Klik pada fasilitas untuk mengubah status ketersediaan
              </p>
            </div>
          )}
        </Card>

        {/* Social Media */}
        <Card
          header={{
            content: <h3 className="text-lg font-semibold">Media Sosial</h3>,
            bordered: false,
          }}
          bodyClass="pt-0"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialMedia.map((social, index) => (
              <div
                key={social.platform}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  {social.icon}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {social.platform}
                  </span>
                </div>
                {isEditing ? (
                  <Input
                    value={social.username}
                    placeholder="Username atau nama akun"
                    onChange={(e) => {
                      const newSocialMedia = [...socialMedia]
                      newSocialMedia[index].username = e.target.value
                      setSocialMedia(newSocialMedia)
                    }}
                  />
                ) : (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {social.username}
                    </div>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {social.url}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </LayoutGymSetting>
  )
}

export default AboutGym
