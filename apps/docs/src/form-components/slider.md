---
outline: [2,3]
---

# Slider

> ...

## Demo

<script setup>
import { Slider } from 'vergil/components'
import { ref } from 'vue'
const v = ref(20)
</script>

<Demo>
    <div class="row center">
        <Slider v-model="v"/>
    </div>
</Demo>

<style scoped>
    .slider :deep(.sliderWrapper){
        width: 200px;
    }
</style>