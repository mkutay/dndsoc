import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { errAsync, fromSafePromise, okAsync } from "neverthrow";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/database.types";

export type SupabaseQueryError = {
  message: string;
  code: "DATABASE_ERROR";
};

export type QueryBuilder<R> = (client: SupabaseClient<Database>) => PromiseLike<R>;

/* for general queries */
export const handleSupabaseResponse = <T>({ error, data }: PostgrestSingleResponse<T>, caller?: string) => !error
  ? okAsync(data as T)
  : errAsync({
      message: `Database query failed${caller ? ` in ${caller}` : ''}: ${error.message} (${error.code})`,
      code: "DATABASE_ERROR",
    } as SupabaseQueryError);

export const supabaseRun = <T>(query: PromiseLike<PostgrestSingleResponse<T>>, caller?: string) =>
  fromSafePromise(query)
  .andThen(response => handleSupabaseResponse(response, caller));

export const runQuery = <T>(queryBuilder: QueryBuilder<PostgrestSingleResponse<T>>, caller?: string) => 
  createClient().andThen(client => supabaseRun(queryBuilder(client), caller));