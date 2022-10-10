interface State {
    cartId: string;
    sessionToken: string;
}

const state = {
    cartId: '',
    sessionToken: '',
};

export const addToState = (key: keyof State, value: any) => {
    state[key] = value;
}

export const getState = (key: keyof State) => {
    return state[key];
}
