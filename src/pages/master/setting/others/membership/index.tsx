import { Badge, Button, Card, Switcher, Tooltip } from '@/components/ui'
import { InfoCircle } from 'iconsax-react'
import { useState } from 'react'
import LayoutOtherSetting from '../Layout'

type MembershipFeature = {
  id: string
  title: string
  description: string
  enabled: boolean
  category: 'access' | 'booking' | 'benefits' | 'restrictions'
  isPremium?: boolean
}

type MembershipSettings = {
  features: MembershipFeature[]
  globalSettings: {
    allowMultipleLocations: boolean
    requireCheckInApproval: boolean
    enableGuestPass: boolean
  }
}

const INITIAL_SETTINGS: MembershipSettings = {
  features: [
    {
      id: 'multi_location_access',
      title: 'Akses Multi Lokasi',
      description: 'Member dapat check-in di semua cabang gym',
      enabled: true,
      category: 'access',
    },
    {
      id: 'unlimited_checkin',
      title: 'Check-in Tanpa Batas',
      description: 'Member dapat check-in kapan saja tanpa batasan waktu',
      enabled: true,
      category: 'access',
    },
    {
      id: 'guest_pass',
      title: 'Guest Pass',
      description: 'Member dapat membawa tamu dengan biaya tambahan',
      enabled: false,
      category: 'access',
    },
    {
      id: 'class_booking',
      title: 'Booking Kelas',
      description: 'Member dapat melakukan booking kelas fitness',
      enabled: true,
      category: 'booking',
    },
    {
      id: 'pt_booking',
      title: 'Booking Personal Trainer',
      description: 'Member dapat melakukan booking sesi personal trainer',
      enabled: true,
      category: 'booking',
    },
    {
      id: 'advance_booking',
      title: 'Booking Jauh Hari',
      description: 'Member dapat booking hingga 30 hari ke depan',
      enabled: false,
      category: 'booking',
      isPremium: true,
    },
    {
      id: 'priority_booking',
      title: 'Priority Booking',
      description: 'Member mendapat prioritas dalam booking kelas populer',
      enabled: false,
      category: 'booking',
      isPremium: true,
    },
    {
      id: 'locker_access',
      title: 'Akses Locker',
      description: 'Member dapat menggunakan locker secara gratis',
      enabled: true,
      category: 'benefits',
    },
    {
      id: 'towel_service',
      title: 'Layanan Handuk',
      description: 'Member mendapat layanan handuk bersih gratis',
      enabled: false,
      category: 'benefits',
    },
    {
      id: 'parking_free',
      title: 'Parkir Gratis',
      description: 'Member mendapat fasilitas parkir gratis',
      enabled: true,
      category: 'benefits',
    },
    {
      id: 'member_discount',
      title: 'Diskon Member',
      description: 'Member mendapat diskon untuk pembelian produk dan layanan',
      enabled: true,
      category: 'benefits',
    },
    {
      id: 'freeze_membership',
      title: 'Freeze Membership',
      description: 'Member dapat membekukan membership sementara',
      enabled: true,
      category: 'restrictions',
    },
    {
      id: 'transfer_membership',
      title: 'Transfer Membership',
      description: 'Member dapat mentransfer membership ke orang lain',
      enabled: false,
      category: 'restrictions',
    },
  ],
  globalSettings: {
    allowMultipleLocations: true,
    requireCheckInApproval: false,
    enableGuestPass: false,
  },
}

const CATEGORY_LABELS = {
  access: 'Akses & Check-in',
  booking: 'Booking & Reservasi',
  benefits: 'Fasilitas & Benefit',
  restrictions: 'Pembatasan & Transfer',
}

const CATEGORY_COLORS = {
  access: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  booking: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  benefits:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  restrictions:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
}

const MembershipSetting = () => {
  const [settings, setSettings] = useState<MembershipSettings>(INITIAL_SETTINGS)
  const [hasChanges, setHasChanges] = useState(false)

  const handleFeatureToggle = (featureId: string) => {
    setSettings((prev) => ({
      ...prev,
      features: prev.features.map((feature) =>
        feature.id === featureId
          ? { ...feature, enabled: !feature.enabled }
          : feature
      ),
    }))
    setHasChanges(true)
  }

  const handleGlobalSettingToggle = (
    settingKey: keyof typeof settings.globalSettings
  ) => {
    setSettings((prev) => ({
      ...prev,
      globalSettings: {
        ...prev.globalSettings,
        [settingKey]: !prev.globalSettings[settingKey],
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // TODO: Implement API call to save settings
    console.log('Saving membership settings:', settings)
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings(INITIAL_SETTINGS)
    setHasChanges(false)
  }

  const groupedFeatures = settings.features.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = []
      }
      acc[feature.category].push(feature)
      return acc
    },
    {} as Record<string, MembershipFeature[]>
  )

  return (
    <LayoutOtherSetting>
      <div className="space-y-6 relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Pengaturan Membership
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Atur hak akses dan fasilitas yang tersedia untuk member
            </p>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <Button
                variant="plain"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
                onClick={handleReset}
              >
                Reset
              </Button>
            )}
            <Button
              variant="solid"
              size="sm"
              disabled={!hasChanges}
              onClick={handleSave}
            >
              Simpan Perubahan
            </Button>
          </div>
        </div>

        {/* Global Settings */}
        <Card
          header={{
            content: (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Pengaturan Global</h3>
                <Tooltip title="Pengaturan yang berlaku untuk semua member">
                  <InfoCircle size={16} className="text-gray-400" />
                </Tooltip>
              </div>
            ),
            bordered: false,
          }}
          bodyClass="pt-0"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Izinkan Akses Multi Lokasi
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Member dapat menggunakan fasilitas di semua cabang
                </p>
              </div>
              <Switcher
                checked={settings.globalSettings.allowMultipleLocations}
                onChange={() =>
                  handleGlobalSettingToggle('allowMultipleLocations')
                }
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Persetujuan Check-in
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Memerlukan persetujuan staff untuk check-in member
                </p>
              </div>
              <Switcher
                checked={settings.globalSettings.requireCheckInApproval}
                onChange={() =>
                  handleGlobalSettingToggle('requireCheckInApproval')
                }
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Aktifkan Guest Pass
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Member dapat membawa tamu dengan sistem guest pass
                </p>
              </div>
              <Switcher
                checked={settings.globalSettings.enableGuestPass}
                onChange={() => handleGlobalSettingToggle('enableGuestPass')}
              />
            </div>
          </div>
        </Card>

        {/* Feature Categories */}
        {Object.entries(groupedFeatures).map(([category, features]) => (
          <Card
            key={category}
            header={{
              content: (
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </h3>
                  <Badge
                    content={`${features.filter((f) => f.enabled).length}/${features.length} aktif`}
                    className={
                      CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]
                    }
                  />
                </div>
              ),
              bordered: false,
            }}
            bodyClass="pt-0"
          >
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`flex items-center justify-between py-3 ${
                    index < features.length - 1
                      ? 'border-b border-gray-200 dark:border-gray-700'
                      : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {feature.title}
                      </h4>
                      {feature.isPremium && (
                        <Badge
                          content="Premium"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {feature.description}
                    </p>
                  </div>
                  <Switcher
                    checked={feature.enabled}
                    onChange={() => handleFeatureToggle(feature.id)}
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Summary */}
        <Card className="bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Ringkasan Pengaturan
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(groupedFeatures).map(([category, features]) => (
                <div key={category} className="text-center">
                  <div className="font-bold text-lg text-primary">
                    {features.filter((f) => f.enabled).length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </LayoutOtherSetting>
  )
}

export default MembershipSetting
