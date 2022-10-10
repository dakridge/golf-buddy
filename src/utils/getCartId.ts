import { v4 as uuidv4 } from "uuid";

let cartId: null | string = "419372de-de17-4c50-b373-22c366f0fc9f";

const getCartId = (): string => {
    if (cartId) {
        return cartId;
    }

    cartId = uuidv4();
    return cartId;
};

export default getCartId;
