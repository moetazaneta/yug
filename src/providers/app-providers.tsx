import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { type PropsWithChildren, useEffect, useState } from "react";
import { Text, View } from "react-native";

import migrations from "@/drizzle/migrations";
import { db } from "@/src/shared/db/client";
import { backfillEntryDatetime, seedQuestionsIfEmpty } from "@/src/shared/db/seed";

export const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  const [isSeeded, setIsSeeded] = useState(false);
  const [seedError, setSeedError] = useState<Error | null>(null);
  const { success, error: migrationError } = useMigrations(db, migrations);

  useDrizzleStudio(db.$client);

  useEffect(() => {
    if (!success) {
      return;
    }

    let isMounted = true;

    async function prepareDatabase() {
      try {
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
  }, [success]);

  if (migrationError) {
    return (
      <View>
        <Text>Migration error: {migrationError.message}</Text>
      </View>
    );
  }

  if (seedError) {
    return (
      <View>
        <Text>Database setup error: {seedError.message}</Text>
      </View>
    );
  }

  if (!success || !isSeeded) {
    return (
      <View>
        <Text>Database is starting...</Text>
      </View>
    );
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
