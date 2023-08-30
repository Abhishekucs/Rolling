import _ from "lodash";

interface Status {
  code: number;
  message: string;
}

interface Statuses {
  MISSING_KEY_DATA: Status;
}

const statuses: Statuses = {
  MISSING_KEY_DATA: {
    code: 461,
    message: "missing key data",
  },
};

const CUSTOM_STATUS_CODES = new Set(
  _.map(statuses, (status: Status) => status.code)
);

export function isCustomCode(code: number): boolean {
  return CUSTOM_STATUS_CODES.has(code);
}

export default statuses;
