import { useEffect, useState } from "react"
import "./InstallPrompt.scss"

const DISMISS_KEY = "installPromptDismissed"

export function InstallPrompt() {
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY)
    if (dismissed) return

    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(isIOSDevice)

    if (isIOSDevice) {
      setIsVisible(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setIsVisible(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true")
    setIsVisible(false)
  }

  useEffect(() => {
    document.body.classList.toggle("install-prompt-visible", isVisible)

    return () => {
      document.body.classList.remove("install-prompt-visible")
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="install-prompt">
      <div className="install-prompt__content">
        <div className="install-prompt__info">
          <img
            src="/pwa-192x192.png"
            alt="Pitch Perfect"
            className="install-prompt__icon"
          />
          <div className="install-prompt__text">
            <p className="install-prompt__title">Pitch Perfect</p>
            {isIOS ? (
              <p className="install-prompt__subtitle">
                Tap Share and select "Add to Home Screen"
              </p>
            ) : (
              <p className="install-prompt__subtitle">
                Install for a better experience
              </p>
            )}
          </div>
        </div>
        <div className="install-prompt__actions">
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="install-prompt__install-btn"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="install-prompt__dismiss-btn"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
