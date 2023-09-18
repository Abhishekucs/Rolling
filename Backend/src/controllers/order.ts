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

    let amount = 0;
    _.forEach(cart, (item) => (amount += item.price * item.quantity));

    const totalItems = cart.length;

    const razorpayOrder = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcptid_01",
    };

    const orderRes = await razorpayInstance.orders.create(razorpayOrder);

    const order: RollingTypes.Order = {
      orderId: orderRes.id,
      amount: parseInt(orderRes.amount as string, 10), //smallest currency unit (paisa)
      totalItems,
      products: cart,
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
    };

    await OrderDAL.createOrder(uid, order);

    return new RollingResponse("order created", {
      orderId: order.orderId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
