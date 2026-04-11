import { reactive } from 'vue'

type ContinueHandler = () => void | Promise<void>
type LogoutHandler = () => void | Promise<void>

export const sessionTimeoutState = reactive({
  warningVisible: false,
  countdownSeconds: 60,
})

let continueHandler: ContinueHandler | null = null
let logoutHandler: LogoutHandler | null = null

export const sessionTimeoutManager = {
  configure(options: { onContinue: ContinueHandler; onLogout: LogoutHandler }) {
    continueHandler = options.onContinue
    logoutHandler = options.onLogout
  },

  showWarning(countdownSeconds: number) {
    sessionTimeoutState.countdownSeconds = countdownSeconds
    sessionTimeoutState.warningVisible = true
  },

  updateCountdown(countdownSeconds: number) {
    sessionTimeoutState.countdownSeconds = countdownSeconds
  },

  hideWarning() {
    sessionTimeoutState.warningVisible = false
  },

  async continueSession() {
    if (continueHandler) {
      await continueHandler()
    }
  },

  async logoutNow() {
    if (logoutHandler) {
      await logoutHandler()
    }
  },
}
