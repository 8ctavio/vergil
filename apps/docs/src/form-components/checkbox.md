---
outline: [2,3]
---

# Checkbox

> ...

<script setup>
import { Checkbox } from 'vergil/components'
import { ref } from 'vue'
const flag = ref(false)
const planets = ref(["Harvest"])
const ships = ref({
    PillarOfAutumn: true,
    InAmberClad: false,
    ForwardUntoDawn: false
})
const flagDisabled = ref(true)
</script>

## Demo

<Demo>
    <div class="col">
        <div class="row center">
            <Checkbox v-model="flag"/>
        </div>
        <div class="row center">
            <code>checked == {{ flag }}</code>
        </div>
        <br>
        <div class="row">
            <Checkbox v-model="planets" value="Earth" label="Earth"/>
            <Checkbox v-model="planets" value="Reach" label="Reach"/>
            <Checkbox v-model="planets" value="Harvest" label="Harvest"/>
        </div>
        <div class="row center">
            <code>{{ planets }}</code>
        </div>
        <br>
        <div class="row">
            <Checkbox v-model="ships" value="PillarOfAutumn" label="Pillar of Autumn"/>
            <Checkbox v-model="ships" value="InAmberClad" label="In Amber Clad"/>
            <Checkbox v-model="ships" value="ForwardUntoDawn" label="Forward Unto Dawn"/>
        </div>
        <div class="row center">
            <code><pre>{{ ships }}</pre></code>
        </div>
    </div>
</Demo>

### Disabled

<Demo>
    <div class="row center">
        <Checkbox disabled/>
        <Checkbox disabled v-model="flagDisabled"/>
    </div>
</Demo>

<style scoped>
.checkbox > :deep(p){
    color: var(--vp-c-text-1);
}
</style>