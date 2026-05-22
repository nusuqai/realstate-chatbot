import crypto from "crypto";
import { TransformFunction, VectorRecord } from "../schema";

type LocationInput = Record<string, unknown>;

const toEntries = (payload: unknown): LocationInput[] => {
  if (Array.isArray(payload)) return payload as LocationInput[];
  if (payload && typeof payload === "object") {
    return [payload as LocationInput];
  }
  return [];
};

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value))
    return value.map((item) => String(item)).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[,;|]/g)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
};

const stableId = (source: string, record: LocationInput): string => {
  const payload = JSON.stringify({ source, record });
  const hash = crypto.createHash("sha1").update(payload).digest("hex");
  return `${source}-${hash}`;
};

const buildRecord = (source: string, entry: LocationInput): VectorRecord => {
  const name = typeof entry.name === "string" ? entry.name : "Unknown Location";
  const city = typeof entry.city === "string" ? entry.city : undefined;
  const type = typeof entry.type === "string" ? entry.type : undefined;
  const tags = toStringArray(entry.tags);

  const text = [name, city, type, tags.join(" ")].filter(Boolean).join(" | ");

  return {
    id:
      typeof entry.id === "string"
        ? `${String(source).replace(/\./g, "_")}-${entry.id}`
        : stableId(source, entry),
    source,
    text,
    metadata: {
      title: name,
      location: name,
      city,
      projectType: "location",
      locationType: type,
      tags,
      category: "locations",
      text,
    },
  };
};

export const transform: TransformFunction = (payload, source) => {
  const warnings: string[] = [];
  const entries = toEntries(payload);

  if (entries.length === 0) {
    warnings.push("No location records provided.");
  }

  const records = entries.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      warnings.push(`Location record ${index + 1} is not an object.`);
      return buildRecord(source, {});
    }
    return buildRecord(source, entry);
  });

  return { records, warnings };
};
