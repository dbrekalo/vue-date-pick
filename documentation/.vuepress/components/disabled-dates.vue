<template>
    <date-pick
        class="datePickExample"
        v-model="date"
        :isDateDisabled="isFutureDate"
    ></date-pick>
</template>

<script>
import DatePick from '../../../src/vueDatePick';
export default {
    components: {DatePick},
    data: () => ({
        date: ''
    }),
    methods: {
        isFutureDate(date) {
            const currentDate = new Date();
            return date > currentDate;
        }
    }
};
</script>