---
outline: [2,3]
---

# Pop-up

> ...

## Demo

<script setup>
import DemoPopUp from '@/DemoPopUp.vue'
import { showPopUp } from 'vergil'

const demoPopUp = () => {
    showPopUp(DemoPopUp)
}
</script>

<Demo>
    <div class="row center">
        <button class="vp-btn" @click="demoPopUp">Show Pop-up</button>
    </div>
</Demo>