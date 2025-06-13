import Logo from '@/components/template/Logo'
import { Dialog, Progress } from '@/components/ui'
import CloseButton from '@/components/ui/CloseButton'
import { useThemeStore } from '@/store/themeStore'
import React, { useEffect, useState } from 'react'
import { SparklesText } from './SparklesText'
import { HiCheckCircle } from 'react-icons/hi'

const WelcomeUser = () => {
  const { welcome, setWelcome } = useThemeStore()
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
    <Dialog
      isOpen={welcome}
      closable={false}
      contentClassName="!p-0 relative"
      onRequestClose={() => {
        isCompleted && setWelcome(false)
      }}
    >
      <div
        className="h-20 md:h-24 w-full rounded-tl-2xl rounded-tr-2xl relative bg-cover bg-center overflow-hidden border-none"
        style={{
          backgroundImage: `url('/img/others/pt-program.jpg')`,
          backgroundPositionY: '30%',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-65 z-0"></div>
        <div className="pt-4">
          {isCompleted && (
            <CloseButton
              absolute
              className="ltr:right-3 rtl:left-3 top-4.5"
              onClick={() => setWelcome(false)}
            />
          )}
          <div className="px-2 py-1 relative flex items-center gap-1">
            <Logo
              type="streamline"
              mode="dark"
              imgClass="mx-auto relative"
              className="!w-[30px] sm:!w-[45px]"
              logoWidth={0}
            />
            <div className="flex flex-col">
              <span className="text-white text-base sm:text-2xl font-bold">
                Selamat datang di Migios!
              </span>
              <span className="text-sm sm:text-base text-white">
                Solusi Manajemen Gym Terlengkap! 💪🏋️‍♂️
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <SparklesText
          text="Tunggu sebentar, kami sedang menyiapkan semuanya...."
          className="text-2xl lg:text-3xl"
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
      </div>
    </Dialog>
  )
}

export default WelcomeUser
