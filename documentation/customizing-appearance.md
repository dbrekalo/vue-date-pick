# Customizing appearance

## CSS
Vue Date pick colors can be adjusted with following selectors if you are using library css file directly (vue-date-pick/dist/vueDatePick.css)
```css
.vdpArrowPrev:after {
    border-right-color: #cc99cd;
}

.vdpArrowNext:after {
    border-left-color: #cc99cd;
}

.vdpCell.selectable:hover .vdpCellContent,
.vdpCell.selected .vdpCellContent {
    background: #cc99cd;
}

.vdpCell.today {
    color: #cc99cd;
}

.vdpTimeUnit > input:hover,
.vdpTimeUnit > input:focus {
    border-bottom-color: #cc99cd;
}
```

## SCSS
If you are compiling your css files with sass - library source scss file can be imported.
Add $vdpColor to your scss variables to override default styling.

```scss
$vdpColor: #cc99cd;
@import 'vue-date-pick/src/vueDatePick.scss';
```