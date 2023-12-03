---
outline: [2,3]
---

# Radio Button

> ...

<script setup>
import { Radio } from 'vergil/components'
import { ref } from 'vue'
import { InputField } from 'vergil'
const selected = ref('scorpion')
const radio = new InputField('')
</script>

## Demo

<Demo>
    <div class="col">
        <div class="row center">
            <Radio v-model="selected" name="vehicles" value="warthog" label="Warthog"/>
            <Radio v-model="selected" name="vehicles" value="scorpion" label="Scorpion"/>
            <Radio v-model="selected" name="vehicles" value="hornet" label="Hornet"/>
        </div>
        <div class="row center">
            <code>selected == {{ selected }}</code>
        </div>
        <br><br>
        <div class="row center">
            <Radio v-model="radio" name="armor" value="mark-iv" label="Mark IV"/>
            <Radio v-model="radio" name="armor" value="mark-v" label="Mark V"/>
            <Radio v-model="radio" name="armor" value="mark-vi" label="Mark VI"/>
        </div>
        <div class="row center">
            <code>selected == {{ radio.value }}</code>
        </div>
    </div>
</Demo>

### Disabled

<Demo>
    <div class="row center">
        <Radio disabled value="" v-model="selected"/>
        <Radio disabled/>
    </div>
</Demo>

<style scoped>
.radio > :deep(p){
    color: var(--vp-c-text-1);
}
</style>