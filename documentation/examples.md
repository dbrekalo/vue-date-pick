# Examples

## Calendar widget
Vue date pick can be used in calendar widget form.

<calendar-widget></calendar-widget>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <date-pick
        v-model="date"
        :hasInputElement="false"
    ></date-pick>
</template>

<script>
import DatePick from 'vue-date-pick';

export default {
    components: {DatePick},
    data: () => ({
        date: '2019-02-12'
    })
};
</script>
```
</details>

## Date format
Simple date picker with custom format (default is 'YYYY-MM-DD'):

<picker-wrapper
    value="2019.01.01"
    :pickerProps="{format: 'YYYY.MM.DD'}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <date-pick
        v-model="date"
        :format="'YYYY.MM.DD'"
    ></date-pick>
</template>

<script>
import DatePick from 'vue-date-pick';
export default {
    components: {DatePick},
    data: () => ({
        date: '2019.01.01'
    })
};
</script>
```
</details>

## Display format
Use display format prop when UI date format is different from raw data format.

<picker-wrapper
    value="2019-01-01"
    :pickerProps="{displayFormat: 'DD.MM.YYYY'}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <date-pick
        v-model="date"
        :displayFormat="'DD.MM.YYYY'"
    ></date-pick>
</template>

<script>
import DatePick from 'vue-date-pick';
export default {
    components: {DatePick},
    data: () => ({
        date: '2019-01-01'
    })
};
</script>
```
</details>

## Custom date parser
Vue date pick comes with simple date parser.
If you need to work with complex date formats feel free to inject implementation of your choice.

<custom-engine></custom-engine>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <date-pick
        v-model="date"
        :format="format"
        :parseDate="parseDate"
        :formatDate="formatDate"
        :inputAttributes="{size: 32}"
    ></date-pick>
</template>

<script>
import DatePick from 'vue-date-pick';
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
```
</details>

## Date time picker
Date picker with controls for hours and minutes:

<picker-wrapper
    value="2019-01-01 14:30"
    :pickerProps="{format: 'YYYY-MM-DD HH:mm', pickTime: true}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <date-pick
        v-model="date"
        :pickTime="true"
        :format="'YYYY-MM-DD HH:mm'"
    ></date-pick>
</template>

<script>
import DatePick from 'vue-date-pick';
export default {
    components: {DatePick},
    data: () => ({
        date: '2019-01-01 14:30'
    })
};
</script>
```
</details>

## Disabling dates
Set "isDateDisabled" function as component prop to disable dates:

<disabled-dates></disabled-dates>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <date-pick
        v-model="date"
        :isDateDisabled="isFutureDate"
    ></date-pick>
</template>

<script>
import DatePick from 'vue-date-pick';
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
```
</details>

## Disabling manual input
Manual user input can be disabled by setting input readonly attribute via "inputAttributes" prop.

<picker-wrapper
    value="2019.01.01"
    :pickerProps="{inputAttributes: {readonly: true}}"
></picker-wrapper>

<details>
    <summary>
    Show code
    </summary>

```vue
<template>
    <date-pick
        v-model="date"
        :inputAttributes="{readonly: true}"
    ></date-pick>
</template>

<script>
import DatePick from 'vue-date-pick';

export default {
    components: {DatePick},
    data: () => ({
        date: '2018-12-29'
    })
};
</script>
```
</details>