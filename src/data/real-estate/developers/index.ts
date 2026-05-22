import crypto from "crypto";
import { TransformFunction, VectorRecord } from "../schema";

type DeveloperInput = Record<string, unknown>;

const toEntries = (payload: unknown): DeveloperInput[] => {
  if (Array.isArray(payload)) return payload as DeveloperInput[];
  if (payload && typeof payload === "object") {
    return [payload as DeveloperInput];
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

const stableId = (source: string, record: DeveloperInput): string => {
  const payload = JSON.stringify({ source, record });
  const hash = crypto.createHash("sha1").update(payload).digest("hex");
  return `${source}-${hash}`;
};

const buildRecord = (source: string, entry: DeveloperInput): VectorRecord => {
  const name =
    typeof entry.name === "string" ? entry.name : "Unknown Developer";
  const city = typeof entry.city === "string" ? entry.city : undefined;
  const focus = toStringArray(entry.focus);
  const tags = toStringArray(entry.tags);
  const rating = typeof entry.rating === "number" ? entry.rating : undefined;
  const founded = typeof entry.founded === "number" ? entry.founded : undefined;

  const text = [
    name,
    city,
    focus.join(" "),
    tags.join(" "),
    rating ? `rating ${rating}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    id:
      typeof entry.id === "string"
        ? `${String(source).replace(/\./g, "_")}-${entry.id}`
        : stableId(source, entry),
    source,
    text,
    metadata: {
      title: name,
      developer: name,
      city,
      rating,
      tags,
      focus,
      founded,
      text,
      category: "developers",
    },
  };
};

export const transform: TransformFunction = (payload, source) => {
  const warnings: string[] = [];
  const entries = toEntries(payload);

  if (entries.length === 0) {
    warnings.push("No developer records provided.");
  }

  const records = entries.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      warnings.push(`Developer record ${index + 1} is not an object.`);
      return buildRecord(source, {});
    }
    return buildRecord(source, entry);
  });

  return { records, warnings };
};
