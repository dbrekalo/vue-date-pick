import {assert} from 'chai';
import {mount} from '@vue/test-utils';
import VueDatePick from '../src/vueDatePick';
import fecha from 'fecha';

describe('Vue date pick', () => {

    it('renders input element with correct value', () => {

        const wrapper = mount(VueDatePick, {
            propsData: {value: '2017-12-29'}
        });

        assert.equal(wrapper.find('input').element.value, '2017-12-29');

    });

    it('renders display format correctly', () => {

        const wrapper = mount(VueDatePick, {
            propsData: {value: '2017-12-29', displayFormat: 'DD.MM.YYYY'}
        });

        assert.equal(wrapper.find('input').element.value, '29.12.2017');

        wrapper.setProps({value: '2017-12-30'});

        assert.equal(wrapper.find('input').element.value, '30.12.2017');

    });

    it('emits correct input on date select', () => {

        const wrapper = mount(VueDatePick, {
            propsData: {value: '2017-12-29', displayFormat: 'DD.MM.YYYY'}
        });

        wrapper.vm.open();
        wrapper.find('td[data-id="2017-12-30"]').trigger('click');
        wrapper.find('input').setValue('31.12.2017');
        wrapper.vm.close();

        assert.deepEqual(wrapper.emitted().input, [
            ['2017-12-30'],
            ['2017-12-31']
        ]);

    });

    it('can use alternate parsing engine', () => {

        const wrapper = mount(VueDatePick, {propsData: {
            value: '2017-12-29 05:30',
            format: 'YYYY-MM-DD HH:mm',
            displayFormat: 'DD.MM.YYYY [at] HH:mm',
            parseDate(dateString, format) {
                return fecha.parse(dateString, format);
            },
            formatDate(date, format) {
                return fecha.format(date, format);
            }
        }});

        assert.equal(wrapper.find('input').element.value, '29.12.2017 at 05:30');

        wrapper.vm.open();
        wrapper.find('td[data-id="2017-12-30"]').trigger('click');

        assert.deepEqual(wrapper.emitted().input, [
            ['2017-12-30 05:30']
        ]);

    });

    it('can function as time picker', () => {

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
        wrapper.find('.vdpHoursInput').setValue('6');
        wrapper.find('.vdpMinutesInput').setValue('15');
        wrapper.find('.vdpHoursInput').setValue('24');
        wrapper.find('.vdpHoursInput').setValue('-1');

        assert.deepEqual(wrapper.emitted().input, [
            ['2017-12-29 06:30:00'],
            ['2017-12-29 06:15:00'],
            ['2017-12-29 23:15:00'],
            ['2017-12-29 00:15:00']
        ]);

    });

    it('disables dates correctly', () => {

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

        assert.isTrue(wrapper.find('td[data-id="2017-12-30"]').is('.disabled'));

        wrapper.find('td[data-id="2017-12-30"]').trigger('click');

        assert.isUndefined(wrapper.emitted().input);

    });

    it('sets selected cells', () => {

        const wrapper = mount(VueDatePick);
        wrapper.vm.open();

        assert.isFalse(wrapper.find('td.selected').exists());

        assert.isTrue(wrapper.vm.isValidValue); // vue test utils sync bug

        wrapper.setProps({value: '2017-12-29'});

        assert.isTrue(wrapper.find('td[data-id="2017-12-29"]').is('.selected'));

        wrapper.destroy();

    });

    it('switches periods correctly', () => {

        const wrapper = mount(VueDatePick, {
            propsData: {value: '2017-12-29'}
        });

        wrapper.vm.open();
        wrapper.find('.vdpArrowNext').trigger('click');

        assert.equal('January 2018', wrapper.findAll('.vdpPeriodControl > button').wrappers.map(
            buttonWrap => buttonWrap.element.textContent.trim()
        ).join(' '));

    });

    it('closes floater on outside click', () => {

        const wrapper = mount(VueDatePick);

        wrapper.vm.open();

        assert.isTrue(wrapper.vm.opened);

        document.querySelector('body').click();

        assert.isFalse(wrapper.vm.opened);

    });

    it('closes floater on escape press', () => {

        const wrapper = mount(VueDatePick);

        wrapper.vm.open();

        var event = new Event('keyup');
        event.which = event.keyCode = 27;
        document.dispatchEvent(event);

        assert.isFalse(wrapper.vm.opened);

    });

    it('tolerates invalid user input', () => {

        const wrapper = mount(VueDatePick);

        wrapper.find('input').setValue('2017-12');
        wrapper.find('input').setValue('2017-1229');

        assert.deepEqual(wrapper.emitted().input, [
            ['2017-12'],
            ['2017-1229']
        ]);

    });

    it('renders as calendar widget', () => {

        const wrapper = mount(VueDatePick, {propsData: {
            hasInputElement: false
        }});

        assert.isFalse(wrapper.contains('input'));
        assert.isTrue(wrapper.contains('.vdpTable'));

    });

});
