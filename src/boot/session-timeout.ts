import { defineBoot } from '#q-app/wrappers'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/modules/auth/stores/useAuthStore'
import { sessionTimeoutManager } from 'src/shared/session/sessionTimeoutManager'

const LAST_ACTIVITY_KEY = 'sigeth_last_activity'
const LOGOUT_BROADCAST_KEY = 'sigeth_logout_broadcast'
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000
const WARNING_MS = 14 * 60 * 1000
const WARNING_COUNTDOWN_SECONDS = Math.floor((INACTIVITY_LIMIT_MS - WARNING_MS) / 1000)
const ACTIVITY_EVENTS = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart']

export default defineBoot(({ router }) => {
  if (typeof window === 'undefined') {
    return
  }

  const authStore = useAuthStore()
  let warningShown = false
  let logoutInProgress = false

  const isPublicRoute = () => {
    const path = router.currentRoute.value.path || ''
    return path === '/login' || path.startsWith('/portal')
  }

  const touchActivity = () => {
    if (!authStore.isAuthenticated || isPublicRoute()) {
      return
    }

    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
    warningShown = false
    sessionTimeoutManager.hideWarning()
  }

  const forceLogout = async (message: string, broadcast = true) => {
    if (logoutInProgress) {
      return
    }

    logoutInProgress = true

    if (broadcast) {
      localStorage.setItem(LOGOUT_BROADCAST_KEY, String(Date.now()))
    }

    try {
      await authStore.logout()
    } catch (error) {
      console.error('Error during automatic logout', error)
    } finally {
      Notify.create({
        type: 'warning',
        message,
        position: 'top-right',
      })

      sessionTimeoutManager.hideWarning()

      if (router.currentRoute.value.path !== '/login') {
        void router.replace('/login')
      }

      logoutInProgress = false
    }
  }

  const checkInactivity = async () => {
    if (!authStore.isAuthenticated || isPublicRoute()) {
      return
    }

    const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || Date.now())
    const elapsed = Date.now() - lastActivity

    if (elapsed >= INACTIVITY_LIMIT_MS) {
      await forceLogout('La sesión se cerró por 15 minutos de inactividad.')
      return
    }

    if (elapsed >= WARNING_MS && !warningShown) {
      warningShown = true
      const countdownSeconds = Math.max(
        1,
        Math.ceil((INACTIVITY_LIMIT_MS - elapsed) / 1000)
      )
      sessionTimeoutManager.showWarning(countdownSeconds)
    }

    if (warningShown) {
      const countdownSeconds = Math.max(
        1,
        Math.ceil((INACTIVITY_LIMIT_MS - elapsed) / 1000)
      )
      sessionTimeoutManager.updateCountdown(countdownSeconds)
    }
  }

  sessionTimeoutManager.configure({
    onContinue: async () => {
      touchActivity()
      Notify.create({
        type: 'positive',
        message: 'La sesión continúa activa.',
        position: 'top-right',
      })
    },
    onLogout: async () => {
      await forceLogout('La sesión fue cerrada por seguridad.')
    },
  })

  for (const eventName of ACTIVITY_EVENTS) {
    window.addEventListener(eventName, touchActivity, { passive: true })
  }

  window.addEventListener('storage', (event) => {
    if (event.key === LOGOUT_BROADCAST_KEY && authStore.isAuthenticated) {
      void forceLogout('La sesión se cerró desde otra pestaña.', false)
      return
    }

    if (event.key === LAST_ACTIVITY_KEY) {
      warningShown = false
    }
  })

  router.afterEach(() => {
    if (authStore.isAuthenticated && !isPublicRoute() && !localStorage.getItem(LAST_ACTIVITY_KEY)) {
      touchActivity()
    }
  })

  if (authStore.isAuthenticated && !isPublicRoute()) {
    touchActivity()
  }

  setInterval(() => {
    void checkInactivity()
  }, 30000)
})
