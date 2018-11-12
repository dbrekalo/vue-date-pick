# Localization

Following props to are used to localize your date pick instance:

```js
nextMonthCaption: {type: String, default: 'Next month'},
prevMonthCaption: {type: String, default: 'Previous month'},
setTimeCaption: {type: String, default: 'Set time:'},
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
}
```
---