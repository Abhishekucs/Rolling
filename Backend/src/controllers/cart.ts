import { RollingResponse } from "../utils/rolling-response";
import _ from "lodash";
import * as CartDAL from "../dal/cart";
import { v4 as uuidv4 } from "uuid";
import Logger from "../utils/logger";
import RollingError from "../utils/error";

export async function addToCart(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const { productId, variantId, price, quantity, size, name } = req.body;

  try {
    const cart = await CartDAL.getCart(uid);

    const productIndex = _.findIndex(cart, { variantId });

    if (productIndex > -1 && cart[productIndex].size === (size as string)) {
      //product exists in the cart, update the quantity

      let productQuantity = parseInt(quantity as string, 10);
      productQuantity = productQuantity + cart[productIndex].quantity;
      const cartItem = cart[productIndex];

      await CartDAL.updateCartItem(uid, cartItem._id, {
        quantity: productQuantity,
      });
    } else {
      //product does not exists in cart, add new item

      // get product variant from database and update the imageurl
      const item: RollingTypes.CartItem = {
        _id: uuidv4(),
        productId,
        variantId,
        price: parseInt(price as string, 10),
        quantity: parseInt(quantity as string, 10),
        size,
        productName: name,
        imageUrl: "",
      };

      await CartDAL.createCartItem(uid, item);
    }
    return new RollingResponse("cart created");
  } catch (error) {
    if (error instanceof RollingError) {
      if (error.message === "cart is empty") {
        // cart doesnot exists for user , create new cart
        const item: RollingTypes.CartItem = {
          _id: uuidv4(),
          productId,
          variantId,
          price: parseInt(price as string, 10),
          quantity: parseInt(quantity as string, 10),
          size,
          productName: name,
          imageUrl: "",
        };

        await CartDAL.createCartItem(uid, item);

        Logger.logToDb(
          "addToCart",
          `${uid} added product with ${productId}`,
          uid,
        );

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

  if (quantity) {
    await CartDAL.updateCartItem(uid, cartItemId, {
      quantity: parseInt(quantity as string, 10),
    });
  }

  if (size) {
    await CartDAL.updateCartItem(uid, cartItemId, { size });
  }

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

  await CartDAL.deleteCartItem(uid, cartItemid);

  Logger.logToDb("delete_cart_item", `${cartItemid} is deleted`, uid);

  return new RollingResponse("item deleted");
}
