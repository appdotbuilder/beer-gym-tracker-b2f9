import { z } from 'zod';

// Category enum schema
export const categorySchema = z.enum(['Beer', 'Gym']);
export type Category = z.infer<typeof categorySchema>;

// Spending entry schema
export const spendingEntrySchema = z.object({
  id: z.number(),
  category: categorySchema,
  amount: z.number(),
  date: z.coerce.date(),
  description: z.string().nullable(),
  created_at: z.coerce.date()
});

export type SpendingEntry = z.infer<typeof spendingEntrySchema>;

// Input schema for creating spending entries
export const createSpendingEntryInputSchema = z.object({
  category: categorySchema,
  amount: z.number().positive(), // Validate that amount is positive
  date: z.coerce.date(),
  description: z.string().nullable() // Explicit null allowed, undefined not allowed
});

export type CreateSpendingEntryInput = z.infer<typeof createSpendingEntryInputSchema>;

// Input schema for updating spending entries
export const updateSpendingEntryInputSchema = z.object({
  id: z.number(),
  category: categorySchema.optional(),
  amount: z.number().positive().optional(),
  date: z.coerce.date().optional(),
  description: z.string().nullable().optional() // Can be null or undefined
});

export type UpdateSpendingEntryInput = z.infer<typeof updateSpendingEntryInputSchema>;

// Category totals schema for aggregated data
export const categoryTotalsSchema = z.object({
  Beer: z.number(),
  Gym: z.number()
});

export type CategoryTotals = z.infer<typeof categoryTotalsSchema>;

// Summary schema with conclusion
export const spendingSummarySchema = z.object({
  totals: categoryTotalsSchema,
  conclusion: z.enum(['alcoholic', 'fitness_enthusiast', 'balanced'])
});

export type SpendingSummary = z.infer<typeof spendingSummarySchema>;