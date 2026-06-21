import { defineComponent, computed, h, type Component } from 'vue'
import { useRoute } from 'vue-router'
import layouts from 'virtual:virix/layouts'

export const VirixLayout = defineComponent({
  name: 'VirixLayout',
  setup(_, { slots }) {
    const route = useRoute()
    const layout = computed<Component | null>(() => {
      const name = ((route.meta.layout as string) || 'default').toLowerCase()
      return layouts[name] ?? layouts['default'] ?? null
    })
    return () => {
      const LayoutComponent = layout.value
      if (!LayoutComponent) {
        return slots.default?.() ?? null
      }
      return h(LayoutComponent, null, { default: slots.default })
    }
  }
})