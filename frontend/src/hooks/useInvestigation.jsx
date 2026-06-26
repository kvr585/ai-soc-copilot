import { useEffect, useMemo, useState } from 'react'
import { investigateAlert } from '../services/api.js'

export const DEFAULT_INVESTIGATION_PAYLOAD = {
  alert: 'User Rahul logged in from Russia from IP 185.201.10.22',
  log: 'Failed Login\nFailed Login\nVPN Connected\nPowerShell executed'
}

export function useInvestigation() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendStatus, setBackendStatus] = useState('unknown')

  const fetchInvestigation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await investigateAlert(DEFAULT_INVESTIGATION_PAYLOAD)
      setData(response)
      setBackendStatus('online')
    } catch (err) {
      setBackendStatus('offline')
      setError(err.message || 'Unable to reach backend')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInvestigation()
  }, [])

  const status = useMemo(
    () => ({
      online: backendStatus === 'online',
      message: backendStatus === 'online' ? 'Online' : 'Offline'
    }),
    [backendStatus]
  )

  return {
    data,
    isLoading,
    error,
    refetch: fetchInvestigation,
    backendStatus: status
  }
}
