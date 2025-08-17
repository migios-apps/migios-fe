import { Badge, Button, Card } from '@/components/ui'
import {
  ArrowRight2,
  Calendar,
  Crown1,
  People,
  TickCircle,
  Unlimited,
  User,
} from 'iconsax-react'
import { useState } from 'react'
import LayoutGymSetting from './Layout'

type PlanFeature = {
  name: string
  included: boolean
  limit?: string
}

type MigiosPlan = {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  memberLimit: number | 'unlimited'
  branchLimit: number | 'unlimited'
  features: PlanFeature[]
  isPopular: boolean
  isCurrentPlan: boolean
  color: string
  icon: React.ReactNode
}

const MIGIOS_PLANS: MigiosPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Cocok untuk gym kecil yang baru memulai',
    price: {
      monthly: 299000,
      yearly: 2990000,
    },
    memberLimit: 100,
    branchLimit: 1,
    features: [
      { name: 'Member Management', included: true },
      { name: 'Basic Reporting', included: true },
      { name: 'Payment Tracking', included: true },
      { name: 'Class Scheduling', included: true, limit: '10 kelas/bulan' },
      { name: 'Staff Management', included: true, limit: '3 staff' },
      { name: 'WhatsApp Integration', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'Multi-Branch Support', included: false },
      { name: 'Custom Branding', included: false },
      { name: 'API Access', included: false },
    ],
    isPopular: false,
    isCurrentPlan: false,
    color: 'blue',
    icon: <User size={24} className="text-blue-600" />,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Untuk gym menengah dengan fitur lengkap',
    price: {
      monthly: 599000,
      yearly: 5990000,
    },
    memberLimit: 500,
    branchLimit: 3,
    features: [
      { name: 'Member Management', included: true },
      { name: 'Advanced Reporting', included: true },
      { name: 'Payment Tracking', included: true },
      { name: 'Class Scheduling', included: true, limit: 'Unlimited' },
      { name: 'Staff Management', included: true, limit: '10 staff' },
      { name: 'WhatsApp Integration', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Multi-Branch Support', included: true, limit: '3 cabang' },
      { name: 'Custom Branding', included: true },
      { name: 'API Access', included: false },
    ],
    isPopular: true,
    isCurrentPlan: true,
    color: 'green',
    icon: <People size={24} className="text-green-600" />,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solusi lengkap untuk jaringan gym besar',
    price: {
      monthly: 1299000,
      yearly: 12990000,
    },
    memberLimit: 'unlimited',
    branchLimit: 'unlimited',
    features: [
      { name: 'Member Management', included: true },
      { name: 'Advanced Reporting', included: true },
      { name: 'Payment Tracking', included: true },
      { name: 'Class Scheduling', included: true, limit: 'Unlimited' },
      { name: 'Staff Management', included: true, limit: 'Unlimited' },
      { name: 'WhatsApp Integration', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Multi-Branch Support', included: true, limit: 'Unlimited' },
      { name: 'Custom Branding', included: true },
      { name: 'API Access', included: true },
    ],
    isPopular: false,
    isCurrentPlan: false,
    color: 'purple',
    icon: <Crown1 size={24} className="text-purple-600" />,
  },
]

const GymPlan = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  )
  const [selectedPlan, setSelectedPlan] = useState<string>('professional')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPlanColor = (color: string, variant: 'bg' | 'border' | 'text') => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-600 dark:text-purple-400',
      },
    }
    return colors[color as keyof typeof colors]?.[variant] || ''
  }

  return (
    <LayoutGymSetting>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Paket Langganan Migios
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Pilih paket yang sesuai dengan kebutuhan gym Anda
          </p>
        </div>

        {/* Current Plan Status */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <TickCircle size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Paket Aktif: Professional
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Berlaku hingga 15 September 2024
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(599000)}
              </div>
              <div className="text-sm text-gray-500">/bulan</div>
            </div>
          </div>
        </Card>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Bulanan
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              <span>Tahunan</span>
              <Badge
                content="Hemat 17%"
                className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              />
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {MIGIOS_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all duration-200 ${
                plan.isCurrentPlan
                  ? `${getPlanColor(plan.color, 'border')} ring-2 ring-green-200 dark:ring-green-800`
                  : 'hover:shadow-lg'
              } ${plan.isPopular ? 'scale-105' : ''}`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge
                    content="Paling Populer"
                    className="bg-orange-500 text-white px-4 py-1"
                  />
                </div>
              )}

              {/* Current Plan Badge */}
              {plan.isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge
                    content="Paket Aktif"
                    className="bg-green-500 text-white px-3 py-1"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 ${getPlanColor(plan.color, 'bg')} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(plan.price[billingCycle])}
                  </div>
                  <div className="text-sm text-gray-500">
                    /{billingCycle === 'monthly' ? 'bulan' : 'tahun'}
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-xs text-green-600 mt-1">
                      Hemat{' '}
                      {formatPrice(plan.price.monthly * 12 - plan.price.yearly)}{' '}
                      per tahun
                    </div>
                  )}
                </div>

                {/* Plan Limits */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <User size={16} className="text-gray-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.memberLimit === 'unlimited' ? (
                        <div className="flex items-center justify-center gap-1">
                          <Unlimited size={14} />
                          <span>Unlimited</span>
                        </div>
                      ) : (
                        `${plan.memberLimit} Member`
                      )}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar size={16} className="text-gray-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.branchLimit === 'unlimited' ? (
                        <div className="flex items-center justify-center gap-1">
                          <Unlimited size={14} />
                          <span>Unlimited</span>
                        </div>
                      ) : (
                        `${plan.branchLimit} Cabang`
                      )}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {feature.included ? (
                          <TickCircle size={16} className="text-green-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-sm ${
                            feature.included
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400 dark:text-gray-500 line-through'
                          }`}
                        >
                          {feature.name}
                        </span>
                        {feature.limit && feature.included && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({feature.limit})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  variant={plan.isCurrentPlan ? 'plain' : 'solid'}
                  disabled={plan.isCurrentPlan}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.isCurrentPlan ? (
                    'Paket Aktif'
                  ) : (
                    <>
                      Pilih Paket
                      <ArrowRight2 size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card
          header={{
            content: (
              <h3 className="text-lg font-semibold">Perbandingan Fitur</h3>
            ),
            bordered: false,
          }}
          bodyClass="pt-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Fitur
                  </th>
                  {MIGIOS_PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MIGIOS_PLANS[0].features.map((_, featureIndex) => (
                  <tr
                    key={featureIndex}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {MIGIOS_PLANS[0].features[featureIndex].name}
                    </td>
                    {MIGIOS_PLANS.map((plan) => (
                      <td key={plan.id} className="py-3 px-4 text-center">
                        {plan.features[featureIndex].included ? (
                          <div className="flex items-center justify-center">
                            <TickCircle size={16} className="text-green-500" />
                            {plan.features[featureIndex].limit && (
                              <span className="text-xs text-gray-500 ml-1">
                                {plan.features[featureIndex].limit}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* FAQ or Support */}
        <Card>
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">
              Butuh Bantuan Memilih Paket?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tim kami siap membantu Anda menemukan paket yang tepat
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="plain" size="sm">
                Hubungi Sales
              </Button>
              <Button variant="solid" size="sm">
                Chat WhatsApp
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </LayoutGymSetting>
  )
}

export default GymPlan
