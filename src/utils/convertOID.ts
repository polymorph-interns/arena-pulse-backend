import { Types } from "mongoose";

export function convertOidFields(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertOidFields);
  }

  if (obj !== null && typeof obj === "object") {
    // Handle $oid
    if (Object.keys(obj).length === 1 && "$oid" in obj) {
      return new Types.ObjectId(obj["$oid"]);
    }

    // Recurse into other object fields
    const converted: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertOidFields(value);
    }
    return converted;
  }

  // Primitive value (string, number, etc.)
  return obj;
}
