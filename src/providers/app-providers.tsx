import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useEffect, useState } from "react";
import { Text, View } from "react-native";

import migrations from "@/drizzle/migrations";
import { migrateDatabase } from "@/src/shared/db/client";
import { backfillEntryDatetime, seedQuestionsIfEmpty } from "@/src/shared/db/seed";

export const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  const [isSeeded, setIsSeeded] = useState(false);
  const [seedError, setSeedError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function prepareDatabase() {
      try {
        await migrateDatabase(migrations);
        await backfillEntryDatetime();
        await seedQuestionsIfEmpty();
        if (isMounted) {
          setIsSeeded(true);
        }
      } catch (error) {
        if (isMounted) {
          setSeedError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    }

    void prepareDatabase();

    return () => {
      isMounted = false;
    };
  }, []);

  if (seedError) {
    return (
      <View>
        <Text>Database setup error: {seedError.message}</Text>
      </View>
    );
  }

  if (!isSeeded) {
    return (
      <View>
        <Text>Database is starting...</Text>
      </View>
    );
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
