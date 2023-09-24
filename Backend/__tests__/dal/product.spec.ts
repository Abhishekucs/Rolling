import { ObjectId } from "mongodb";
import * as ProductDAL from "../../src/dal/product";
import * as blob from "../../src/utils/blob-storage";

Date.now = jest.fn(() => 123);
jest.spyOn(blob, "uploadFile").mockImplementation(async () => {
  return ["image1 "];
});
jest.spyOn(blob, "renameImageFile").mockImplementation(async () => {
  return [];
});

describe("ProductDAL", () => {
  it("should create a product", async () => {
    const testProduct: RollingTypes.Product = {
      _id: new ObjectId(),
      category: "tshirt",
      name: "testing tshirt",
      totalSKU: 0,
      variants: [],
      description: ["d1", "d2"],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    const result = await ProductDAL.createProduct(testProduct);
    expect(result.insertedId).toBe(testProduct._id);
  });

  it("should add a variant of the Product", async () => {
    const testProduct: RollingTypes.Product = {
      _id: new ObjectId(),
      category: "tshirt",
      name: "testing tshirt",
      totalSKU: 0,
      variants: [],
      description: ["d1", "d2"],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    const result = await ProductDAL.createProduct(testProduct);
    const productId = result.insertedId;

    const res = await ProductDAL.createVariation(
      [new Map([["s", 0]])],
      "black",
      testProduct.name,
      [],
      0,
      599,
      productId.toString(),
    );

    const product = await ProductDAL.getProductById(productId.toString());

    expect(product.variants.length).toBe(1);
    expect(res.variantId.toString()).toBe(product.variants[0]._id.toString());
  });

  it("should update the product", async () => {
    const testProduct: RollingTypes.Product = {
      _id: new ObjectId(),
      category: "tshirt",
      name: "testing tshirt",
      totalSKU: 0,
      variants: [],
      description: ["d1", "d2"],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    const result = await ProductDAL.createProduct(testProduct);
    const productId = result.insertedId;

    await ProductDAL.updateProduct(
      "newName",
      testProduct.name,
      ["des1"],
      productId.toString(),
    );

    const product = await ProductDAL.getProductById(productId.toString());

    expect(product.name).toBe("newName");
    expect(product.description).toStrictEqual(["des1"]);
  });

  it("should update variant of a product", async () => {
    const testProduct: RollingTypes.Product = {
      _id: new ObjectId(),
      category: "tshirt",
      name: "testing tshirt",
      totalSKU: 0,
      variants: [],
      description: ["d1", "d2"],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    const result = await ProductDAL.createProduct(testProduct);
    const productId = result.insertedId;

    const res = await ProductDAL.createVariation(
      [new Map([["s", 0]])],
      "black",
      testProduct.name,
      [],
      0,
      599,
      productId.toString(),
    );

    await ProductDAL.updateVariant(
      [new Map([["s", 1]])],
      699,
      [],
      res.variantId.toString(),
      productId.toString(),
    );

    const product = await ProductDAL.getProductById(productId.toString());
    const variant = product.variants[0];

    expect(variant.sizes[0]["s"]).toBe(1);
    expect(variant.price).toBe(699);
  });
});
