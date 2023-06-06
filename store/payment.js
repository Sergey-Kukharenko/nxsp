import { setState } from '@/helpers';

export const state = () => ({
  paymentIntent: null
});

export const mutations = {
  setState
};

export const actions = {
  async fetchStripeClientSecret({ commit }) {
    try {
      const { data } = await this.$axios.$post(`/payment/stripe/intent/`);
      commit('setState', { paymentIntent: data });

      return data;
    } catch (err) {
      console.error(err);
    }
  }
};

export const getters = {
  getPaymentIntent: (state) => state.paymentIntent
};
