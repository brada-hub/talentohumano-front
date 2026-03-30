import { Directive, DirectiveBinding } from 'vue'
import { useAuthStore } from 'src/modules/auth/stores/useAuthStore'

/**
 * v-can Directive
 * 
 * Usage:
 * - v-can="'personal.ver'"         → Show if user has permission
 * - v-can:any="['personal.ver', 'personal.crear']"  → Show if user has ANY of the permissions
 * - v-can:all="['personal.ver', 'personal.crear']"  → Show if user has ALL of the permissions
 * - v-can:role="'Administrador'"   → Show if user has role
 */
export const canDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const authStore = useAuthStore()
    const { value, arg } = binding

    let hasAccess = false

    if (arg === 'role') {
      // Check role
      hasAccess = authStore.hasRole(value)
    } else if (arg === 'any' && Array.isArray(value)) {
      // Check if user has ANY of the permissions
      hasAccess = value.some((perm: string) => authStore.can(perm))
    } else if (arg === 'all' && Array.isArray(value)) {
      // Check if user has ALL of the permissions
      hasAccess = value.every((perm: string) => authStore.can(perm))
    } else if (typeof value === 'string') {
      // Check single permission
      hasAccess = authStore.can(value)
    }

    if (!hasAccess) {
      el.style.display = 'none'
      // Alternative: el.remove() to completely remove from DOM
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const authStore = useAuthStore()
    const { value, arg } = binding

    let hasAccess = false

    if (arg === 'role') {
      hasAccess = authStore.hasRole(value)
    } else if (arg === 'any' && Array.isArray(value)) {
      hasAccess = value.some((perm: string) => authStore.can(perm))
    } else if (arg === 'all' && Array.isArray(value)) {
      hasAccess = value.every((perm: string) => authStore.can(perm))
    } else if (typeof value === 'string') {
      hasAccess = authStore.can(value)
    }

    el.style.display = hasAccess ? '' : 'none'
  }
}

/**
 * v-role Directive
 * 
 * Shorthand for v-can:role
 * Usage: v-role="'Administrador'"
 */
export const roleDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const authStore = useAuthStore()
    const hasRole = authStore.hasRole(binding.value)

    if (!hasRole) {
      el.style.display = 'none'
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const authStore = useAuthStore()
    const hasRole = authStore.hasRole(binding.value)
    el.style.display = hasRole ? '' : 'none'
  }
}

// Export all directives
export const directives = {
  can: canDirective,
  role: roleDirective
}

export default canDirective
