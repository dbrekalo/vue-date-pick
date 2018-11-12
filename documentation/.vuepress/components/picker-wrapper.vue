<template>
    <date-pick
        class="datePickExample"
        v-model="date"
        v-bind="pickerProps"
    ></date-pick>
</template>

<script>
import DatePick from '../../../src/vueDatePick';
export default {
    components: {DatePick},
    props: {
        value: String,
        pickerProps: Object
    },
    data() {
        return {
            date: this.value || DatePick.methods.formatDateToString(
                new Date(), 'YYYY-MM-DD'
            )
        }
    }
};
</script>