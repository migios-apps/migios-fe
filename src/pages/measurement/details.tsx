import { Container } from '@/components/shared'
import Loading from '@/components/shared/Loading'
import { Avatar, Button, Card, Tag, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import { QUERY_KEY } from '@/constants/queryKeys.constant'
import { statusColor } from '@/constants/utils'
import { MemberMeasurement } from '@/services/api/@types/measurement'
import { apiGetMemberMeasurement } from '@/services/api/MeasurementService'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { HiPencil } from 'react-icons/hi'
import {
  TbArrowNarrowLeft,
  TbChartLine,
  TbFileDescription,
} from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router-dom'
import AnalyticsTab from './details/AnalyticsTab'

const MeasurementDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    data: measurement,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY.measurements, id],
    queryFn: async () => {
      const res = await apiGetMemberMeasurement(Number(id))
      return res.data as MemberMeasurement
    },
    enabled: !!id,
  })

  // Calculate date range for analytics (last 6 months by default)
  // const endDate = dayjs().format('YYYY-MM-DD')
  // const startDate = dayjs().subtract(6, 'months').format('YYYY-MM-DD')
  const startDate = '2024-01-01'
  const endDate = '2024-12-31'

  const resultOptions = {
    excellent: 'Sangat Baik',
    good: 'Baik',
    average: 'Rata-rata',
    need_improvement: 'Perlu Perbaikan',
    poor: 'Buruk',
  }

  return (
    <Loading loading={isLoading}>
      <Container>
        {measurement && !error && (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="plain"
                  icon={<TbArrowNarrowLeft />}
                  onClick={() => navigate('/measurement')}
                >
                  Kembali
                </Button>
                <h3>Detail Pengukuran</h3>
              </div>
              <Button
                variant="solid"
                icon={<HiPencil />}
                onClick={() => navigate(`/measurement/edit/${id}`)}
              >
                Ubah
              </Button>
            </div>

            {/* Member & Trainer Info */}
            <Card>
              <div className="flex flex-col md:flex-row gap-6 p-6">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar
                    size={64}
                    shape="circle"
                    src={measurement.member?.photo || ''}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Member</span>
                    <span className="font-semibold text-lg">
                      {measurement.member?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {measurement.member?.code}
                    </span>
                  </div>
                </div>
                {measurement.trainer && (
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar
                      size={64}
                      shape="circle"
                      src={measurement.trainer?.photo || ''}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Trainer</span>
                      <span className="font-semibold text-lg">
                        {measurement.trainer?.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {measurement.trainer?.code}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-gray-500">
                    Tanggal Pengukuran
                  </span>
                  <span className="font-semibold text-lg">
                    {dayjs(measurement.measured_at).format(
                      'DD MMMM YYYY HH:mm'
                    )}
                  </span>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="detail">
              <TabList>
                <TabNav value="detail" icon={<TbFileDescription />}>
                  Detail
                </TabNav>
                <TabNav value="analytics" icon={<TbChartLine />}>
                  Analytics
                </TabNav>
              </TabList>

              <TabContent value="detail">
                <div className="flex flex-col gap-6 mt-6">
                  {/* Basic Information */}
                  <Card>
                    <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                      <h4 className="font-semibold">Informasi Dasar</h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Tanggal Pengukuran
                        </span>
                        <span className="font-semibold">
                          {dayjs(measurement.measured_at).format(
                            'DD MMMM YYYY HH:mm'
                          )}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Dibuat Pada
                        </span>
                        <span className="font-semibold">
                          {dayjs(measurement.created_at).format(
                            'DD MMMM YYYY HH:mm'
                          )}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Diubah Pada
                        </span>
                        <span className="font-semibold">
                          {dayjs(measurement.updated_at).format(
                            'DD MMMM YYYY HH:mm'
                          )}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Body Composition Measurement */}
                  <Card>
                    <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                      <h4 className="font-semibold">
                        Pengukuran Komposisi Tubuh
                      </h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Berat Badan
                        </span>
                        <span className="font-semibold">
                          {measurement.weight_kg
                            ? `${measurement.weight_kg} Kg`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Persentase Lemak Tubuh
                        </span>
                        <span className="font-semibold">
                          {measurement.body_fat_percent
                            ? `${measurement.body_fat_percent}%`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Massa Otot
                        </span>
                        <span className="font-semibold">
                          {measurement.muscle_mass_kg
                            ? `${measurement.muscle_mass_kg} Kg`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">BMI</span>
                        <span className="font-semibold">
                          {measurement.bmi ? measurement.bmi.toFixed(2) : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Massa Tubuh Tanpa Lemak (LBM)
                        </span>
                        <span className="font-semibold">
                          {measurement.lean_body_mass_kg
                            ? `${measurement.lean_body_mass_kg} Kg`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Massa Tulang
                        </span>
                        <span className="font-semibold">
                          {measurement.bone_mass_kg
                            ? `${measurement.bone_mass_kg} Kg`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Persentase Total Air Tubuh
                        </span>
                        <span className="font-semibold">
                          {measurement.total_body_water_percent
                            ? `${measurement.total_body_water_percent}%`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Tingkat Lemak Visceral
                        </span>
                        <span className="font-semibold">
                          {measurement.visceral_fat_level
                            ? measurement.visceral_fat_level
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Usia Metabolik
                        </span>
                        <span className="font-semibold">
                          {measurement.metabolic_age_years
                            ? `${measurement.metabolic_age_years} Tahun`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Kadar Protein
                        </span>
                        <span className="font-semibold">
                          {measurement.protein_percent
                            ? `${measurement.protein_percent}%`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Usia Tubuh
                        </span>
                        <span className="font-semibold">
                          {measurement.body_age_years
                            ? `${measurement.body_age_years} Tahun`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Rating Bentuk Tubuh
                        </span>
                        <span className="font-semibold">
                          {measurement.physique_rating
                            ? `${measurement.physique_rating}/9`
                            : '-'}
                        </span>
                      </div>
                      {measurement.bmr_kcal && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">BMR</span>
                          <span className="font-semibold">
                            {measurement.bmr_kcal} Kcal
                          </span>
                        </div>
                      )}
                      {measurement.tdee_kcal && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">TDEE</span>
                          <span className="font-semibold">
                            {measurement.tdee_kcal} Kcal
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Body Size Measurement */}
                  <Card>
                    <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                      <h4 className="font-semibold">Pengukuran Ukuran Tubuh</h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Lingkar Leher
                        </span>
                        <span className="font-semibold">
                          {measurement.neck_cm
                            ? `${measurement.neck_cm} Cm`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Lengan Kanan
                        </span>
                        <span className="font-semibold">
                          {measurement.right_arm_cm
                            ? `${measurement.right_arm_cm} Cm`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Lengan Kiri
                        </span>
                        <span className="font-semibold">
                          {measurement.left_arm_cm
                            ? `${measurement.left_arm_cm} Cm`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Lingkar Dada
                        </span>
                        <span className="font-semibold">
                          {measurement.chest_cm
                            ? `${measurement.chest_cm} Cm`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Lingkar Perut
                        </span>
                        <span className="font-semibold">
                          {measurement.abdominal_cm
                            ? `${measurement.abdominal_cm} Cm`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Lingkar Pinggul
                        </span>
                        <span className="font-semibold">
                          {measurement.hip_cm
                            ? `${measurement.hip_cm} Cm`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Paha Kanan
                        </span>
                        <span className="font-semibold">
                          {measurement.right_thigh_cm
                            ? `${measurement.right_thigh_cm} Cm`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Paha Kiri</span>
                        <span className="font-semibold">
                          {measurement.left_thigh_cm
                            ? `${measurement.left_thigh_cm} Cm`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Betis Kanan
                        </span>
                        <span className="font-semibold">
                          {measurement.right_calf_cm
                            ? `${measurement.right_calf_cm} Cm`
                            : '-'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Betis Kiri
                        </span>
                        <span className="font-semibold">
                          {measurement.left_calf_cm
                            ? `${measurement.left_calf_cm} Cm`
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Delta Changes */}
                  {(measurement.delta_weight_kg ||
                    measurement.delta_body_fat_percent ||
                    measurement.delta_abdominal_cm) && (
                    <Card>
                      <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                        <h4 className="font-semibold">
                          Perubahan dari Pengukuran Sebelumnya
                        </h4>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        {measurement.delta_weight_kg !== null &&
                          measurement.delta_weight_kg !== undefined && (
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500">
                                Perubahan Berat Badan
                              </span>
                              <span
                                className={`font-semibold ${
                                  measurement.delta_weight_kg > 0
                                    ? 'text-red-500'
                                    : measurement.delta_weight_kg < 0
                                      ? 'text-green-500'
                                      : ''
                                }`}
                              >
                                {measurement.delta_weight_kg > 0 ? '+' : ''}
                                {measurement.delta_weight_kg} Kg
                              </span>
                            </div>
                          )}
                        {measurement.delta_body_fat_percent !== null &&
                          measurement.delta_body_fat_percent !== undefined && (
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500">
                                Perubahan Lemak Tubuh
                              </span>
                              <span
                                className={`font-semibold ${
                                  measurement.delta_body_fat_percent > 0
                                    ? 'text-red-500'
                                    : measurement.delta_body_fat_percent < 0
                                      ? 'text-green-500'
                                      : ''
                                }`}
                              >
                                {measurement.delta_body_fat_percent > 0
                                  ? '+'
                                  : ''}
                                {measurement.delta_body_fat_percent}%
                              </span>
                            </div>
                          )}
                        {measurement.delta_abdominal_cm !== null &&
                          measurement.delta_abdominal_cm !== undefined && (
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500">
                                Perubahan Lingkar Perut
                              </span>
                              <span
                                className={`font-semibold ${
                                  measurement.delta_abdominal_cm > 0
                                    ? 'text-red-500'
                                    : measurement.delta_abdominal_cm < 0
                                      ? 'text-green-500'
                                      : ''
                                }`}
                              >
                                {measurement.delta_abdominal_cm > 0 ? '+' : ''}
                                {measurement.delta_abdominal_cm} Cm
                              </span>
                            </div>
                          )}
                      </div>
                    </Card>
                  )}

                  {/* Photos */}
                  {measurement.photos && measurement.photos.length > 0 && (
                    <Card>
                      <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                        <h4 className="font-semibold">Foto Pengukuran</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {measurement.photos.map((photo) => (
                          <div key={photo.id} className="flex flex-col gap-2">
                            <span className="text-sm text-gray-500 capitalize">
                              {photo.view === 'front'
                                ? 'Tampak Depan'
                                : photo.view === 'back'
                                  ? 'Tampak Belakang'
                                  : photo.view === 'left'
                                    ? 'Tampak Samping Kiri'
                                    : 'Tampak Samping Kanan'}
                            </span>
                            <img
                              src={photo.url}
                              alt={`${photo.view} view`}
                              className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Result of Measurement */}
                  <Card>
                    <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                      <h4 className="font-semibold">Hasil Pengukuran</h4>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 mb-2">
                          Penilaian
                        </span>
                        <Tag
                          className={
                            statusColor[measurement.result] ||
                            statusColor.active
                          }
                        >
                          <span className="capitalize">
                            {measurement.result
                              ? resultOptions[
                                  measurement.result as keyof typeof resultOptions
                                ] || measurement.result.replace('_', ' ')
                              : '-'}
                          </span>
                        </Tag>
                      </div>
                      {measurement.notes && (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500 mb-2">
                            Catatan
                          </span>
                          <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {measurement.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Nutrition Target */}
                  {(measurement.calorie_target_kcal ||
                    measurement.protein_target_grams ||
                    measurement.carb_target_grams ||
                    measurement.fat_target_grams ||
                    measurement.adherence_score ||
                    measurement.activity_factor) && (
                    <Card>
                      <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
                        <h4 className="font-semibold">Target Nutrisi</h4>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        {measurement.calorie_target_kcal && (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">
                              Target Kalori
                            </span>
                            <span className="font-semibold">
                              {measurement.calorie_target_kcal} Kcal
                            </span>
                          </div>
                        )}
                        {measurement.protein_target_grams && (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">
                              Target Protein
                            </span>
                            <span className="font-semibold">
                              {measurement.protein_target_grams} g
                            </span>
                          </div>
                        )}
                        {measurement.carb_target_grams && (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">
                              Target Karbohidrat
                            </span>
                            <span className="font-semibold">
                              {measurement.carb_target_grams} g
                            </span>
                          </div>
                        )}
                        {measurement.fat_target_grams && (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">
                              Target Lemak
                            </span>
                            <span className="font-semibold">
                              {measurement.fat_target_grams} g
                            </span>
                          </div>
                        )}
                        {measurement.adherence_score && (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">
                              Skor Kepatuhan
                            </span>
                            <span className="font-semibold">
                              {measurement.adherence_score}/10
                            </span>
                          </div>
                        )}
                        {measurement.activity_factor && (
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">
                              Faktor Aktivitas
                            </span>
                            <span className="font-semibold">
                              {measurement.activity_factor}
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              </TabContent>

              <TabContent value="analytics">
                <div className="mt-6">
                  <AnalyticsTab
                    memberId={measurement.member_id}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              </TabContent>
            </Tabs>
          </div>
        )}
      </Container>
    </Loading>
  )
}

export default MeasurementDetail
