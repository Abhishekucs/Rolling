import { ObjectId } from "mongodb";
import * as ProductDAL from "../../src/dal/product";
import * as blob from "../../src/utils/blob-storage";
import _ from "lodash";

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

  it("should get all the products", async () => {
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

    await ProductDAL.createVariation(
      [new Map([["s", 0]])],
      "black",
      testProduct.name,
      [],
      0,
      599,
      productId.toString(),
    );

    const product = await ProductDAL.getProducts();

    expect(product.length).toBe(1);
  });

  it("should get all the products with filter", async () => {
    const testProducts: RollingTypes.Product[] = [
      {
        _id: new ObjectId(),
        category: "tshirt",
        name: "testing tshirt",
        totalSKU: 0,
        variants: [],
        description: ["d1", "d2"],
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      },
      {
        _id: new ObjectId(),
        category: "hoodie",
        name: "testing hoodie",
        totalSKU: 0,
        variants: [],
        description: ["d1", "d2"],
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      },
      {
        _id: new ObjectId(),
        category: "hoodie",
        name: "testing2 hoodie",
        totalSKU: 0,
        variants: [],
        description: ["d1", "d2"],
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      },
      {
        _id: new ObjectId(),
        category: "tshirt",
        name: "testing2 tshirt",
        totalSKU: 0,
        variants: [],
        description: ["d1", "d2"],
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      },
    ];

    await Promise.all(
      _.map(testProducts, async (testProduct) => {
        const result = await ProductDAL.createProduct(testProduct);
        const productId = result.insertedId;

        await ProductDAL.createVariation(
          [new Map([["s", 0]])],
          testProduct.category === "tshirt" ? "black" : "white",
          testProduct.name,
          [],
          0,
          testProduct.category === "tshirt" ? 599 : 1999,
          productId.toString(),
        );
      }),
    );

    const product = await ProductDAL.getProducts({
      skip: 0,
      limit: 50,
      category: "hoodie",
      sortBy: "old",
      color: "white",
    });

    expect(product.length).toBe(2);
    expect(product[0]["name"]).toBe("testing hoodie");
  });
});
