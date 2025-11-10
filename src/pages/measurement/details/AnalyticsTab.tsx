import { Card } from '@/components/ui'
import Chart from '@/components/shared/Chart'
import {
  COLOR_1,
  COLOR_2,
  COLOR_3,
  COLOR_4,
  COLOR_5,
} from '@/constants/chart.constant'
import {
  apiGetWeightTrend,
  apiGetBodyCompositionTrend,
  apiGetBodySizeTrend,
  apiGetBMITrend,
  apiGetResultTrend,
  apiGetNutritionProgress,
  apiGetOverallProgress,
  apiGetRecommendation,
} from '@/services/api/MeasurementService'
import {
  GetMeasurementAnalyticParams,
  WeightTrendData,
  BodyCompositionData,
  BodySizeData,
  BMITrendData,
  NutritionProgressHistory,
} from '@/services/api/@types/measurement'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { QUERY_KEY } from '@/constants/queryKeys.constant'

interface AnalyticsTabProps {
  memberId: number
  startDate?: string
  endDate?: string
}

const AnalyticsTab = ({ memberId, startDate, endDate }: AnalyticsTabProps) => {
  const params: GetMeasurementAnalyticParams = {
    member_id: memberId,
    ...(startDate && { start_date: startDate }),
    ...(endDate && { end_date: endDate }),
  }

  const { data: weightTrend } = useQuery({
    queryKey: [QUERY_KEY.measurements, 'analytics', 'weight-trend', params],
    queryFn: async () => {
      const res = await apiGetWeightTrend(params)
      return (res as any).data || res
    },
    enabled: !!memberId,
  })

  const { data: bodyComposition } = useQuery({
    queryKey: [QUERY_KEY.measurements, 'analytics', 'body-composition', params],
    queryFn: async () => {
      const res = await apiGetBodyCompositionTrend(params)
      return (res as any).data || res
    },
    enabled: !!memberId,
  })

  const { data: bodySize } = useQuery({
    queryKey: [QUERY_KEY.measurements, 'analytics', 'body-size', params],
    queryFn: async () => {
      const res = await apiGetBodySizeTrend(params)
      return (res as any).data || res
    },
    enabled: !!memberId,
  })

  const { data: bmiTrend } = useQuery({
    queryKey: [QUERY_KEY.measurements, 'analytics', 'bmi', params],
    queryFn: async () => {
      const res = await apiGetBMITrend(params)
      return (res as any).data || res
    },
    enabled: !!memberId,
  })

  const { data: resultTrend } = useQuery({
    queryKey: [QUERY_KEY.measurements, 'analytics', 'result', params],
    queryFn: async () => {
      const res = await apiGetResultTrend(params)
      return (res as any).data || res
    },
    enabled: !!memberId,
  })

  const { data: nutritionProgress } = useQuery({
    queryKey: [QUERY_KEY.measurements, 'analytics', 'nutrition', params],
    queryFn: async () => {
      const res = await apiGetNutritionProgress(params)
      return (res as any).data || res
    },
    enabled: !!memberId,
  })

  const { data: overallProgress } = useQuery({
    queryKey: [QUERY_KEY.measurements, 'analytics', 'overall', params],
    queryFn: async () => {
      const res = await apiGetOverallProgress(params)
      return (res as any).data || res
    },
    enabled: !!memberId,
  })

  const { data: recommendation } = useQuery({
    queryKey: [QUERY_KEY.measurements, 'analytics', 'recommendation', params],
    queryFn: async () => {
      const res = await apiGetRecommendation(params)
      return (res as any).data || res
    },
    enabled: !!memberId,
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Overall Progress Summary */}
      {overallProgress?.summary && (
        <Card>
          <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
            <h4 className="font-semibold">Ringkasan Progress Keseluruhan</h4>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Pengukuran</span>
              <span className="font-semibold text-lg">
                {overallProgress.summary.total_measurements}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Pengukuran Pertama</span>
              <span className="font-semibold text-lg">
                {dayjs(overallProgress.summary.first_measurement_date).format(
                  'DD MMM YYYY'
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Pengukuran Terakhir</span>
              <span className="font-semibold text-lg">
                {dayjs(overallProgress.summary.last_measurement_date).format(
                  'DD MMM YYYY'
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Perubahan Berat</span>
              <span
                className={`font-semibold text-lg ${
                  overallProgress.summary.weight.change > 0
                    ? 'text-red-500'
                    : overallProgress.summary.weight.change < 0
                      ? 'text-green-500'
                      : ''
                }`}
              >
                {overallProgress.summary.weight.change > 0 ? '+' : ''}
                {overallProgress.summary.weight.change.toFixed(2)} Kg
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Weight Trend */}
      {weightTrend && weightTrend.data.length > 0 && (
        <Card>
          <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
            <h4 className="font-semibold">Trend Berat Badan</h4>
          </div>
          <Chart
            type="line"
            series={[
              {
                name: 'Berat Badan (Kg)',
                data: weightTrend.data.map(
                  (d: WeightTrendData) => d.weight || 0
                ),
              },
            ]}
            xAxis={weightTrend.data.map((d: WeightTrendData) =>
              dayjs(d.date).format('DD MMM YYYY')
            )}
            height={350}
            customOptions={{
              colors: [COLOR_1],
              stroke: {
                curve: 'smooth',
                width: 3,
              },
              markers: {
                size: 5,
                hover: {
                  size: 7,
                },
              },
              tooltip: {
                y: {
                  formatter: (val) => `${val} Kg`,
                },
              },
              yaxis: {
                title: {
                  text: 'Berat Badan (Kg)',
                },
              },
            }}
          />
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Berat Pertama</span>
              <span className="font-semibold">
                {weightTrend.summary.first_weight
                  ? `${weightTrend.summary.first_weight} Kg`
                  : '-'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Berat Terakhir</span>
              <span className="font-semibold">
                {weightTrend.summary.last_weight
                  ? `${weightTrend.summary.last_weight} Kg`
                  : '-'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Perubahan</span>
              <span
                className={`font-semibold ${
                  weightTrend.summary.change > 0
                    ? 'text-red-500'
                    : weightTrend.summary.change < 0
                      ? 'text-green-500'
                      : ''
                }`}
              >
                {weightTrend.summary.change > 0 ? '+' : ''}
                {weightTrend.summary.change.toFixed(2)} Kg
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">
                Persentase Perubahan
              </span>
              <span
                className={`font-semibold ${
                  weightTrend.summary.change_percent > 0
                    ? 'text-red-500'
                    : weightTrend.summary.change_percent < 0
                      ? 'text-green-500'
                      : ''
                }`}
              >
                {weightTrend.summary.change_percent > 0 ? '+' : ''}
                {weightTrend.summary.change_percent.toFixed(2)}%
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* BMI Trend */}
      {bmiTrend && bmiTrend.data.length > 0 && (
        <Card>
          <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
            <h4 className="font-semibold">Trend BMI</h4>
          </div>
          <Chart
            type="line"
            series={[
              {
                name: 'BMI',
                data: bmiTrend.data.map((d: BMITrendData) => d.bmi || 0),
              },
            ]}
            xAxis={bmiTrend.data.map((d: BMITrendData) =>
              dayjs(d.date).format('DD MMM YYYY')
            )}
            height={350}
            customOptions={{
              colors: [COLOR_2],
              stroke: {
                curve: 'smooth',
                width: 3,
              },
              markers: {
                size: 5,
                hover: {
                  size: 7,
                },
              },
              tooltip: {
                y: {
                  formatter: (val) => val.toFixed(2),
                },
              },
              yaxis: {
                title: {
                  text: 'BMI',
                },
              },
              annotations: {
                yaxis: [
                  {
                    y: 18.5,
                    borderColor: COLOR_3,
                    label: {
                      text: 'Underweight',
                      style: {
                        color: COLOR_3,
                      },
                    },
                  },
                  {
                    y: 25,
                    borderColor: COLOR_5,
                    label: {
                      text: 'Normal',
                      style: {
                        color: COLOR_5,
                      },
                    },
                  },
                  {
                    y: 30,
                    borderColor: COLOR_3,
                    label: {
                      text: 'Overweight',
                      style: {
                        color: COLOR_3,
                      },
                    },
                  },
                ],
              },
            }}
          />
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">BMI Pertama</span>
              <span className="font-semibold">
                {bmiTrend.summary.first_bmi
                  ? bmiTrend.summary.first_bmi.toFixed(2)
                  : '-'}
              </span>
              {bmiTrend.summary.first_category && (
                <span className="text-xs text-gray-400">
                  {bmiTrend.summary.first_category}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">BMI Terakhir</span>
              <span className="font-semibold">
                {bmiTrend.summary.last_bmi
                  ? bmiTrend.summary.last_bmi.toFixed(2)
                  : '-'}
              </span>
              {bmiTrend.summary.last_category && (
                <span className="text-xs text-gray-400">
                  {bmiTrend.summary.last_category}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Perubahan</span>
              <span
                className={`font-semibold ${
                  bmiTrend.summary.change && bmiTrend.summary.change > 0
                    ? 'text-red-500'
                    : bmiTrend.summary.change && bmiTrend.summary.change < 0
                      ? 'text-green-500'
                      : ''
                }`}
              >
                {bmiTrend.summary.change !== null
                  ? `${bmiTrend.summary.change > 0 ? '+' : ''}${bmiTrend.summary.change.toFixed(2)}`
                  : '-'}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Body Composition Trend */}
      {bodyComposition && bodyComposition.data.length > 0 && (
        <Card>
          <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
            <h4 className="font-semibold">Trend Komposisi Tubuh</h4>
          </div>
          <Chart
            type="line"
            series={[
              {
                name: 'Body Fat %',
                data: bodyComposition.data.map(
                  (d: BodyCompositionData) => d.body_fat_percent || 0
                ),
              },
              {
                name: 'Muscle Mass (Kg)',
                data: bodyComposition.data.map(
                  (d: BodyCompositionData) => d.muscle_mass_kg || 0
                ),
              },
              {
                name: 'Lean Body Mass (Kg)',
                data: bodyComposition.data.map(
                  (d: BodyCompositionData) => d.lean_body_mass_kg || 0
                ),
              },
            ]}
            xAxis={bodyComposition.data.map((d: BodyCompositionData) =>
              dayjs(d.date).format('DD MMM YYYY')
            )}
            height={350}
            customOptions={{
              colors: [COLOR_3, COLOR_2, COLOR_1],
              stroke: {
                curve: 'smooth',
                width: 3,
              },
              markers: {
                size: 4,
                hover: {
                  size: 6,
                },
              },
              yaxis: [
                {
                  title: {
                    text: 'Body Fat %',
                  },
                },
                {
                  opposite: true,
                  title: {
                    text: 'Mass (Kg)',
                  },
                },
              ],
              tooltip: {
                y: [
                  {
                    formatter: (val) => `${val}%`,
                  },
                  {
                    formatter: (val) => `${val} Kg`,
                  },
                  {
                    formatter: (val) => `${val} Kg`,
                  },
                ],
              },
            }}
          />
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Body Fat</span>
              <span className="font-semibold">
                {bodyComposition.summary.body_fat.change !== null
                  ? `${bodyComposition.summary.body_fat.change > 0 ? '+' : ''}${bodyComposition.summary.body_fat.change.toFixed(2)}%`
                  : '-'}
              </span>
              <span className="text-xs text-gray-400">
                {bodyComposition.summary.body_fat.first !== null &&
                  bodyComposition.summary.body_fat.last !== null &&
                  `${bodyComposition.summary.body_fat.first.toFixed(2)}% → ${bodyComposition.summary.body_fat.last.toFixed(2)}%`}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Muscle Mass</span>
              <span className="font-semibold">
                {bodyComposition.summary.muscle_mass.change !== null
                  ? `${bodyComposition.summary.muscle_mass.change > 0 ? '+' : ''}${bodyComposition.summary.muscle_mass.change.toFixed(2)} Kg`
                  : '-'}
              </span>
              <span className="text-xs text-gray-400">
                {bodyComposition.summary.muscle_mass.first !== null &&
                  bodyComposition.summary.muscle_mass.last !== null &&
                  `${bodyComposition.summary.muscle_mass.first.toFixed(2)} Kg → ${bodyComposition.summary.muscle_mass.last.toFixed(2)} Kg`}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Lean Body Mass</span>
              <span className="font-semibold">
                {bodyComposition.summary.lean_body_mass.change !== null
                  ? `${bodyComposition.summary.lean_body_mass.change > 0 ? '+' : ''}${bodyComposition.summary.lean_body_mass.change.toFixed(2)} Kg`
                  : '-'}
              </span>
              <span className="text-xs text-gray-400">
                {bodyComposition.summary.lean_body_mass.first !== null &&
                  bodyComposition.summary.lean_body_mass.last !== null &&
                  `${bodyComposition.summary.lean_body_mass.first.toFixed(2)} Kg → ${bodyComposition.summary.lean_body_mass.last.toFixed(2)} Kg`}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Body Size Trend */}
      {bodySize && bodySize.data.length > 0 && (
        <Card>
          <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
            <h4 className="font-semibold">Trend Ukuran Tubuh</h4>
          </div>
          <Chart
            type="line"
            series={[
              {
                name: 'Chest (Cm)',
                data: bodySize.data.map((d: BodySizeData) => d.chest || 0),
              },
              {
                name: 'Abdominal (Cm)',
                data: bodySize.data.map((d: BodySizeData) => d.abdominal || 0),
              },
              {
                name: 'Hip (Cm)',
                data: bodySize.data.map((d: BodySizeData) => d.hip || 0),
              },
              {
                name: 'Right Arm (Cm)',
                data: bodySize.data.map((d: BodySizeData) => d.right_arm || 0),
              },
              {
                name: 'Left Arm (Cm)',
                data: bodySize.data.map((d: BodySizeData) => d.left_arm || 0),
              },
            ]}
            xAxis={bodySize.data.map((d: BodySizeData) =>
              dayjs(d.date).format('DD MMM YYYY')
            )}
            height={350}
            customOptions={{
              colors: [COLOR_1, COLOR_3, COLOR_2, COLOR_4, COLOR_5],
              stroke: {
                curve: 'smooth',
                width: 2.5,
              },
              markers: {
                size: 3,
                hover: {
                  size: 5,
                },
              },
              yaxis: {
                title: {
                  text: 'Lingkar (Cm)',
                },
              },
              tooltip: {
                y: {
                  formatter: (val) => `${val} Cm`,
                },
              },
            }}
          />
          <div className="grid md:grid-cols-5 gap-4 mt-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Chest</span>
              <span className="font-semibold">
                {bodySize.summary.chest.change !== null
                  ? `${bodySize.summary.chest.change > 0 ? '+' : ''}${bodySize.summary.chest.change.toFixed(2)} Cm`
                  : '-'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Abdominal</span>
              <span className="font-semibold">
                {bodySize.summary.abdominal.change !== null
                  ? `${bodySize.summary.abdominal.change > 0 ? '+' : ''}${bodySize.summary.abdominal.change.toFixed(2)} Cm`
                  : '-'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Hip</span>
              <span className="font-semibold">
                {bodySize.summary.hip.change !== null
                  ? `${bodySize.summary.hip.change > 0 ? '+' : ''}${bodySize.summary.hip.change.toFixed(2)} Cm`
                  : '-'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Right Arm</span>
              <span className="font-semibold">
                {bodySize.summary.right_arm.change !== null
                  ? `${bodySize.summary.right_arm.change > 0 ? '+' : ''}${bodySize.summary.right_arm.change.toFixed(2)} Cm`
                  : '-'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Left Arm</span>
              <span className="font-semibold">
                {bodySize.summary.left_arm.change !== null
                  ? `${bodySize.summary.left_arm.change > 0 ? '+' : ''}${bodySize.summary.left_arm.change.toFixed(2)} Cm`
                  : '-'}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Result Trend */}
      {resultTrend && resultTrend.data.length > 0 && (
        <Card>
          <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
            <h4 className="font-semibold">Trend Hasil Penilaian</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Chart
                type="bar"
                series={[
                  {
                    name: 'Jumlah',
                    data: Object.values(
                      resultTrend.summary.result_counts
                    ) as number[],
                  },
                ]}
                xAxis={Object.keys(resultTrend.summary.result_counts).map(
                  (key: string) => {
                    const resultOptions: Record<string, string> = {
                      excellent: 'Sangat Baik',
                      good: 'Baik',
                      average: 'Rata-rata',
                      need_improvement: 'Perlu Perbaikan',
                      poor: 'Buruk',
                    }
                    return resultOptions[key] || key
                  }
                )}
                height={300}
                customOptions={{
                  colors: [COLOR_1],
                  plotOptions: {
                    bar: {
                      borderRadius: 4,
                      columnWidth: '50%',
                    },
                  },
                }}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Hasil Pertama</span>
                <span className="font-semibold text-lg">
                  {resultTrend.summary.first_result
                    ? resultTrend.summary.first_result === 'excellent'
                      ? 'Sangat Baik'
                      : resultTrend.summary.first_result === 'good'
                        ? 'Baik'
                        : resultTrend.summary.first_result === 'average'
                          ? 'Rata-rata'
                          : resultTrend.summary.first_result ===
                              'need_improvement'
                            ? 'Perlu Perbaikan'
                            : resultTrend.summary.first_result === 'poor'
                              ? 'Buruk'
                              : resultTrend.summary.first_result
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Hasil Terakhir</span>
                <span className="font-semibold text-lg">
                  {resultTrend.summary.last_result
                    ? resultTrend.summary.last_result === 'excellent'
                      ? 'Sangat Baik'
                      : resultTrend.summary.last_result === 'good'
                        ? 'Baik'
                        : resultTrend.summary.last_result === 'average'
                          ? 'Rata-rata'
                          : resultTrend.summary.last_result ===
                              'need_improvement'
                            ? 'Perlu Perbaikan'
                            : resultTrend.summary.last_result === 'poor'
                              ? 'Buruk'
                              : resultTrend.summary.last_result
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Total Pengukuran</span>
                <span className="font-semibold text-lg">
                  {resultTrend.summary.total_measurements}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Nutrition Progress */}
      {nutritionProgress && nutritionProgress.history.length > 0 && (
        <Card>
          <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
            <h4 className="font-semibold">Progress Target Nutrisi</h4>
          </div>
          {nutritionProgress.latest_targets && (
            <div className="grid md:grid-cols-5 gap-4 mb-6">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Target Kalori</span>
                <span className="font-semibold">
                  {nutritionProgress.latest_targets.calories
                    ? `${nutritionProgress.latest_targets.calories} Kcal`
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Target Protein</span>
                <span className="font-semibold">
                  {nutritionProgress.latest_targets.protein
                    ? `${nutritionProgress.latest_targets.protein} g`
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">
                  Target Karbohidrat
                </span>
                <span className="font-semibold">
                  {nutritionProgress.latest_targets.carbs
                    ? `${nutritionProgress.latest_targets.carbs} g`
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Target Lemak</span>
                <span className="font-semibold">
                  {nutritionProgress.latest_targets.fat
                    ? `${nutritionProgress.latest_targets.fat} g`
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Skor Kepatuhan</span>
                <span className="font-semibold">
                  {nutritionProgress.latest_targets.adherence_score
                    ? `${nutritionProgress.latest_targets.adherence_score}/10`
                    : '-'}
                </span>
              </div>
            </div>
          )}
          <Chart
            type="area"
            series={[
              {
                name: 'Kalori',
                data: nutritionProgress.history.map(
                  (d: NutritionProgressHistory) => d.calories || 0
                ),
              },
              {
                name: 'Protein (g)',
                data: nutritionProgress.history.map(
                  (d: NutritionProgressHistory) => d.protein || 0
                ),
              },
              {
                name: 'Karbohidrat (g)',
                data: nutritionProgress.history.map(
                  (d: NutritionProgressHistory) => d.carbs || 0
                ),
              },
              {
                name: 'Lemak (g)',
                data: nutritionProgress.history.map(
                  (d: NutritionProgressHistory) => d.fat || 0
                ),
              },
            ]}
            xAxis={nutritionProgress.history.map(
              (d: NutritionProgressHistory) =>
                dayjs(d.date).format('DD MMM YYYY')
            )}
            height={350}
            customOptions={{
              colors: [COLOR_1, COLOR_2, COLOR_3, COLOR_4],
              stroke: {
                curve: 'smooth',
                width: 2,
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.4,
                  opacityTo: 0.1,
                  stops: [0, 90, 100],
                },
              },
              yaxis: {
                title: {
                  text: 'Target',
                },
              },
              tooltip: {
                y: [
                  {
                    formatter: (val) => `${val} Kcal`,
                  },
                  {
                    formatter: (val) => `${val} g`,
                  },
                  {
                    formatter: (val) => `${val} g`,
                  },
                  {
                    formatter: (val) => `${val} g`,
                  },
                ],
              },
            }}
          />
        </Card>
      )}

      {/* Recommendation */}
      {recommendation && !recommendation.message && (
        <Card>
          <div className="bg-primary text-white p-3 rounded-t-lg -mx-6 -mt-6 mb-6">
            <h4 className="font-semibold">Rekomendasi & Rencana</h4>
          </div>
          <div className="flex flex-col gap-6">
            {/* Summary */}
            {recommendation.summary && (
              <div className="flex flex-col gap-2">
                <h5 className="font-semibold text-lg">Ringkasan</h5>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {recommendation.summary}
                </p>
              </div>
            )}

            {/* Body Composition Recommendation */}
            {recommendation.body_composition && (
              <div className="flex flex-col gap-2">
                <h5 className="font-semibold text-lg">Komposisi Tubuh</h5>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {recommendation.body_composition}
                </p>
              </div>
            )}

            {/* Training Recommendation */}
            {recommendation.training && (
              <div className="flex flex-col gap-2">
                <h5 className="font-semibold text-lg">Latihan</h5>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {recommendation.training}
                </p>
              </div>
            )}

            {/* Nutrition Recommendation */}
            {recommendation.nutrition && (
              <div className="flex flex-col gap-2">
                <h5 className="font-semibold text-lg">Nutrisi</h5>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {recommendation.nutrition}
                </p>
              </div>
            )}

            {/* Next 4 Weeks Plan */}
            {recommendation.next_4_weeks_plan && (
              <div className="flex flex-col gap-2">
                <h5 className="font-semibold text-lg">
                  Rencana 4 Minggu Ke Depan
                </h5>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {recommendation.next_4_weeks_plan
                      .split('\n')
                      .map((line: string, index: number) => {
                        if (
                          line.trim().startsWith('•') ||
                          line.trim().startsWith('-')
                        ) {
                          return (
                            <div
                              key={index}
                              className="flex items-start gap-2 mt-1"
                            >
                              <span className="text-primary mt-1">•</span>
                              <span>{line.trim().substring(1).trim()}</span>
                            </div>
                          )
                        }
                        if (
                          line.trim().startsWith('**') &&
                          line.trim().endsWith('**')
                        ) {
                          return (
                            <div
                              key={index}
                              className="font-semibold mt-3 mb-2"
                            >
                              {line.replace(/\*\*/g, '')}
                            </div>
                          )
                        }
                        return <div key={index}>{line}</div>
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Meta Information */}
            {recommendation.meta && (
              <div className="border-t pt-4">
                <h5 className="font-semibold text-lg mb-4">
                  Statistik Periode
                </h5>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Periode</span>
                    <span className="font-semibold">
                      {recommendation.meta.period_weeks} Minggu
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Perubahan Berat
                    </span>
                    <span
                      className={`font-semibold ${
                        recommendation.meta.weight_change > 0
                          ? 'text-red-500'
                          : recommendation.meta.weight_change < 0
                            ? 'text-green-500'
                            : ''
                      }`}
                    >
                      {recommendation.meta.weight_change > 0 ? '+' : ''}
                      {recommendation.meta.weight_change.toFixed(2)} Kg
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Perubahan Body Fat
                    </span>
                    <span
                      className={`font-semibold ${
                        recommendation.meta.body_fat_change > 0
                          ? 'text-red-500'
                          : recommendation.meta.body_fat_change < 0
                            ? 'text-green-500'
                            : ''
                      }`}
                    >
                      {recommendation.meta.body_fat_change > 0 ? '+' : ''}
                      {recommendation.meta.body_fat_change.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Berat per Minggu
                    </span>
                    <span
                      className={`font-semibold ${
                        recommendation.meta.weight_per_week > 0
                          ? 'text-red-500'
                          : recommendation.meta.weight_per_week < 0
                            ? 'text-green-500'
                            : ''
                      }`}
                    >
                      {recommendation.meta.weight_per_week > 0 ? '+' : ''}
                      {recommendation.meta.weight_per_week.toFixed(2)} Kg/minggu
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Total Workout</span>
                    <span className="font-semibold">
                      {recommendation.meta.workout_count} Sesi
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Workout per Minggu
                    </span>
                    <span className="font-semibold">
                      {recommendation.meta.workout_per_week} Sesi/minggu
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Rata-rata Adherence
                    </span>
                    <span className="font-semibold">
                      {recommendation.meta.avg_adherence}/10
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Rata-rata Kalori
                    </span>
                    <span className="font-semibold">
                      {recommendation.meta.avg_calorie} Kcal
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-semibold text-lg mb-3">
                    Status Evaluasi
                  </h5>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Progress Fat Loss:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          recommendation.meta.status.progress_fat_loss ===
                          'GOOD'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : recommendation.meta.status.progress_fat_loss ===
                                'SLOW'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : recommendation.meta.status.progress_fat_loss ===
                                  'TOO_FAST'
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                : recommendation.meta.status
                                      .progress_fat_loss === 'REVERSE'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {recommendation.meta.status.progress_fat_loss === 'GOOD'
                          ? 'Baik'
                          : recommendation.meta.status.progress_fat_loss ===
                              'SLOW'
                            ? 'Lambat'
                            : recommendation.meta.status.progress_fat_loss ===
                                'TOO_FAST'
                              ? 'Terlalu Cepat'
                              : recommendation.meta.status.progress_fat_loss ===
                                  'REVERSE'
                                ? 'Naik'
                                : 'Tidak Diketahui'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Training:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          recommendation.meta.status.training === 'HIGH'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : recommendation.meta.status.training === 'OK'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : recommendation.meta.status.training === 'LOW'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {recommendation.meta.status.training === 'HIGH'
                          ? 'Tinggi'
                          : recommendation.meta.status.training === 'OK'
                            ? 'Cukup'
                            : recommendation.meta.status.training === 'LOW'
                              ? 'Rendah'
                              : 'Tidak Ada'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Adherence:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          recommendation.meta.status.adherence === 'HIGH'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : recommendation.meta.status.adherence === 'MEDIUM'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : recommendation.meta.status.adherence === 'LOW'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {recommendation.meta.status.adherence === 'HIGH'
                          ? 'Tinggi'
                          : recommendation.meta.status.adherence === 'MEDIUM'
                            ? 'Sedang'
                            : recommendation.meta.status.adherence === 'LOW'
                              ? 'Rendah'
                              : 'Tidak Diketahui'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {(!weightTrend || weightTrend.data.length === 0) &&
        (!bodyComposition || bodyComposition.data.length === 0) &&
        (!bodySize || bodySize.data.length === 0) &&
        (!bmiTrend || bmiTrend.data.length === 0) &&
        (!resultTrend || resultTrend.data.length === 0) &&
        (!nutritionProgress || nutritionProgress.history.length === 0) &&
        (!recommendation || recommendation.message) && (
          <Card>
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 text-lg">
                Belum ada data analytics untuk ditampilkan
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Data analytics akan muncul setelah ada beberapa pengukuran
              </p>
            </div>
          </Card>
        )}
    </div>
  )
}

export default AnalyticsTab
