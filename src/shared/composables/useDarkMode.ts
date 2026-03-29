import { Dark } from 'quasar';
import { computed } from 'vue';

// Light mode is permanently forced per design decision.
// Dark mode toggle has been removed from the application.
export function useDarkMode() {
  // Always false - we only use the white theme
  const isDark = computed(() => false);

  function toggle() {
    // No-op: dark mode permanently disabled
  }

  function init() {
    // Force Quasar into light mode, overriding any OS setting or stored preference
    Dark.set(false);
    localStorage.removeItem('darkMode');
  }

  return { isDark, toggle, init };
}
