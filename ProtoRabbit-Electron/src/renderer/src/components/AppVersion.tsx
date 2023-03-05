import { useMemo } from 'react'

export const AppVersion = () => {
  const appVersion = useMemo(() => {
    return window.ProtoRabbit.version()
  }, [])
  return <span>{`v${appVersion}`}</span>
}
