/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { SetFieldValue } from 'react-hook-form'

interface FormPersistOptions {
  storage?: Storage
  exclude?: string[]
  include?: string | string[]
  validate?: boolean
  dirty?: boolean
  timeout?: number | null
  restore?: (data: any) => void
  watch: (names?: string | string[]) => Record<string, any>
  setValue: SetFieldValue<any>
  onTimeout?: () => void
  defaultValue?: Record<string, any>
}

const useFormPersist = (
  name: string,
  {
    storage,
    exclude = [],
    include,
    validate = false,
    dirty = false,
    timeout = null,
    restore,
    watch,
    setValue,
    onTimeout,
    defaultValue,
  }: FormPersistOptions
) => {
  const values = watch(include)
  const getStorage = (): Storage => storage || window.sessionStorage
  const clearStorage = (): void => {
    getStorage().removeItem(name)
  }

  useEffect(() => {
    const str = getStorage().getItem(name)
    if (!str && defaultValue) {
      if (restore) {
        restore(defaultValue)
      }
      getStorage().setItem(
        name,
        JSON.stringify({ ...defaultValue, _timestamp: Date.now() })
      )
      return
    }

    if (str) {
      const { _timestamp = null, ...values } = JSON.parse(str) as {
        _timestamp?: number
        [key: string]: any
      }
      const dataRestored: Record<string, any> = {}
      const currTimestamp = Date.now()

      if (timeout && currTimestamp - _timestamp! > timeout) {
        onTimeout?.()
        clearStorage()
        return
      }

      Object.keys(values).forEach((key) => {
        const shouldSet = !exclude.includes(key)
        if (shouldSet) {
          dataRestored[key] = values[key]
          setValue(key, values[key], {
            shouldValidate: validate,
            shouldDirty: dirty,
          })
        }
      })

      if (restore) {
        restore(dataRestored)
      }
    }
  }, [name])

  useEffect(() => {
    if (Object.entries(values).length) {
      const _timestamp = Date.now()
      getStorage().setItem(name, JSON.stringify({ ...values, _timestamp }))
    }
  }, [values])

  return {
    clear: (): void => getStorage().removeItem(name),
  }
}

export default useFormPersist
