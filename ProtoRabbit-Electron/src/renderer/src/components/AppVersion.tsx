import { useMemo } from 'react'

export const AppVersion = () => {
  const appVersion = useMemo(() => {
    return window.MYAPI.version()
  }, [])
  return <span>{`v${appVersion}`}</span>
}
