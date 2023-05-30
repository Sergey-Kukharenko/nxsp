const setState = (state, payload) => {
  Object.keys(payload).forEach((key) => {
    if (key in state) {
      state[key] = payload[key];
    }
  });
};

export {
  setState,
};
