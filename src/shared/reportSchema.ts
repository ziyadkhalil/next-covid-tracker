import { z } from "zod";

const symptomValidation = z.union([
  z.literal("Fever or chills"),
  z.literal("Cough"),
  z.literal("Shortness of breath or difficulty breathing"),
  z.literal("Fatigue"),
  z.literal("Muscle or body aches"),
  z.literal("Headache"),
  z.literal("New loss of taste or smell"),
  z.literal("Sore throat"),
  z.literal("Congestion or runny nose"),
  z.literal("Nausea or vomiting"),
  z.literal("Diarrhea"),
]);

export const reportSchema = z.object({
  temperature: z.number().min(36).max(42),
  symptoms: z.array(symptomValidation),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2),
  }),
});

export type ReportParams = z.infer<typeof reportSchema>;
