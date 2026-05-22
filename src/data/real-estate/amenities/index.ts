import crypto from "crypto";
import { TransformFunction, VectorRecord } from "../schema";

type AmenityInput = Record<string, unknown>;

const toEntries = (payload: unknown): AmenityInput[] => {
  if (Array.isArray(payload)) return payload as AmenityInput[];
  if (payload && typeof payload === "object") {
    return [payload as AmenityInput];
  }
  return [];
};

const stableId = (source: string, record: AmenityInput): string => {
  const payload = JSON.stringify({ source, record });
  const hash = crypto.createHash("sha1").update(payload).digest("hex");
  return `${source}-${hash}`;
};

const buildRecord = (source: string, entry: AmenityInput): VectorRecord => {
  const name = typeof entry.name === "string" ? entry.name : "Unknown Amenity";
  const category =
    typeof entry.category === "string" ? entry.category : undefined;

  const text = [name, category].filter(Boolean).join(" | ");

  return {
    id:
      typeof entry.id === "string"
        ? `${String(source).replace(/\./g, "_")}-${entry.id}`
        : stableId(source, entry),
    source,
    text,
    metadata: {
      title: name,
      projectType: "amenity",
      category: "amenities",
      text,
      amenityCategory: category,
      tags: category ? [category] : [],
    },
  };
};

export const transform: TransformFunction = (payload, source) => {
  const warnings: string[] = [];
  const entries = toEntries(payload);

  if (entries.length === 0) {
    warnings.push("No amenity records provided.");
  }

  const records = entries.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      warnings.push(`Amenity record ${index + 1} is not an object.`);
      return buildRecord(source, {});
    }
    return buildRecord(source, entry);
  });

  return { records, warnings };
};
