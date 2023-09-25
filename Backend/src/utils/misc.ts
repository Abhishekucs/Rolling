import uaparser from "ua-parser-js";

export function matchesAPattern(text: string, pattern: string): boolean {
  const regex = new RegExp(`^${pattern}$`);
  return regex.test(text);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function identity(value: any): string {
  return Object.prototype.toString
    .call(value)
    .replace(/^\[object\s+([a-z]+)\]$/i, "$1")
    .toLowerCase();
}

export function updateRecordArray(
  firstArray: Record<string, number>[],
  secondArray: Record<string, number>[],
): Record<string, number>[] {
  const secondArrayMap = new Map(
    secondArray.map((item) => [Object.keys(item)[0], Object.values(item)[0]]),
  );

  // Merge the elements from the second array into the first array
  const mergedArray = firstArray.map((item) => {
    const key = Object.keys(item)[0];
    const value = secondArrayMap.get(key);
    if (value !== undefined) {
      // If the key exists in the second array, update the value
      return { [key]: parseInt(value as unknown as string, 10) };
    } else {
      // If the key doesn't exist in the second array, keep the original element
      return item;
    }
  });

  return mergedArray;
}

export function sumAllRecordValue(value: Record<string, number>[]): number {
  const result = value.reduce((accumulator, currentSize) => {
    const sizeValues = Object.values(currentSize);
    if (sizeValues.length > 0) {
      // Add the first (and only) number in the current size record
      const sizeNumber = sizeValues[0];
      return accumulator + sizeNumber;
    }
    return accumulator;
  }, 0);

  return parseInt(result as unknown as string, 10);
}

export function transformData(
  data: { [key: string]: string }[],
): { [key: string]: number }[] {
  const transformedData = data.map((item) => {
    const key = Object.keys(item)[0]; // Extract the key
    const value = Number(item[key]); // Convert the value to a number
    return { [key]: value }; // Create the desired object format
  });

  return transformedData;
}

export function sumAllObjectValue(data: { [key: string]: number }[]): number {
  const result = data.reduce<number>((accumulator, obj) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        accumulator += obj[key];
      }
    }
    return accumulator;
  }, 0);

  return result;
}

export function padNumbers(
  numbers: number[],
  maxLength: number,
  fillString: string,
): string[] {
  return numbers.map((number) =>
    number.toString().padStart(maxLength, fillString),
  );
}

interface AgentLog {
  ip: string | string[];
  agent: string;
  device?: string;
}

export function buildAgentLog(req: RollingTypes.Request): AgentLog {
  const agent = uaparser(req.headers["user-agent"]);

  const agentLog: AgentLog = {
    ip:
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.ip ||
      "255.255.255.255",
    agent: `${agent.os.name} ${agent.os.version} ${agent.browser.name} ${agent.browser.version}`,
  };

  const {
    device: { vendor, model, type },
  } = agent;
  if (vendor) {
    agentLog.device = `${vendor} ${model} ${type}`;
  }

  return agentLog;
}
