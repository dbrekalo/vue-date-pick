import {assert} from 'chai';
import {mount} from '@vue/test-utils';
import VueDatePick from '../src/vueDatePick';
import Vue from 'vue';
import fecha from 'fecha';

describe('Vue date pick', () => {

    it('renders input element with correct value', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {value: '2017-12-29'}
        });

        assert.equal(wrapper.find('input').element.value, '2017-12-29');

    });

    it('renders display format correctly', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {value: '2017-12-29', displayFormat: 'DD.MM.YYYY'}
        });

        assert.equal(wrapper.find('input').element.value, '29.12.2017');

        wrapper.setProps({value: '2017-12-30'});
        await Vue.nextTick();

        assert.equal(wrapper.find('input').element.value, '30.12.2017');

    });

    it('emits correct input on date select', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {value: '2017-12-29', displayFormat: 'DD.MM.YYYY'}
        });

        wrapper.vm.open();
        await Vue.nextTick();

        wrapper.find('td[data-id="2017-12-30"]').trigger('click');
        wrapper.find('input').setValue('31.12.2017');
        wrapper.vm.close();

        assert.deepEqual(wrapper.emitted().input, [
            ['2017-12-30'],
            ['2017-12-31']
        ]);

    });

    it('can use alternate parsing engine', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {
                value: '2017-12-29 05:30',
                format: 'YYYY-MM-DD HH:mm',
                displayFormat: 'DD.MM.YYYY [at] HH:mm',
                parseDate(dateString, format) {
                    return fecha.parse(dateString, format);
                },
                formatDate(date, format) {
                    return fecha.format(date, format);
                }
            }
        });

        assert.equal(wrapper.find('input').element.value, '29.12.2017 at 05:30');

        wrapper.vm.open();
        await Vue.nextTick();

        wrapper.find('td[data-id="2017-12-30"]').trigger('click');

        assert.deepEqual(wrapper.emitted().input, [
            ['2017-12-30 05:30']
        ]);

    });

    it('can function as time picker', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {
                value: '2017-12-29 5:30:00',
                format: 'YYYY-MM-DD HH:mm:ss',
                pickTime: true,
                pickMinutes: true,
                pickSeconds: true
            }
        });

        wrapper.vm.open();
        await Vue.nextTick();

        wrapper.find('.vdpHoursInput').setValue('6');
        wrapper.find('.vdpMinutesInput').setValue('15');
        wrapper.find('.vdpHoursInput').setValue('24');
        wrapper.find('.vdpHoursInput').setValue('-1');

        assert.deepEqual(wrapper.emitted().input, [
            ['2017-12-29 06:30:00'],
            ['2017-12-29 05:15:00'],
            ['2017-12-29 23:30:00'],
            ['2017-12-29 00:30:00']
        ]);

    });

    it('can function as time picker with 12 hour click', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {
                value: '2017-12-29 5:30:00',
                format: 'YYYY-MM-DD HH:mm:ss',
                displayFormat: 'YYYY.MM.DD H:mm A',
                pickTime: true,
                use12HourClock: true
            }
        });

        wrapper.vm.open();
        await Vue.nextTick();

        assert.equal(wrapper.find('input').element.value, '2017.12.29 5:30 AM');

        wrapper.find('.vdp12HourToggleBtn').trigger('click');

        assert.deepEqual(wrapper.emitted().input, [
            ['2017-12-29 17:30:00']
        ]);

    });

    it('disables dates correctly', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {
                value: '2017-12-29',
                isDateDisabled: function(date) {
                    const refDate = new Date('2017-12-29');
                    return date > refDate;
                }
            }
        });

        wrapper.vm.open();
        await Vue.nextTick();

        assert.isTrue(wrapper.find('td[data-id="2017-12-30"]').is('.disabled'));

        wrapper.find('td[data-id="2017-12-30"]').trigger('click');

        assert.isUndefined(wrapper.emitted().input);

    });

    it('starts week on monday', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {
                value: '2017-12-29'
            }
        });

        wrapper.vm.open();
        await Vue.nextTick();

        assert.equal('Mon', wrapper.find('.vdpHeadCell:first-of-type span').text().trim());
        assert.equal('Sun', wrapper.find('.vdpHeadCell:last-of-type span').text().trim());
    });

    it('can start week on sunday', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {
                value: '2017-12-29',
                startWeekOnSunday: true
            }
        });

        wrapper.vm.open();
        await Vue.nextTick();

        assert.equal('Sun', wrapper.find('.vdpHeadCell:first-of-type span').text().trim());
        assert.equal('Sat', wrapper.find('.vdpHeadCell:last-of-type span').text().trim());

        // Change year and assert again
        wrapper.setProps({value: '2018-12-29'});
        await Vue.nextTick();

        assert.equal('Sun', wrapper.find('.vdpHeadCell:first-of-type span').text().trim());
        assert.equal('Sat', wrapper.find('.vdpHeadCell:last-of-type span').text().trim());
    });

    it('sets selected cells', async () => {

        const wrapper = mount(VueDatePick);

        wrapper.vm.open();
        await Vue.nextTick();

        assert.isFalse(wrapper.find('td.selected').exists());

        wrapper.setProps({value: '2017-12-29'});
        await Vue.nextTick();

        assert.isTrue(wrapper.find('td[data-id="2017-12-29"]').is('.selected'));

    });

    it('switches periods correctly', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {value: '2017-12-29'}
        });

        wrapper.vm.open();
        await Vue.nextTick();
        wrapper.find('.vdpArrowNext').trigger('click');
        await Vue.nextTick();

        assert.equal('January 2018', wrapper.findAll('.vdpPeriodControl > button').wrappers.map(
            buttonWrap => buttonWrap.element.textContent.trim()
        ).join(' '));

    });

    it('closes floater on outside click', async () => {

        const wrapper = mount(VueDatePick);

        wrapper.vm.open();
        await Vue.nextTick();

        assert.isTrue(wrapper.vm.opened);

        document.querySelector('body').click();

        assert.isFalse(wrapper.vm.opened);

    });

    it('closes floater on escape press', async () => {

        const wrapper = mount(VueDatePick);

        wrapper.vm.open();
        await Vue.nextTick();

        var event = new Event('keyup');
        event.which = event.keyCode = 27;
        document.dispatchEvent(event);

        assert.isFalse(wrapper.vm.opened);

    });

    it('tolerates invalid user input', async () => {

        const wrapper = mount(VueDatePick);

        wrapper.find('input').setValue('2017-12');
        wrapper.find('input').setValue('2017-1229');

        assert.deepEqual(wrapper.emitted().input, [
            ['2017-12'],
            ['2017-1229']
        ]);

    });

    it('renders as calendar widget', async () => {

        const wrapper = mount(VueDatePick, {
            propsData: {
                hasInputElement: false
            }
        });

        assert.isFalse(wrapper.contains('input'));
        assert.isTrue(wrapper.contains('.vdpTable'));

    });

});
