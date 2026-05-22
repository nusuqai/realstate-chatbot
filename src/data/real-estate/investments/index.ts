import crypto from "crypto";
import { TransformFunction, VectorRecord } from "../schema";

type InvestmentInput = Record<string, unknown>;

const toEntries = (payload: unknown): InvestmentInput[] => {
  if (Array.isArray(payload)) return payload as InvestmentInput[];
  if (payload && typeof payload === "object") {
    return [payload as InvestmentInput];
  }
  return [];
};

const stableId = (source: string, record: InvestmentInput): string => {
  const payload = JSON.stringify({ source, record });
  const hash = crypto.createHash("sha1").update(payload).digest("hex");
  return `${source}-${hash}`;
};

const buildRecord = (source: string, entry: InvestmentInput): VectorRecord => {
  const project =
    typeof entry.project === "string" ? entry.project : "Unknown Project";
  const metric = typeof entry.metric === "string" ? entry.metric : undefined;
  const value = typeof entry.value === "number" ? entry.value : undefined;
  const horizonYears =
    typeof entry.horizon_years === "number" ? entry.horizon_years : undefined;
  const riskLevel =
    typeof entry.risk_level === "string" ? entry.risk_level : undefined;
  const notes = typeof entry.notes === "string" ? entry.notes : undefined;

  const deliverySpeedMonths =
    metric === "delivery_speed_months" && value ? value : undefined;

  const text = [
    project,
    metric,
    value !== undefined ? String(value) : "",
    horizonYears !== undefined ? `horizon ${horizonYears}` : "",
    riskLevel,
    notes,
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
      title: project,
      projectType: "investment",
      metric,
      text,
      value,
      horizonYears,
      riskLevel,
      notes,
      deliverySpeedMonths,
      category: "investments",
    },
  };
};

export const transform: TransformFunction = (payload, source) => {
  const warnings: string[] = [];
  const entries = toEntries(payload);

  if (entries.length === 0) {
    warnings.push("No investment records provided.");
  }

  const records = entries.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      warnings.push(`Investment record ${index + 1} is not an object.`);
      return buildRecord(source, {});
    }
    return buildRecord(source, entry);
  });

  return { records, warnings };
};
