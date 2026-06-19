import { useCallback, useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import packageJson from '../../../../package.json'
import './UpdatePrompt.scss'

const CURRENT_VERSION = packageJson.version
const VERSION_URL = '/app-version.json'
const VERSION_CHECK_INTERVAL_MS = 5 * 60 * 1000
const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000

let updateCheckTimer

const isOnline = () => !('onLine' in navigator) || navigator.onLine
const normalizeVersion = (version) => `${version || ''}`.trim().replace(/^v/i, '')

const hasDifferentVersion = (deployedVersion) => (
  normalizeVersion(deployedVersion) &&
  normalizeVersion(deployedVersion) !== normalizeVersion(CURRENT_VERSION)
)

const scheduleUpdateChecks = (swScriptUrl, registration) => {
  if (!registration || updateCheckTimer) return

  updateCheckTimer = window.setInterval(async () => {
    if (!isOnline()) return

    try {
      const response = await fetch(swScriptUrl, { cache: 'no-store' })
      if (response.ok) {
        await registration.update()
      }
    } catch (error) {
      console.warn('Service worker update check failed:', error)
    }
  }, UPDATE_CHECK_INTERVAL_MS)
}

export const UpdatePrompt = () => {
  const [deployedVersion, setDeployedVersion] = useState(null)
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState(null)
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swScriptUrl, registration) {
      setServiceWorkerRegistration(registration || null)
      scheduleUpdateChecks(swScriptUrl, registration)
    },
    onRegisterError(error) {
      console.error('Service worker registration failed:', error)
    },
  })

  const checkDeployedVersion = useCallback(async () => {
    if (!isOnline()) return

    try {
      const response = await fetch(`${VERSION_URL}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) return

      const nextVersionInfo = await response.json()
      setDeployedVersion(nextVersionInfo?.mobile || nextVersionInfo?.version || null)
    } catch (error) {
      console.warn('Version check failed:', error)
    }
  }, [])

  useEffect(() => {
    checkDeployedVersion()
    const versionCheckTimer = window.setInterval(
      checkDeployedVersion,
      VERSION_CHECK_INTERVAL_MS
    )

    return () => window.clearInterval(versionCheckTimer)
  }, [checkDeployedVersion])

  const versionMismatch = hasDifferentVersion(deployedVersion)
  const isVisible = needRefresh || versionMismatch

  const handleUpdate = async () => {
    if (needRefresh) {
      await updateServiceWorker(true)
      return
    }

    const registration =
      serviceWorkerRegistration || await navigator.serviceWorker?.getRegistration()

    await registration?.update()

    if (registration?.waiting) {
      await updateServiceWorker(true)
      return
    }

    window.location.reload()
  }

  if (!isVisible) return null

  const label = versionMismatch
    ? `Version ${deployedVersion} is available`
    : 'New version available'

  return (
    <div
      className="update-prompt"
      role="status"
      aria-live="polite"
      title={`Current version ${CURRENT_VERSION}; deployed version ${deployedVersion}`}
    >
      <span className="update-prompt__label">{label}</span>
      <button
        type="button"
        className="update-prompt__button"
        onClick={handleUpdate}
      >
        Update
      </button>
    </div>
  )
}
