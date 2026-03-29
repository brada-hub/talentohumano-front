import { Notify } from 'quasar'

export function useNotify() {
  return {
    success: (msg: string) => Notify.create({
      type: 'positive',
      message: msg,
      position: 'top-right',
      timeout: 3000,
      icon: 'check_circle',
      progress: true,
    }),
    error: (msg: string) => Notify.create({
      type: 'negative',
      message: msg,
      position: 'top-right',
      timeout: 5000,
      icon: 'error',
      progress: true,
    }),
    warning: (msg: string) => Notify.create({
      type: 'warning',
      message: msg,
      position: 'top-right',
      timeout: 4000,
      progress: true,
    }),
    info: (msg: string) => Notify.create({
      color: 'primary',
      message: msg,
      position: 'top-right',
      timeout: 3000,
      icon: 'info',
      progress: true,
    }),
  }
}
