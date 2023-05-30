<template>
  <div id="payment-request-button"></div>
</template>

<script>

export default {
  name: "StripePayments",

  data() {
    return {
      loading: false,
      clientSecret: "",
      stripe: null,
      stripePaymentRequest: null,
    };
  },

  methods: {
    async generatePaymentIntent() {
      try {
        if (this.clientSecret) {
          return this.clientSecret;
        }

        const { client_secret: clientSecret } = await this.$store.dispatch(
          "payment/fetchStripeClientSecret",
          "vG2ON8Xj6xXp45q7"
        );
        this.clientSecret = clientSecret || "";

        return clientSecret;
      } catch (err) {
        console.error(err);
      }
    },

    async initApplePayButton() {
      try {
        // await this.generatePaymentIntent();

        // eslint-disable-next-line no-undef
        // this.stripe = await Stripe(
        //   "pk_test_51MAH44FIu4AHcfNO4v4WsCBEV8LZBYlecVBPHPn5EaVLhM1dtdXNc0c5sqSRkpizA5e7m8dwNlSNJaCiG9r0pbbW00BwAVZ3IV"
        // );

        this.stripe = this.$stripe

        this.paymentRequest = this.stripe.paymentRequest({
          country: "GB",
          currency: "gbp",
          total: {
            label: "Demo total",
            amount: 1099,
          },
          requestPayerName: true,
          requestPayerEmail: true,
        });

        const elements = this.stripe.elements();
        const prButton = elements.create("paymentRequestButton", {
          paymentRequest: this.paymentRequest,
        });

        await (async () => {
          // Check the availability of the Payment Request API first.
          const result = await this.paymentRequest.canMakePayment();

          console.log(result);

          if (result) {
            prButton.mount("#payment-request-button");
          } else {
            document.getElementById("payment-request-button").style.display =
              "none";
          }
        })();

        this.paymentRequest.on("paymentmethod", async (ev) => {
          // Confirm the PaymentIntent without handling potential next actions (yet).
          const { paymentIntent, error: confirmError } =
            await this.stripe.confirmCardPayment(
              this.clientSecret,
              { payment_method: ev.paymentMethod.id },
              { handleActions: false }
            );

          if (confirmError) {
            // Report to the browser that the payment failed, prompting it to
            // re-show the payment interface, or show an error message and close
            // the payment interface.
            ev.complete("fail");
          } else {
            // Report to the browser that the confirmation was successful, prompting
            // it to close the browser payment method collection interface.
            ev.complete("success");
            // Check if the PaymentIntent requires any actions and if so let Stripe.js
            // handle the flow. If using an API version older than "2019-02-11"
            // instead check for: `paymentIntent.status === "requires_source_action"`.
            if (paymentIntent.status === "requires_action") {
              // Let Stripe.js handle the rest of the payment flow.
              const { error } = await this.stripe.confirmCardPayment(
                this.clientSecret
              );
              if (error) {
                // The payment failed -- ask your customer for a new payment method.
              } else {
                // The payment has succeeded.
              }
            } else {
              // The payment has succeeded.
            }
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
  },

  mounted() {
    this.initApplePayButton();
  },
};
</script>
