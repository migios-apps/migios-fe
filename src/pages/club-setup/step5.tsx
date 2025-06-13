import { SparklesText } from '@/components/template/MagicUI/SparklesText'
import { Button, Progress } from '@/components/ui'
import { Home3 } from 'iconsax-react'
import { useEffect, useState } from 'react'
import { HiCheckCircle } from 'react-icons/hi'

const Step5 = () => {
  const settingup = [
    'Menyiapkan Akun Migios Anda',
    'Menyiapkan klub gym Anda',
    'Personalisasi dasbor Anda',
    'Menyiapkan rekomendasi.',
  ]

  // State untuk menyimpan progres setiap langkah
  const [progressList, setProgressList] = useState<number[]>(
    new Array(settingup.length).fill(0)
  )
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (currentStep < settingup.length) {
      const interval = setInterval(() => {
        setProgressList((prev) => {
          const newProgress = [...prev]
          if (newProgress[currentStep] < 100) {
            newProgress[currentStep] += Math.floor(Math.random() * 20) + 10 // Progress naik acak (10-30)
          }
          return newProgress
        })
      }, 600) // Setiap 500ms progress bertambah

      if (progressList[currentStep] >= 100) {
        clearInterval(interval)
        setTimeout(() => setCurrentStep((prev) => prev + 1), 500) // Jeda sebelum lanjut ke step berikutnya
      }

      return () => clearInterval(interval)
    } else {
      setIsCompleted(true) // Semua langkah selesai
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressList, currentStep])
  return (
    <div className="flex flex-col w-full">
      <div className="relative max-w-[35rem] mx-auto px-8 bg-white dark:bg-gray-800">
        <SparklesText
          text="Tunggu sebentar, kami sedang menyiapkan semuanya...."
          className="text-2xl lg:text-5xl"
        />
        <div className="flex flex-col gap-3 mt-4">
          {settingup.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-lg flex">{item}</span>
                {progressList[index] > 100 && (
                  <HiCheckCircle className="text-emerald-500 text-xl" />
                )}
              </div>
              {progressList[index] < 100 && (
                <Progress
                  customColorClass="bg-primary"
                  percent={
                    progressList[index] > 100 ? 100 : progressList[index]
                  }
                />
              )}
            </div>
          ))}
        </div>
        {isCompleted && (
          <div className="flex justify-end items-center w-full">
            <Button
              type="submit"
              variant="default"
              size="md"
              className="mt-4 border-primary text-primary"
              icon={<Home3 color="currentColor" size="32" variant="Bulk" />}
              iconAlignment="end"
            >
              Masuk ke dashboard
            </Button>
          </div>
        )}
      </div>
      {/* <RetroGrid /> */}
    </div>
  )
}

export default Step5
