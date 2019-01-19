<template>
    <div class="calendarWidget">
        <date-pick
            class="datePickExample"
            v-model="date"
            :hasInputElement="false"
            :markedDates="markedDates"
        ></date-pick>
    </div>
</template>

<script>
import DatePick from '../../../src/vueDatePick';
import fecha from 'fecha';

export default {
    components: {DatePick},
    data: () => ({
        date: "2019-02-12",
        markedDates: [
            "2019-02-16",
            "2019-02-21",
            "2019-02-25",
        ]
    })
};
</script>

<style lang="scss" scoped>

    .calendarWidget {

        margin-bottom: 15px;

        @media screen and (min-width: 720px) {

            padding: 30px 20px;
            background-color: #fff; border-radius: 4px;
            border: 1px solid #ededed;

        }

    }

    .vdpComponent {

        display: block; max-width: 32em; margin: 0 auto;

    }

</style>