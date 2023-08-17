---
outline: [2,3]
---

# Checkbox

> ...

## Demo

<script setup>
import { Checkbox } from 'vergil/components'
import { ref } from 'vue'
const flag = ref(false)
</script>

<Demo>
    <div class="row center">
        <Checkbox v-model="flag"/>
    </div>
</Demo>

<style scoped>
.checkbox > :deep(p){
    color: var(--vp-c-text-1);
}
</style>