import * as Validation from "../../src/utils/validation";

describe("Validation", () => {
  it("inRange", () => {
    const testCases = [
      {
        value: 1,
        min: 1,
        max: 2,
        expected: true,
      },
      {
        value: 1,
        min: 2,
        max: 2,
        expected: false,
      },
      {
        value: 1,
        min: 1,
        max: 1,
        expected: true,
      },
      {
        value: 53,
        min: -100,
        max: 100,
        expected: true,
      },
      {
        value: 153,
        min: -100,
        max: 100,
        expected: false,
      },
    ];

    testCases.forEach((testCase) => {
      expect(
        Validation.inRange(testCase.value, testCase.min, testCase.max),
      ).toBe(testCase.expected);
    });
  });

  it("isValidPincode", () => {
    const testCases = [
      {
        value: 0,
        expected: false,
      },
      {
        value: 823001,
        expected: true,
      },
      {
        value: 1234,
        expected: false,
      },
      {
        value: 123456,
        expected: false,
      },
      {
        value: 111111,
        expected: false,
      },
      {
        value: 90000000,
        expected: false,
      },
      {
        value: 400001,
        expected: true,
      },
    ];

    testCases.forEach((testCase) => {
      expect(Validation.isValidPincode(testCase.value)).toBe(testCase.expected);
    });
  });

  it("isValidUsername", () => {
    const testCases = [
      {
        name: "Miodec",
        expected: false,
      },
      {
        name: "fucker",
        expected: false,
      },
      {
        name: "Bruce",
        expected: true,
      },
      {
        name: "Rizwan_123",
        expected: true,
      },
      {
        name: "Fe-rotiq._123._",
        expected: true,
      },
      {
        name: " ",
        expected: false,
      },
      {
        name: "",
        expected: false,
      },
      {
        name: "superduperlongnamethatshouldbeinvalid",
        expected: false,
      },
      {
        name: ".period",
        expected: false,
      },
      {
        name: "fucking_profane",
        expected: false,
      },
    ];

    testCases.forEach((testCase) => {
      expect(Validation.isUsernameValid(testCase.name)).toBe(testCase.expected);
    });
  });

  it("containsProfanity", () => {
    const testCases = [
      {
        text: "https://www.fuckyou.com",
        expected: true,
      },
      {
        text: "Hello world!",
        expected: false,
      },
      {
        text: "I fucking hate you",
        expected: true,
      },
      {
        text: "I love you",
        expected: false,
      },
      {
        text: "\n.fuck!",
        expected: true,
      },
    ];

    testCases.forEach((testCase) => {
      expect(Validation.containsProfanity(testCase.text)).toBe(
        testCase.expected,
      );
    });
  });

  it("isValidMobileNumber", () => {
    const testCases = [
      {
        number: 0,
        expected: false,
      },
      {
        number: 123456,
        expected: false,
      },
      {
        number: 1111111111,
        expected: false,
      },
      {
        number: 7428731249,
        expected: true,
      },
      {
        number: 8044662924,
        expected: true,
      },
      {
        number: 6294044841,
        expected: true,
      },
      {
        number: 7313102652,
        expected: true,
      },
      {
        number: 0o000000000,
        expected: false,
      },
    ];

    testCases.forEach((testCase) => {
      expect(Validation.isValidMobileNumber(testCase.number)).toBe(
        testCase.expected,
      );
    });
  });
});
