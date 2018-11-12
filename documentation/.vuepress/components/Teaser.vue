<template>
    <div>
        <div class="teaser">
            <div class="topBlock">
                <div class="textTeaser">
                    <h2 class="title">Lightweight and mobile friendly date time picker</h2>
                    <p class="text">
                        Vue date pick emphasizes performance, elegant and usable UI
                        on all screen sizes and simplicity of configuration.
                        Has no dependencies on css frameworks or date libraries.
                        Weighs less then 5KB.
                    </p>
                    <router-link class="ctaBtn" :to="'/getting-started.html'">Get started</router-link>
                </div>
                <date-time-picker
                    v-model="date"
                    :hasInputElement="false"
                ></date-time-picker>
            </div>
        </div>
    </div>
</template>

<script>
import DateTimePicker from '../../../src/vueDatePick';

export default {

    components: {DateTimePicker},

    data: () => ({
        date: DateTimePicker.methods.formatDateToString(
            new Date(), 'YYYY-MM-DD'
        )
    })

};
</script>

<style lang="scss" scoped>

    .teaser {

        background: #f5f5f5;
        // border-bottom: 1px solid #e8e8e8;

        @media screen and (min-width: 720px) {

            min-height: 100vh;
            display: flex; justify-content: center; align-items: center;
            background: #f5f5f5 url('/vue-date-pick/calendarWhite.svg') no-repeat right 50px;
            background-size: 1050px;

        }
    }

    .topBlock {

        position: relative; padding: 25px;

        @media screen and (min-width: 720px) {

            display: table;
            padding: 170px 40px; max-width: 1100px; margin: 0 auto;

        }

    }

    .textTeaser {

        max-width: 600px; padding-bottom: 25px;

        > .title {

            font-size: 32px; margin: 0; position: relative;
            padding: 0 0 20px 0;
            letter-spacing: -0.02em; font-weight: bold;
            border: 0;

        }

        > .text {

            color: #585858; margin: 0;

        }

        @media screen and (min-width: 720px) {

            display: table-cell; padding-right: 35px; padding-top: 35px;
            vertical-align: middle;

            > .title {

                font-size: 45px;

            }

        }

    }

    .ctaBtn {

        display: inline-block; padding: 12px 20px;
        margin-top: 23px;
        border-radius: 25px; letter-spacing: -0.3px;
        background: #7485c2; color: #fff;
        transition: background-color 0.3s;

        &:hover {
            background-color: darken(#7485c2, 5%);
        }

    }

    .vdpComponent {

        @media screen and (min-width: 720px) {

            width: 320px; display: table-cell;
            font-size: 0.77em;

        }

    }

</style>
