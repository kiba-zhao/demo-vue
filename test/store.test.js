import { vuex } from '@/index';
import template from './store/template.json';
import formData from './store/form_data.json';
import elements from './store/elements.json';
import data from './store/data.json';

describe('store', () => {

  describe('form: changeByTemplateAndSubmit', () => {

    const { form } = vuex.modules;

    it('success', () => {

      const rootIndex = 1;
      const state = { rootIndex, template, submitData: { [rootIndex]: { id: template.id, children: formData } } };
      // console.log(1111111111, JSON.stringify(state.template));
      // console.log(2222222222, JSON.stringify(state.submitData));
      const commit = jest.fn();

      form.actions.changeByTemplateAndSubmit({ state, commit });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith('init', expect.anything());
      // console.log(9999999, JSON.stringify(commit.mock.calls[0][1].mappings));
      // console.log(9999999, JSON.stringify(commit.mock.calls[0][1].data));
      // console.log(9999999, JSON.stringify(commit.mock.calls[0][1].elements));
      // console.log(9999999, JSON.stringify(commit.mock.calls[0][1].submitData));
    });

  });

  describe('form: changeSubmitDataByData', () => {

    const { form } = vuex.modules;

    it('success', () => {

      const commit = jest.fn();
      const status = { 14: true, 13: true, 5: true, 16: true, 17: true, 18: true, 20: true, 22: true, 24: true, 26: true, 28: true, 30: true, 31: true };
      const state = { data, status, elements };

      form.actions.changeSubmitDataByData({ state, commit });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith('setSubmitData', expect.anything());
      // console.log(9999999, JSON.stringify(commit.mock.calls[0][1].submitData));

    });

  });



});

