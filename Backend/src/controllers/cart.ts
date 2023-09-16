import { RollingResponse } from "../utils/rolling-response";
import _ from "lodash";
import * as CartDAL from "../dal/cart";
import { v4 as uuidv4 } from "uuid";
import Logger from "../utils/logger";

export async function addToCart(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const { productId, variantId, price, quantity, size } = req.body;

  const cart = await CartDAL.getCartByUserId(uid);

  if (cart) {
    const productIndex = _.findIndex(cart.products, { productId });
    let totalPrice = 0;
    if (productIndex > -1) {
      //product exists in the cart, update the quantity
      const cartItem = cart.products[productIndex];
      cartItem.quantity = parseInt(quantity as string, 10);
      cart.products[productIndex] = cartItem;
    } else {
      //product does not exists in cart, add new item
      const item: RollingTypes.CartItem = {
        productId,
        variantId,
        price,
        quantity,
        size,
      };
      cart.products.push(item);
    }

    _.forEach(cart.products, (item) => {
      totalPrice = totalPrice + item.price * item.quantity;
    });

    const updatedCart: RollingTypes.Cart = {
      ...cart,
      totalQuantity: cart.products.length,
      totalPrice,
      modifiedAt: Date.now(),
    };

    await CartDAL.updateCart(updatedCart);
  } else {
    // cart doesnot exists for user , create new cart
    const item: RollingTypes.CartItem = {
      productId,
      variantId,
      price,
      quantity,
      size,
    };

    const newCart: RollingTypes.Cart = {
      cartId: uuidv4(),
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      products: [item],
      totalPrice: price * quantity,
      totalQuantity: 1,
      userId: uid,
    };

    await CartDAL.createCart(newCart);
  }

  Logger.logToDb("addToCart", `${uid} added product with ${productId}`, uid);

  return new RollingResponse("cart created");
}

export async function getCart(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;

  const cart = await CartDAL.getCartByUserId(uid);
  if ((cart && cart.products.length === 0) || cart === null) {
    return new RollingResponse("Cart is empty");
  }

  return new RollingResponse("cart retrived", cart);
}

export async function deleteProduct(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const productId = req.params["productId"];

  const cart = await CartDAL.getCartByUserId(uid);

  if (cart) {
    const productIndex = _.findIndex(cart.products, { productId });
    const product = cart.products[productIndex];
    const totalQuantity = cart.totalQuantity - 1;
    const totalPrice = cart.totalPrice - product.price * product.quantity;

    _.pullAt(cart.products, productIndex);

    if (cart.products.length === 0) {
      await CartDAL.deleteCart(cart.cartId);
    } else {
      const updatedCart: RollingTypes.Cart = {
        ...cart,
        modifiedAt: Date.now(),
        totalPrice,
        totalQuantity,
        products: cart.products,
      };

      await CartDAL.updateCart(updatedCart);
    }
  }

  Logger.logToDb("delete_cart_item", `${productId} is deleted`, uid);

  return new RollingResponse("item deleted");
}
