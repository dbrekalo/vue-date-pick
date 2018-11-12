# Getting started
Install via node package manager:
```bash
npm install vue-date-pick
```
Integrate into your application via standard Vue api for registering and using components.
Vue date pick is designed for usage with v-model directive.
```vue
<template>
    <date-pick v-model="date"></date-pick>
</template>

<script>
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';

export default {
    components: {DatePick},
    data: () => ({
        date: '2019-01-01'
    })
};
</script>
```