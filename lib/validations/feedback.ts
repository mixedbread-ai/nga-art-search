import { z } from "zod";

export const feedbackSchema = z
  .object({
    rating: z.enum(["good", "okay", "bad"]).nullable().optional(),
    message: z
      .string()
      .max(500, "Message must be at most 500 characters.")
      .optional(),
  })
  .refine(
    (data) => data.rating || (data.message && data.message.trim().length > 0),
    {
      message: "Please provide a rating or message",
      path: ["rating"],
    },
  );

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export const RATINGS = [
  { value: "good" as const, emoji: "😊", label: "Good" },
  { value: "okay" as const, emoji: "😐", label: "Okay" },
  { value: "bad" as const, emoji: "😞", label: "Bad" },
] as const;
