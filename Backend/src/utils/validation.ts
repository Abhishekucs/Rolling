import _ from "lodash";
import { profanities, regexProfanities } from "../constants/profanities";
import { matchesAPattern } from "./misc";
import { validate as uuidValidate, version as uuidVersion } from "uuid";

export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

const VALID_NAME_PATTERN = /^[a-zA-Z. ]+$/;
const PINCODE_PATTERN = /^[1-9][0-9]{5}$/;
const INDIAN_MOBILE_NUMBER = /^[6-9]\d{9}$/;

export function isUsernameValid(name: string): boolean {
  if (_.isNil(name) || !inRange(name.length, 1, 100)) {
    return false;
  }

  const normalizedName = name.toLowerCase();

  const beginsWithPeriod = /^\..*/.test(normalizedName);
  if (beginsWithPeriod) {
    return false;
  }

  const isProfanity = profanities.find((profanity) =>
    normalizedName.includes(profanity),
  );
  if (isProfanity) {
    return false;
  }

  return VALID_NAME_PATTERN.test(name);
}

export function isValidPincode(pincode: number): boolean {
  if (_.isNil(pincode)) {
    return false;
  }
  const pincodeInString = pincode.toString();
  if (!inRange(pincodeInString.length, 6, 6)) {
    return false;
  }

  return PINCODE_PATTERN.test(pincodeInString);
}

export function isValidMobileNumber(mobileNumber: number): boolean {
  if (_.isNil(mobileNumber)) {
    return false;
  }
  const mobileNumberInString = mobileNumber.toString();

  if (!inRange(mobileNumberInString.length, 10, 10)) {
    return false;
  }

  return INDIAN_MOBILE_NUMBER.test(mobileNumberInString);
}

export function containsProfanity(text: string): boolean {
  const normalizedText = text
    .toLowerCase()
    .split(/[.,"/#!?$%^&*;:{}=\-_`~()\s\n]+/g);

  const hasProfanity = regexProfanities.some((profanity) => {
    return normalizedText.some((word) => {
      return matchesAPattern(word, profanity);
    });
  });

  return hasProfanity;
}

export function isValidUuidV4(id: string): boolean {
  if (_.isNil(id)) {
    return false;
  }
  return uuidValidate(id) && uuidVersion(id) === 4;
}
