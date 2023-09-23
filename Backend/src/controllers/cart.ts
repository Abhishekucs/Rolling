import { RollingResponse } from "../utils/rolling-response";
import _ from "lodash";
import * as CartDAL from "../dal/cart";
import Logger from "../utils/logger";
import RollingError from "../utils/error";
import { ObjectId } from "mongodb";
import { getProductById } from "../dal/product";

export async function addToCart(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const { productId, variantId, price, quantity, size, name } = req.body;

  try {
    const cart = await CartDAL.getCart(uid);

    const productIndex = _.findIndex(cart.items, {
      variantId,
    });

    if (
      productIndex > -1 &&
      cart.items[productIndex].size === (size as string)
    ) {
      //product exists in the cart, update the quantity

      let productQuantity = parseInt(quantity as string, 10);
      productQuantity = productQuantity + cart.items[productIndex].quantity;

      cart.items[productIndex].quantity = productQuantity;

      let updatedTotalPrice = 0;

      _.forEach(cart.items, (item) => {
        updatedTotalPrice = updatedTotalPrice + item.price * item.quantity;
      });

      cart.totalPrice = updatedTotalPrice;

      await CartDAL.updateCart(uid, cart);
    } else {
      //product does not exists in cart, add new item

      const product = await getProductById(productId);
      if (!product) {
        throw new RollingError(404, "product not found", "addToCart");
      }
      const variantDoc = _.find(product.variants, {
        _id: new ObjectId(variantId),
      });

      if (!variantDoc) {
        throw new RollingError(404, "variant not found", "addToCart");
      }
      // get product variant from database and update the imageurl
      const item: RollingTypes.CartItem = {
        _id: new ObjectId(),
        productId,
        variantId,
        price: parseInt(price as string, 10),
        quantity: parseInt(quantity as string, 10),
        size,
        productName: name,
        imageUrl: variantDoc.images[0],
      };

      const updatedTotalPrice = cart.totalPrice + item.price * item.quantity;
      const updatedTotalQuantity = cart.totalQuantity + 1;

      cart.items.push(item);
      console.log(cart.items.length);
      cart.totalPrice = updatedTotalPrice;
      cart.totalQuantity = updatedTotalQuantity;

      await CartDAL.updateCart(uid, cart);
    }
    return new RollingResponse("cart created");
  } catch (error) {
    if (error instanceof RollingError) {
      if (error.status === 404 && error.message.includes("cart not found")) {
        // cart doesnot exists for user , create new cart
        const product = await getProductById(productId);
        if (!product) {
          throw new RollingError(404, "product not found", "addToCart");
        }
        const variantDoc = _.find(product.variants, {
          _id: new ObjectId(variantId),
        });

        if (!variantDoc) {
          throw new RollingError(404, "variant not found", "addToCart");
        }

        const item: RollingTypes.CartItem = {
          _id: new ObjectId(),
          productId,
          variantId,
          price: parseInt(price as string, 10),
          quantity: parseInt(quantity as string, 10),
          size,
          productName: name,
          imageUrl: variantDoc.images[0],
        };

        const cart: RollingTypes.Cart = {
          _id: new ObjectId(),
          createdAt: Date.now(),
          modifiedAt: Date.now(),
          totalPrice: parseInt(price as string, 10),
          totalQuantity: 1,
          items: [item],
          uid,
        };

        await CartDAL.createCart(uid, cart);

        return new RollingResponse("cart created");
      }
    }

    throw error;
  }
}

export async function updateItem(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const { quantity, size } = req.body;
  const cartItemId = req.params["cartItemId"];

  await CartDAL.updateCartItem(
    uid,
    cartItemId,
    size,
    parseInt(quantity as string, 10),
  );

  return new RollingResponse("updated successfully");
}

export async function getCart(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;

  const cart = await CartDAL.getCart(uid);

  return new RollingResponse("cart retrived", cart);
}

export async function deleteProduct(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const cartItemid = req.params["cartItemid"];

  const cart = await CartDAL.getCart(uid);
  const items = [...cart.items];

  const itemIndex = _.findIndex(items, { _id: new ObjectId(cartItemid) });
  if (itemIndex === -1) {
    throw new RollingError(404, "item not found", "deleteProduct");
  }

  const updatedTotalQuantity = cart.totalQuantity - 1;
  const deletedItem = items.splice(itemIndex, 1)[0];

  const updatedTotalPrice =
    cart.totalPrice - deletedItem.price * deletedItem.quantity;

  cart.items = items;
  cart.totalPrice = updatedTotalPrice;
  cart.totalQuantity = updatedTotalQuantity;
  await CartDAL.updateCart(uid, cart);

  Logger.logToDb("delete_cart_item", `${cartItemid} is deleted`, uid);

  return new RollingResponse("item deleted");
}
