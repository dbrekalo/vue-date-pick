# Props reference

List of all props available on vue date pick component:

```js
value: {type: String, default: ''},
format: {type: String, default: 'YYYY-MM-DD'},
displayFormat: {type: String},
hasInputElement: {type: Boolean, default: true},
inputAttributes: {type: Object},
selectableYearRange: {type: Number, default: 40},
parseDate: {type: Function},
formatDate: {type: Function},
pickTime: {type: Boolean, default: false},
pickMinutes: {type: Boolean, default: true},
pickSeconds: {type: Boolean, default: false},
isDateDisabled: {type: Function, default: () => false},
nextMonthCaption: {type: String, default: 'Next month'},
prevMonthCaption: {type: String, default: 'Previous month'},
setTimeCaption: {type: String, default: 'Set time:'},
mobileBreakpointWidth: {type: Number, default: 500},
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