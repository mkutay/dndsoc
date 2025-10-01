import fs from "fs";
import z, { safeParse } from "zod";

const file = "./scripts/freshers-event/timed.json";
const data = JSON.parse(fs.readFileSync(file, "utf-8")) as {
  email: string;
  name: string;
  session: string;
  choice: 1 | 2;
}[];

let emails: string[] = [];
const email = z.email();

const sessions = [
  "Saturday 27th of September, 2:15PM to 4PM at Arcanist's Tavern (87-91 Hackney Road, E2 8FE). Limited to 35 spots.",
  "Saturday 27th of September, 4:15PM to 6PM at Arcanist's Tavern (87-91 Hackney Road, E2 8FE). Limited to 35 spots.",
  "Monday 29th of September, 6PM to 8PM at Macadam Building, Strand Campus. Limited to 60 spots.",
];

for (const session of sessions) {
  emails = [];
  for (const entry of data) {
    if (entry.session === session) {
      const result = safeParse(email, entry.email);
      if (!result.success) {
        console.error(`Invalid email for ${entry.name}: ${entry.email} (${session})`);
        continue;
      }
      emails.push(entry.email);
    }
  }

  console.log(`Session: ${session}

${emails.join(", ")}
`);
}
