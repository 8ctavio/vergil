---
outline: [2,3]
---

# Switch

> ...

## Demo

<script setup>
import { Switch } from 'vergil/components'
</script>

<Demo>
    <div class="col center">
        <Switch/>
        <Switch :toggleBg="false"/>
        <Switch showLabels/>
        <Switch :toggleBg="false" showLabels label-off="Monthly" label-on="Yearly"/>
    </div>
</Demo>