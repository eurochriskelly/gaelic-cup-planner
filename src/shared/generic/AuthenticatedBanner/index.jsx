import './AuthenticatedBanner.scss'

const AuthenticatedBanner = ({
  kicker,
  title,
  meta,
  onBack,
  onNext,
  onExit,
  onUserClick,
  userName,
  className = '',
  hideBody = false,
}) => {
  const classes = [
    'AuthenticatedBanner',
    onUserClick ? 'AuthenticatedBanner--with-user' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <header className={classes}>
      <div className="AuthenticatedBanner__mast">
        <img
          src="/brand/icons/64x64-t.png"
          alt="Pitch Perfect"
          className="AuthenticatedBanner__logo"
        />
        <p className="AuthenticatedBanner__kicker">{kicker}</p>
        <div className="AuthenticatedBanner__actions">
          {onBack && (
            <button
              type="button"
              className="AuthenticatedBanner__action"
              onClick={onBack}
              aria-label="Go back"
            >
              <i className="pi pi-times" aria-hidden="true" />
            </button>
          )}
          {onExit && (
            <button
              type="button"
              className="AuthenticatedBanner__action"
              onClick={onExit}
              aria-label="Leave tournament"
            >
              <i className="pi pi-sign-out" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      {!hideBody && (
        <div className="AuthenticatedBanner__body">
          <div className="AuthenticatedBanner__copy">
            <h1 className="AuthenticatedBanner__title">{title}</h1>
            {meta && <p className="AuthenticatedBanner__meta">{meta}</p>}
          </div>
          {onUserClick ? (
            <button
              type="button"
              className="AuthenticatedBanner__user"
              onClick={onUserClick}
              aria-label="Change user"
            >
              <i className="pi pi-users" aria-hidden="true" />
              <span>{userName || 'Set name'}</span>
              <i className="pi pi-pencil" aria-hidden="true" />
            </button>
          ) : onNext ? (
            <button
              type="button"
              className="AuthenticatedBanner__chevrons AuthenticatedBanner__chevrons--button"
              onClick={onNext}
              aria-label="Show next competition"
            >
              <span />
              <span />
            </button>
          ) : (
            <div className="AuthenticatedBanner__chevrons" aria-hidden="true">
              <span />
              <span />
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default AuthenticatedBanner
