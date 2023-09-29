import Rolling from "@/init/api";
import { setLoadingStatus } from "@/redux/slices/loading";
import { setProduct } from "@/redux/slices/product";

export async function getProducts(): Promise<void> {
  setLoadingStatus(true);

  const products = await Rolling.product.getProducts({
    category: "",
    filter: "",
    color: "",
    skip: 0,
    limit: 50,
  });

  if (products.status !== 200) {
    setLoadingStatus(false);
    // Add error showing widget here
  } else {
    setProduct(products.data);
    setLoadingStatus(false);
  }
}
