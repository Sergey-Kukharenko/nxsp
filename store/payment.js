import { setState } from '@/helpers';

export const state = () => ({
  paymentIntent: null
});

export const mutations = {
  setState
};

export const actions = {
  async fetchStripeClientSecret({ commit }, orderId) {
    try {
      const { data } = await this.$axios.$get(`/payment/stripe/${orderId}/`);
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
