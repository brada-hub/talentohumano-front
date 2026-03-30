import { defineBoot } from '#q-app/wrappers'
import { canDirective, roleDirective } from 'src/shared/directives/can'

export default defineBoot(({ app }) => {
  // Register v-can directive
  app.directive('can', canDirective)
  
  // Register v-role directive
  app.directive('role', roleDirective)
})
