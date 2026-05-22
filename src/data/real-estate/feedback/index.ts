import crypto from "crypto";
import { TransformFunction, VectorRecord } from "../schema";

type FeedbackInput = Record<string, unknown>;

const toEntries = (payload: unknown): FeedbackInput[] => {
  if (Array.isArray(payload)) return payload as FeedbackInput[];
  if (payload && typeof payload === "object") {
    return [payload as FeedbackInput];
  }
  return [];
};

const stableId = (source: string, record: FeedbackInput): string => {
  const payload = JSON.stringify({ source, record });
  const hash = crypto.createHash("sha1").update(payload).digest("hex");
  return `${source}-${hash}`;
};

const buildRecord = (source: string, entry: FeedbackInput): VectorRecord => {
  const project =
    typeof entry.project === "string" ? entry.project : "Unknown Project";
  const rating = typeof entry.rating === "number" ? entry.rating : undefined;
  const sentiment =
    typeof entry.sentiment === "string" ? entry.sentiment : undefined;
  const comment = typeof entry.comment === "string" ? entry.comment : undefined;

  const text = [project, sentiment, rating ? `rating ${rating}` : "", comment]
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
      title: project,
      rating,
      sentiment,
      text,
      reviews: comment ? [comment] : [],
      category: "feedback",
    },
  };
};

export const transform: TransformFunction = (payload, source) => {
  const warnings: string[] = [];
  const entries = toEntries(payload);

  if (entries.length === 0) {
    warnings.push("No feedback records provided.");
  }

  const records = entries.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      warnings.push(`Feedback record ${index + 1} is not an object.`);
      return buildRecord(source, {});
    }
    return buildRecord(source, entry);
  });

  return { records, warnings };
};
