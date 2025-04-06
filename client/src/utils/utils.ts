export function dummy() {
  console.log("I am a dummy function 🏖️");
}

export const deepCopy = <T>(obj: T): T => structuredClone(obj);

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(`Expected 'val' to be defined, but received ${val}`);
  }
}

export function assertNotNull<T>(
  param: T | null | undefined,
  message?: string
) {
  if (param == null) {
    throw new Error(message || "value cannot be null");
  }

  if (param == undefined) {
    throw new Error(message || "value cannot be undefined");
  }
}
