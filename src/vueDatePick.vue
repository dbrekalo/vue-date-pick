<template>
    <div class="vdpComponent" :class="{vdpWithInput: hasInputElement}">
        <slot
            :open="open"
            :close="close"
            :toggle="toggle"
            :inputValue="inputValue"
            :processUserInput="processUserInput"
            :valueToInputFormat="valueToInputFormat"
        >
            <input
                v-if="hasInputElement"
                type="text"
                v-bind="inputAttributes"
                :readonly="isReadOnly"
                :value="inputValue"
                @input="editable && processUserInput($event.target.value)"
                @focus="editable && open()"
                @click="editable && open()"
            >
            <button
                v-if="editable && hasInputElement && inputValue"
                class="vdpClearInput"
                type="button"
                @click="clear"
            ></button>
        </slot>
        <transition name="vdp-toggle-calendar">
            <div
                v-if="opened"
                class="vdpOuterWrap"
                ref="outerWrap"
                @click="closeViaOverlay"
                :class="[positionClass, {vdpFloating: hasInputElement}]"
            >
                <div class="vdpInnerWrap">
                    <header class="vdpHeader">
                        <button
                            class="vdpArrow vdpArrowPrev"
                            :title="prevMonthCaption"
                            type="button"
                            @click="incrementMonth(-1)"
                        >{{ prevMonthCaption }}</button>
                        <button
                            class="vdpArrow vdpArrowNext"
                            type="button"
                            :title="nextMonthCaption"
                            @click="incrementMonth(1)"
                        >{{ nextMonthCaption }}</button>
                        <div class="vdpPeriodControls">
                            <div class="vdpPeriodControl">
                                <button :class="directionClass" :key="currentPeriod.month" type="button">
                                    {{ months[currentPeriod.month] }}
                                </button>
                                <select v-model="currentPeriod.month">
                                    <option v-for="(month, index) in months" :value="index" :key="month">
                                        {{ month }}
                                    </option>
                                </select>
                            </div>
                            <div class="vdpPeriodControl">
                                <button :class="directionClass" :key="currentPeriod.year" type="button">
                                    {{ currentPeriod.year }}
                                </button>
                                <select v-model="currentPeriod.year">
                                    <option v-for="year in yearRange" :value="year" :key="year">
                                        {{ year }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </header>
                    <table class="vdpTable">
                        <thead>
                            <tr>
                                <th class="vdpHeadCell" v-for="(weekday, weekdayIndex) in weekdaysSorted" :key="weekdayIndex">
                                    <span class="vdpHeadCellContent">{{weekday}}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            :key="currentPeriod.year + '-' + currentPeriod.month"
                            :class="directionClass"
                        >
                            <tr class="vdpRow" v-for="(week, weekIndex) in currentPeriodDates" :key="weekIndex">
                                <td
                                    class="vdpCell"
                                    v-for="item in week"
                                    :class="{
                                        selectable: editable && !item.disabled,
                                        selected: item.selected,
                                        disabled: item.disabled,
                                        today: item.today,
                                        outOfRange: item.outOfRange
                                    }"
                                    :data-id="item.dateKey"
                                    :key="item.dateKey"
                                    @click="editable && selectDateItem(item)"
                                >
                                    <div
                                        class="vdpCellContent"
                                    >{{ item.date.getDate() }}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="pickTime && currentTime" class="vdpTimeControls">
                        <span class="vdpTimeCaption">{{ setTimeCaption }}</span>
                        <div class="vdpTimeUnit">
                            <pre><span>{{ currentTime.hoursFormatted }}</span><br></pre>
                            <input
                                type="number" pattern="\d*" class="vdpHoursInput"
                                @input.prevent="inputHours"
                                @focusin="onTimeInputFocus"
                                :disabled="!editable"
                                :value="currentTime.hoursFormatted"
                            >
                        </div>
                        <span v-if="pickMinutes" class="vdpTimeSeparator">:</span>
                        <div v-if="pickMinutes" class="vdpTimeUnit">
                            <pre><span>{{ currentTime.minutesFormatted }}</span><br></pre>
                            <input
                                v-if="pickMinutes"
                                type="number" pattern="\d*" class="vdpMinutesInput"
                                @input="inputTime('setMinutes', $event)"
                                @focusin="onTimeInputFocus"
                                :disabled="!editable"
                                :value="currentTime.minutesFormatted"
                            >
                        </div>
                        <span v-if="pickSeconds" class="vdpTimeSeparator">:</span>
                        <div v-if="pickSeconds" class="vdpTimeUnit">
                            <pre><span>{{ currentTime.secondsFormatted }}</span><br></pre>
                            <input
                                v-if="pickSeconds"
                                type="number" pattern="\d*" class="vdpSecondsInput"
                                @input="inputTime('setSeconds', $event)"
                                @focusin="onTimeInputFocus"
                                :disabled="!editable"
                                :value="currentTime.secondsFormatted"
                            >
                        </div>
                        <button
                            v-if="use12HourClock"
                            type="button" class="vdp12HourToggleBtn"
                            :disabled="!editable"
                            @click="set12HourClock(currentTime.isPM ? 'AM' : 'PM')"
                        >
                            {{ currentTime.isPM ? 'PM' : 'AM' }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

const formatRE = /,|\.|-| |:|\/|\\/;
const dayRE = /D+/;
const monthRE = /M+/;
const yearRE = /Y+/;
const hoursRE = /h+/i;
const minutesRE = /m+/;
const secondsRE = /s+/;
const AMPMClockRE = /A/;

export default {

    props: {
        value: {
            type: String,
            default: ''
        },
        format: {
            type: String,
            default: 'YYYY-MM-DD'
        },
        displayFormat: {
            type: String
        },
        editable: {
            type: Boolean,
            default: true
        },
        hasInputElement: {
            type: Boolean,
            default: true
        },
        inputAttributes: {
            type: Object
        },
        selectableYearRange: {
            type: [Number, Object, Function],
            default: 40
        },
        startPeriod: {
            type: Object
        },
        parseDate: {
            type: Function
        },
        formatDate: {
            type: Function
        },
        pickTime: {
            type: Boolean,
            default: false
        },
        pickMinutes: {
            type: Boolean,
            default: true
        },
        pickSeconds: {
            type: Boolean,
            default: false
        },
        use12HourClock: {
            type: Boolean,
            default: false
        },
        isDateDisabled: {
            type: Function,
            default: () => false
        },
        nextMonthCaption: {
            type: String,
            default: 'Next month'
        },
        prevMonthCaption: {
            type: String,
            default: 'Previous month'
        },
        setTimeCaption: {
            type: String,
            default: 'Set time:'
        },
        mobileBreakpointWidth: {
            type: Number,
            default: 500
        },
        weekdays: {
            type: Array,
            default: () => ([
                'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
            ])
        },
        months: {
            type: Array,
            default: () => ([
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
            ])
        },
        startWeekOnSunday: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            inputValue: this.valueToInputFormat(this.value),
            direction: undefined,
            positionClass: undefined,
            opened: !this.hasInputElement,
            currentPeriod: this.startPeriod || this.getPeriodFromValue(
                this.value, this.format
            )
        };
    },

    computed: {

        valueDate() {

            const value = this.value;
            const format = this.format;

            return value
                ? this.parseDateString(value, format)
                : undefined
            ;

        },

        isReadOnly() {
            return !this.editable || (this.inputAttributes && this.inputAttributes.readonly);
        },

        isValidValue() {

            const valueDate = this.valueDate;

            return this.value ? Boolean(valueDate) : true;

        },

        currentPeriodDates() {

            const {year, month} = this.currentPeriod;
            const days = [];
            const date = new Date(year, month, 1);
            const today = new Date();
            const offset = this.startWeekOnSunday ? 1 : 0;

            // append prev month dates
            const startDay = date.getDay() || 7;

            if (startDay > (1 - offset)) {
                for (let i = startDay - (2 - offset); i >= 0; i--) {

                    const prevDate = new Date(date);
                    prevDate.setDate(-i);
                    days.push({outOfRange: true, date: prevDate});

                }
            }

            while (date.getMonth() === month) {
                days.push({date: new Date(date)});
                date.setDate(date.getDate() + 1);
            }

            // append next month dates
            const daysLeft = 7 - days.length % 7;

            for (let i = 1; i <= daysLeft; i++) {

                const nextDate = new Date(date);
                nextDate.setDate(i);
                days.push({outOfRange: true, date: nextDate});

            }

            // define day states
            days.forEach(day => {
                day.disabled = this.isDateDisabled(day.date);
                day.today = areSameDates(day.date, today);
                day.dateKey = [
                    day.date.getFullYear(), day.date.getMonth() + 1, day.date.getDate()
                ].join('-');
                day.selected = this.valueDate ? areSameDates(day.date, this.valueDate) : false;
            });

            return chunkArray(days, 7);

        },

        yearRange() {

            const currentYear = this.currentPeriod.year;
            const userRange = this.selectableYearRange;
            const userRangeType = typeof userRange;

            let yearsRange = [];

            if (userRangeType === 'number') {
                yearsRange = range(
                    currentYear - userRange,
                    currentYear + userRange
                );
            } else if (userRangeType === 'object') {
                yearsRange = range(
                    userRange.from,
                    userRange.to
                );
            } else if (userRangeType === 'function') {
                yearsRange = userRange(this);
            }

            if (yearsRange.indexOf(currentYear) < 0) {
                yearsRange.push(currentYear);
                yearsRange = yearsRange.sort();
            }

            return yearsRange;

        },

        currentTime() {

            const currentDate = this.valueDate;

            if (!currentDate) {
                return undefined;
            }

            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const seconds = currentDate.getSeconds();

            return {
                hours,
                minutes,
                seconds,
                isPM: isPM(hours),
                hoursFormatted: (this.use12HourClock ? to12HourClock(hours) : hours).toString(),
                minutesFormatted: paddNum(minutes, 2),
                secondsFormatted: paddNum(seconds, 2)
            };

        },

        directionClass() {

            return this.direction ? `vdp${this.direction}Direction` : undefined;

        },

        weekdaysSorted() {

            if (this.startWeekOnSunday) {
                const weekdays = this.weekdays.slice();
                weekdays.unshift(weekdays.pop());
                return weekdays;
            } else {
                return this.weekdays;
            }

        }

    },

    watch: {

        value(value) {

            if (this.isValidValue) {
                this.inputValue = this.valueToInputFormat(value);
                this.currentPeriod = this.getPeriodFromValue(value, this.format);
            }

        },

        currentPeriod(currentPeriod, oldPeriod) {

            const currentDate = new Date(currentPeriod.year, currentPeriod.month).getTime();
            const oldDate = new Date(oldPeriod.year, oldPeriod.month).getTime();

            this.direction = currentDate !== oldDate
                ? (currentDate > oldDate ? 'Next' : 'Prev')
                : undefined
            ;

            if (currentDate !== oldDate) {
                this.$emit('periodChange', {
                    year: currentPeriod.year,
                    month: currentPeriod.month
                });
            }

        }

    },

    beforeDestroy() {

        this.removeCloseEvents();
        this.teardownPosition();

    },

    methods: {

        valueToInputFormat(value) {

            return !this.displayFormat ? value : this.formatDateToString(
                this.parseDateString(value, this.format), this.displayFormat
            ) || value;

        },

        getPeriodFromValue(dateString, format) {

            const date = this.parseDateString(dateString, format) || new Date();

            return {month: date.getMonth(), year: date.getFullYear()};

        },

        parseDateString(dateString, dateFormat) {

            return !dateString
                ? undefined
                : this.parseDate
                    ? this.parseDate(dateString, dateFormat)
                    : this.parseSimpleDateString(dateString, dateFormat)
            ;

        },

        formatDateToString(date, dateFormat) {

            return !date
                ? ''
                : this.formatDate
                    ? this.formatDate(date, dateFormat)
                    : this.formatSimpleDateToString(date, dateFormat)
            ;

        },

        parseSimpleDateString(dateString, dateFormat) {

            let day, month, year, hours, minutes, seconds;

            const dateParts = dateString.split(formatRE);
            const formatParts = dateFormat.split(formatRE);
            const partsSize = formatParts.length;

            for (let i = 0; i < partsSize; i++) {

                if (formatParts[i].match(dayRE)) {
                    day = parseInt(dateParts[i], 10);
                } else if (formatParts[i].match(monthRE)) {
                    month = parseInt(dateParts[i], 10);
                } else if (formatParts[i].match(yearRE)) {
                    year = parseInt(dateParts[i], 10);
                } else if (formatParts[i].match(hoursRE)) {
                    hours = parseInt(dateParts[i], 10);
                } else if (formatParts[i].match(minutesRE)) {
                    minutes = parseInt(dateParts[i], 10);
                } else if (formatParts[i].match(secondsRE)) {
                    seconds = parseInt(dateParts[i], 10);
                }

            };

            const resolvedDate = new Date(
                [paddNum(year, 4), paddNum(month, 2), paddNum(day, 2)].join('-')
            );

            if (isNaN(resolvedDate)) {
                return undefined;
            } else {

                const date = new Date(year, month - 1, day);

                [
                    [year, 'setFullYear'],
                    [hours, 'setHours'],
                    [minutes, 'setMinutes'],
                    [seconds, 'setSeconds']
                ].forEach(([value, method]) => {
                    typeof value !== 'undefined' && date[method](value);
                });

                return date;
            }

        },

        formatSimpleDateToString(date, dateFormat) {

            return dateFormat
                .replace(yearRE, match => Number(date.getFullYear().toString().slice(-match.length)))
                .replace(monthRE, match => paddNum(date.getMonth() + 1, match.length))
                .replace(dayRE, match => paddNum(date.getDate(), match.length))
                .replace(hoursRE, match => paddNum(
                    AMPMClockRE.test(dateFormat) ? to12HourClock(date.getHours()) : date.getHours(),
                    match.length
                ))
                .replace(minutesRE, match => paddNum(date.getMinutes(), match.length))
                .replace(secondsRE, match => paddNum(date.getSeconds(), match.length))
                .replace(AMPMClockRE, match => isPM(date.getHours()) ? 'PM' : 'AM')
            ;

        },

        incrementMonth(increment = 1) {

            const refDate = new Date(this.currentPeriod.year, this.currentPeriod.month);
            const incrementDate = new Date(refDate.getFullYear(), refDate.getMonth() + increment);

            this.currentPeriod = {
                month: incrementDate.getMonth(),
                year: incrementDate.getFullYear()
            };

        },

        processUserInput(userText) {

            const userDate = this.parseDateString(
                userText, this.displayFormat || this.format
            );

            this.inputValue = userText;

            this.$emit('input', userDate
                ? this.formatDateToString(userDate, this.format)
                : userText
            );

        },

        toggle() {

            return this.opened ? this.close() : this.open();

        },

        open() {

            if (!this.opened) {
                this.opened = true;
                this.currentPeriod = this.startPeriod || this.getPeriodFromValue(
                    this.value, this.format
                );
                this.addCloseEvents();
                this.setupPosition();
            }
            this.direction = undefined;

        },

        close() {

            if (this.opened) {
                this.opened = false;
                this.direction = undefined;
                this.removeCloseEvents();
                this.teardownPosition();
            }

        },

        closeViaOverlay(e) {

            if (this.hasInputElement && e.target === this.$refs.outerWrap) {
                this.close();
            }

        },

        addCloseEvents() {

            if (!this.closeEventListener) {

                this.closeEventListener = e => this.inspectCloseEvent(e);

                ['click', 'keyup', 'focusin'].forEach(
                    eventName => document.addEventListener(eventName, this.closeEventListener)
                );

            }

        },

        inspectCloseEvent(event) {

            if (event.keyCode) {
                event.keyCode === 27 && this.close();
            } else if (!(event.target === this.$el) && !this.$el.contains(event.target)) {
                this.close();
            }

        },

        removeCloseEvents() {

            if (this.closeEventListener) {

                ['click', 'keyup', 'focusin'].forEach(
                    eventName => document.removeEventListener(eventName, this.closeEventListener)
                );

                delete this.closeEventListener;

            }

        },

        setupPosition() {

            if (!this.positionEventListener) {
                this.positionEventListener = () => this.positionFloater();
                window.addEventListener('resize', this.positionEventListener);
            }

            this.positionFloater();

        },

        positionFloater() {

            const inputRect = this.$el.getBoundingClientRect();

            let verticalClass = 'vdpPositionTop';
            let horizontalClass = 'vdpPositionLeft';

            const calculate = () => {

                const rect = this.$refs.outerWrap.getBoundingClientRect();
                const floaterHeight = rect.height;
                const floaterWidth = rect.width;

                if (window.innerWidth > this.mobileBreakpointWidth) {

                    // vertical
                    if (
                        (inputRect.top + inputRect.height + floaterHeight > window.innerHeight) &&
                        (inputRect.top - floaterHeight > 0)
                    ) {
                        verticalClass = 'vdpPositionBottom';
                    }

                    // horizontal
                    if (inputRect.left + floaterWidth > window.innerWidth) {
                        horizontalClass = 'vdpPositionRight';
                    }

                    this.positionClass = ['vdpPositionReady', verticalClass, horizontalClass].join(' ');

                } else {

                    this.positionClass = 'vdpPositionFixed';

                }

            };

            this.$refs.outerWrap ? calculate() : this.$nextTick(calculate);

        },

        teardownPosition() {

            if (this.positionEventListener) {
                this.positionClass = undefined;
                window.removeEventListener('resize', this.positionEventListener);
                delete this.positionEventListener;
            }

        },

        clear() {

            this.$emit('input', '');

        },

        selectDateItem(item) {

            if (!item.disabled) {

                const newDate = new Date(item.date);

                if (this.currentTime) {
                    newDate.setHours(this.currentTime.hours);
                    newDate.setMinutes(this.currentTime.minutes);
                    newDate.setSeconds(this.currentTime.seconds);
                }

                this.$emit('input', this.formatDateToString(newDate, this.format));

                if (this.hasInputElement && !this.pickTime) {
                    this.close();
                }
            }

        },

        set12HourClock(value) {

            const currentDate = new Date(this.valueDate);
            const currentHours = currentDate.getHours();

            currentDate.setHours(value === 'PM'
                ? currentHours + 12
                : currentHours - 12
            );

            this.$emit('input', this.formatDateToString(currentDate, this.format));
        },

        inputHours(event) {

            const currentDate = new Date(this.valueDate);
            const currentHours = currentDate.getHours();
            const targetValue = parseInt(event.target.value, 10) || 0;
            const minHours = this.use12HourClock ? 1 : 0;
            const maxHours = this.use12HourClock ? 12 : 23;
            const numValue = boundNumber(targetValue, minHours, maxHours);

            currentDate.setHours(this.use12HourClock
                ? to24HourClock(numValue, isPM(currentHours))
                : numValue
            );
            event.target.value = paddNum(numValue, 1);
            this.$emit('input', this.formatDateToString(currentDate, this.format));

        },

        inputTime(method, event) {

            const currentDate = new Date(this.valueDate);
            const targetValue = parseInt(event.target.value) || 0;
            const numValue = boundNumber(targetValue, 0, 59);

            event.target.value = paddNum(numValue, 2);
            currentDate[method](numValue);

            this.$emit('input', this.formatDateToString(currentDate, this.format));

        },

        onTimeInputFocus(event) {
            event.target.select && event.target.select();
        }

    }

};

function paddNum(num, padsize) {

    return typeof num !== 'undefined'
        ? num.toString().length > padsize
            ? num
            : new Array(padsize - num.toString().length + 1).join('0') + num
        : undefined
    ;

}

function chunkArray(inputArray, chunkSize) {

    const results = [];

    while (inputArray.length) {
        results.push(inputArray.splice(0, chunkSize));
    }

    return results;

}

function areSameDates(date1, date2) {

    return (date1.getDate() === date2.getDate()) &&
        (date1.getMonth() === date2.getMonth()) &&
        (date1.getFullYear() === date2.getFullYear())
    ;

}

function range(start, end) {

    const results = [];

    for (let i = start; i <= end; i++) {
        results.push(i);
    }
    return results;

}

function to12HourClock(hours) {

    const remainder = hours % 12;
    return remainder === 0 ? 12 : remainder;

}

function to24HourClock(hours, PM) {

    return PM
        ? (hours === 12 ? hours : hours + 12)
        : (hours === 12 ? 0 : hours)
    ;

}

function isPM(hours) {

    return hours >= 12;

}

function boundNumber(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

</script>

<style lang="scss">

    @import './vueDatePick.scss';

</style>
