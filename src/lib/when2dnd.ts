import { runQuery } from "@/utils/supabase-run";

// Return a random "code" that is abcd-efgh-ijkl-mnop
export function createCode() {
  const randomPart = () =>
    crypto
      .getRandomValues(new Uint8Array(2))
      .reduce((acc, byte) => acc + byte.toString(36), "")
      .substring(0, 4)
      .padEnd(4, "0");
  return `${randomPart()}-${randomPart()}-${randomPart()}-${randomPart()}`;
}

export const getWhen2DnDPollFromCode = (code: string) =>
  runQuery((supabase) => supabase.from("when2dnd_polls").select("*").eq("code", code).single());
