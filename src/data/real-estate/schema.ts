import { z } from "zod";

export type ChartType = "bar" | "line" | "table";

export type ChartSeriesPoint = {
  x: string;
  y: number;
};

export type ChartSeries = {
  name: string;
  data: ChartSeriesPoint[];
};

export type ChartSpec = {
  chartType: ChartType;
  title: string;
  xField: string;
  yField: string;
  series: ChartSeries[];
  unit: string | null;
  notes: string | null;
};

export type AgentUiResponse = {
  text: string;
  charts: ChartSpec[];
  highlights: string[] | null;
  sources: Array<{
    id: string;
    title: string | null;
    source: string | null;
    score: number | null;
  }> | null;
  followUpQuestions: string[] | null;
};

export type VectorRecord = {
  id: string;
  source: string;
  text: string;
  metadata: Record<string, unknown>;
};

export type TransformResult = {
  records: VectorRecord[];
  warnings: string[];
};

export type TransformFunction = (
  payload: unknown,
  source: string,
) => TransformResult;

export const ChartSeriesPointSchema = z.object({
  x: z.string(),
  y: z.number(),
});

export const ChartSeriesSchema = z.object({
  name: z.string(),
  data: z.array(ChartSeriesPointSchema),
});

export const ChartSpecSchema = z.object({
  chartType: z.enum(["bar", "line", "table"]),
  title: z.string(),
  xField: z.string(),
  yField: z.string(),
  series: z.array(ChartSeriesSchema),
  unit: z.string().nullable(),
  notes: z.string().nullable(),
});

export const AgentSourceSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  source: z.string().nullable(),
  score: z.number().nullable(),
});

export const AgentUiResponseSchema = z.object({
  text: z.string(),
  charts: z.array(ChartSpecSchema).nullable(),
  highlights: z.array(z.string()).nullable(),
  sources: z.array(AgentSourceSchema).nullable(),
  followUpQuestions: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe(
      "Generate 3 to 5 short, specific follow-up questions the user might want to ask next, based on the retrieved context and the current answer.",
    )
    .nullable(),
});
