import fs from 'fs'
import path from 'path'

interface BuildMetadata {
  [key: string]: string
}

const formatTwoDigits = (num: number): string => {
  return ('0' + num).slice(-2)
}

const generateBuildVersion = (): void => {
  console.log('Generating build number... ' + process.env.ENV_CONFIG)

  const route_path = 'public/assets/buildVersion.json'
  const dir_path = path.dirname(route_path)

  // Buat folder jika belum ada
  if (!fs.existsSync(dir_path)) {
    fs.mkdirSync(dir_path, { recursive: true })
  }

  // Buat file default jika belum ada
  if (!fs.existsSync(route_path)) {
    const defaultMetadata: BuildMetadata = {
      development: '',
      staging: '',
      production: '',
    }
    fs.writeFileSync(route_path, JSON.stringify(defaultMetadata, null, 2))
  }

  fs.readFile(
    route_path,
    'utf8',
    (err: NodeJS.ErrnoException | null, content: string) => {
      if (err) throw err

      const metadata: BuildMetadata = JSON.parse(content)
      const dateObj: Date = new Date()

      const year: number = dateObj.getFullYear()
      const month: string = formatTwoDigits(dateObj.getMonth() + 1)
      const date: string = formatTwoDigits(dateObj.getDate())
      const hour: string = formatTwoDigits(dateObj.getHours())
      const minute: string = formatTwoDigits(dateObj.getMinutes())
      const second: string = formatTwoDigits(dateObj.getSeconds())

      const time: string = `${year}/${month}/${date} ${hour}:${minute}:${second}`
      const envConfig: string = process.env.ENV_CONFIG || 'development'

      metadata[envConfig] = `${envConfig}.${time}`

      fs.writeFile(
        route_path,
        JSON.stringify(metadata, null, 2),
        (err: NodeJS.ErrnoException | null) => {
          if (err) throw err
          console.log(`Current build number: ${metadata[envConfig]}`)
        }
      )
    }
  )
}

generateBuildVersion()
