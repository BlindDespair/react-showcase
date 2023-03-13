export function isRecordWithProperties<K extends readonly string[]>(
  value: unknown,
  properties: K
): value is Record<K[number], unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    properties.every((prop) => value.hasOwnProperty(prop))
  );
}
