import crypto from "crypto";
import { TransformFunction, VectorRecord } from "../schema";

type ProjectInput = Record<string, unknown>;

const toEntries = (payload: unknown): ProjectInput[] => {
  if (Array.isArray(payload)) return payload as ProjectInput[];
  if (payload && typeof payload === "object") {
    return [payload as ProjectInput];
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

const stableId = (source: string, record: ProjectInput): string => {
  const payload = JSON.stringify({ source, record });
  const hash = crypto.createHash("sha1").update(payload).digest("hex");
  return `${source}-${hash}`;
};

const computeDeliverySpeedMonths = (
  deliveryDate?: string,
): number | undefined => {
  if (!deliveryDate) return undefined;
  const delivery = new Date(deliveryDate);
  if (Number.isNaN(delivery.getTime())) return undefined;
  const now = new Date();
  const diffMs = delivery.getTime() - now.getTime();
  const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30);
  if (!Number.isFinite(diffMonths)) return undefined;
  return Math.max(0, Math.round(diffMonths));
};

const buildRecord = (source: string, entry: ProjectInput): VectorRecord => {
  const name = typeof entry.name === "string" ? entry.name : "Untitled Project";
  const developer =
    typeof entry.developer === "string" ? entry.developer : undefined;
  const location =
    typeof entry.location === "string" ? entry.location : undefined;
  const city = typeof entry.city === "string" ? entry.city : undefined;
  const projectType =
    typeof entry.project_type === "string" ? entry.project_type : undefined;
  const priceMin =
    typeof entry.price_min === "number" ? entry.price_min : undefined;
  const priceMax =
    typeof entry.price_max === "number" ? entry.price_max : undefined;
  const deliveryDate =
    typeof entry.delivery_date === "string" ? entry.delivery_date : undefined;
  const deliverySpeedMonths = computeDeliverySpeedMonths(deliveryDate);
  const rating = typeof entry.rating === "number" ? entry.rating : undefined;
  const tags = toStringArray(entry.tags);

  const text = [
    name,
    developer,
    location,
    city,
    projectType,
    tags.join(" "),
    priceMin ? `price_min ${priceMin}` : "",
    priceMax ? `price_max ${priceMax}` : "",
    deliveryDate ? `delivery ${deliveryDate}` : "",
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
      developer,
      location,
      city,
      projectType,
      priceMin,
      priceMax,
      deliveryDate,
      deliverySpeedMonths,
      rating,
      tags,
      text,
      category: "projects",
    },
  };
};

export const transform: TransformFunction = (payload, source) => {
  const warnings: string[] = [];
  const entries = toEntries(payload);

  if (entries.length === 0) {
    warnings.push("No project records provided.");
  }

  const records = entries.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      warnings.push(`Project record ${index + 1} is not an object.`);
      return buildRecord(source, {});
    }
    return buildRecord(source, entry);
  });

  return { records, warnings };
};
