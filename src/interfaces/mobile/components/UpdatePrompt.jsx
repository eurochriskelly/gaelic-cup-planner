import { useRegisterSW } from 'virtual:pwa-register/react'
import './UpdatePrompt.scss'

const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000

let updateCheckTimer

const isOnline = () => !('onLine' in navigator) || navigator.onLine

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
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swScriptUrl, registration) {
      scheduleUpdateChecks(swScriptUrl, registration)
    },
    onRegisterError(error) {
      console.error('Service worker registration failed:', error)
    },
  })

  if (!needRefresh) return null

  return (
    <div className="update-prompt" role="status" aria-live="polite">
      <span className="update-prompt__label">New version available</span>
      <button
        type="button"
        className="update-prompt__button"
        onClick={() => updateServiceWorker(true)}
      >
        Update
      </button>
    </div>
  )
}
