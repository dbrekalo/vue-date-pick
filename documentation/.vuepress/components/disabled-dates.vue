<template>
    <date-pick
        class="datePickExample"
        v-model="date"
        :isDateDisabled="isFutureDate"
        :selectableYearRange="2"
        :selectablePastYears="false"
        :individualDatesDisabled="['2019-4-10', '2019-4-11']"
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