import _ from "lodash";
import * as misc from "../../src/utils/misc";

describe("Misc Utils", () => {
  it("sumAllRecordValues", () => {
    const testCases = [
      {
        records: [{ value: 1 }, { value: 2 }, { value: 3 }],
        expected: 6,
      },
      {
        records: [],
        expected: 0,
      },
    ];

    testCases.forEach((testcase) => {
      expect(misc.sumAllRecordValue(testcase.records)).toBe(testcase.expected);
    });
  });

  it("updateRecordArray - (should update values in the first array based on keys from the second array)", () => {
    const testCases: {
      firstArray: Record<string, number>[];
      secondArray: Record<string, number>[];
      expected: Record<string, number>[];
    }[] = [
      {
        firstArray: [{ key1: 1 }, { key2: 2 }, { key3: 3 }],
        secondArray: [{ key1: 10 }, { key2: 20 }, { key4: 40 }],

        expected: [{ key1: 10 }, { key2: 20 }, { key3: 3 }],
      },
      {
        firstArray: [],
        secondArray: [],

        expected: [],
      },
      {
        firstArray: [{ key1: 1 }, { key2: 2 }, { key3: 3 }],
        secondArray: [{ key1: 10 }, { key4: 40 }],

        expected: [{ key1: 10 }, { key2: 2 }, { key3: 3 }],
      },
      {
        firstArray: [],
        secondArray: [{ key1: 10 }, { key2: 20 }],

        expected: [],
      },
    ];

    testCases.forEach((testcase) => {
      expect(
        misc.updateRecordArray(testcase.firstArray, testcase.secondArray),
      ).toStrictEqual(testcase.expected);
    });
  });

  it("identity", () => {
    const testCases = [
      {
        input: "",
        expected: "string",
      },
      {
        input: {},
        expected: "object",
      },
      {
        input: 0,
        expected: "number",
      },
      {
        input: null,
        expected: "null",
      },
      {
        input: undefined,
        expected: "undefined",
      },
    ];

    _.each(testCases, ({ input, expected }) => {
      expect(misc.identity(input)).toEqual(expected);
    });
  });
});
