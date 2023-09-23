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
