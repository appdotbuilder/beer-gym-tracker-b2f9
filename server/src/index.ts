import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createSpendingEntryInputSchema, 
  updateSpendingEntryInputSchema 
} from './schema';

// Import handlers
import { createSpendingEntry } from './handlers/create_spending_entry';
import { getSpendingEntries } from './handlers/get_spending_entries';
import { updateSpendingEntry } from './handlers/update_spending_entry';
import { deleteSpendingEntry } from './handlers/delete_spending_entry';
import { getSpendingSummary } from './handlers/get_spending_summary';
import { getCategoryTotals } from './handlers/get_category_totals';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Create a new spending entry
  createSpendingEntry: publicProcedure
    .input(createSpendingEntryInputSchema)
    .mutation(({ input }) => createSpendingEntry(input)),
  
  // Get all spending entries
  getSpendingEntries: publicProcedure
    .query(() => getSpendingEntries()),
  
  // Update an existing spending entry
  updateSpendingEntry: publicProcedure
    .input(updateSpendingEntryInputSchema)
    .mutation(({ input }) => updateSpendingEntry(input)),
  
  // Delete a spending entry by ID
  deleteSpendingEntry: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteSpendingEntry(input.id)),
  
  // Get spending summary with totals and conclusion
  getSpendingSummary: publicProcedure
    .query(() => getSpendingSummary()),
  
  // Get category totals only
  getCategoryTotals: publicProcedure
    .query(() => getCategoryTotals()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();