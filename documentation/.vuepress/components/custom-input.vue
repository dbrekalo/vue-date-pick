<template>
    <date-pick
        class="datePickExample"
        v-model="date"
    >
        <template v-slot:default="{toggle, inputValue}">
            <button class="customInputBtn" @click="toggle">
                 {{ inputValue || 'Toggle calendar' }}
            </button>
        </template>
    </date-pick>
</template>

<script>
import DatePick from '../../../src/vueDatePick';
export default {
    components: {DatePick},
    data: () => ({
        date: ''
    })
};
</script>

<style lang="scss" scoped>
.customInputBtn {
    margin:0; padding: 0; border: 0; cursor: pointer; background: none;
    font-size: 1.5em; padding: 15px;
    border-radius: 4px; border: 1px solid #e0e0e0;
    box-shadow: 0 0.1em 0.3em rgba(0,0,0,0.05);
    transition: color 0.3s, border 0.2s;

    &::-moz-focus-inner {
        padding: 0; border: 0;
    }

    &:hover, &:focus {
        border-color: #7485c2;
        color: darken(#7485c2, 20%);
        outline: 0;
    }
}
</style>
