import { Dark } from 'quasar';
import { computed } from 'vue';

export function useDarkMode() {
  const isDark = computed(() => Dark.isActive);

  function toggle() {
    Dark.toggle();
    localStorage.setItem('darkMode', Dark.isActive ? 'true' : 'false');
  }

  function init() {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      Dark.set(saved === 'true');
    }
    // else: uses OS preference (dark: 'auto' in quasar.config)
  }

  return { isDark, toggle, init };
}
