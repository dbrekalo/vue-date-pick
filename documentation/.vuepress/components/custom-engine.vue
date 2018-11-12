<template>
    <date-pick
        class="datePickExample"
        v-model="date"
        :format="format"
        :parseDate="parseDate"
        :formatDate="formatDate"
        :inputAttributes="{size: 32}"
    ></date-pick>
</template>

<script>
import DatePick from '../../../src/vueDatePick';
import fecha from 'fecha';

export default {
    components: {DatePick},
    data: () => ({
        format: 'dddd MMMM Do, YYYY',
        date: fecha.format(new Date(), 'dddd MMMM Do, YYYY')
    }),
    methods: {
        parseDate(dateString, format) {
            return fecha.parse(dateString, format);
        },
        formatDate(dateObj, format) {
            return fecha.format(dateObj, format);
        }
    }
};
</script>