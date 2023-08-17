---
outline: [2,3]
---

# Switch

> ...

## Demo

<script setup>
import { Switch } from 'vergil/components'
import { ref } from 'vue'
const s1 = ref(false)
const s2 = ref(false)
const s3 = ref(false)
const s4 = ref(false)
</script>

<Demo>
    <div class="col center">
        <Switch v-model="s1"/>
        <Switch v-model="s2" :toggleBg="false"/>
        <Switch v-model="s3" showLabels/>
        <Switch v-model="s4" :toggleBg="false" showLabels label-off="Monthly" label-on="Yearly"/>
    </div>
</Demo>