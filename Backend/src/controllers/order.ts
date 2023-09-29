import _ from "lodash";
import { getAddressById } from "../dal/address";
import { getCart } from "../dal/cart";
import { RollingResponse } from "../utils/rolling-response";
import razorpayInstance from "../init/razorpay";
import * as OrderDAL from "../dal/order";

export async function createOrder(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid, email } = req.ctx.decodedToken;
  const { addressId } = req.query;
  try {
    const cart = await getCart(uid);
    const address = await getAddressById(uid, addressId as string);

    const razorpayOrder = {
      amount: cart.totalPrice * 100,
      currency: "INR",
      receipt: "order_rcptid_01", // TODO: look for a system for reciept generation
    };
    const orderRes = await razorpayInstance.orders.create(razorpayOrder);

    const order: RollingTypes.Order = {
      razorpayOrderId: orderRes.id,
      amount: parseInt(orderRes.amount as string, 10), //smallest currency unit (paisa)
      totalItems: cart.totalQuantity,
      products: cart.items,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      paymentAttempts: orderRes.attempts,
      status: orderRes.status,
      address,
      paymentId: "",
      paymentMethod: "none",
      paymentStatus: "none",
      tax: 0,
      contact: {
        mobileNumber: address.mobileNumber,
        email,
      },
      uid,
    };
    await OrderDAL.createOrder(order);
    return new RollingResponse("order created", {
      razorpayOrderId: order.razorpayOrderId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
