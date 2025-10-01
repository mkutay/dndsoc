import fs from "fs";

// const cols = [
//   "Timestamp",
//   "What is your full name?",
//   `What is your K number?

// If you're not a King's student, just type N/A here.`,
//   "What is your email?",
//   "What is your year of study and programme?",
//   "Have you played D&D or similar games before?",
//   "Which session would you like to attend as your FIRST choice? (Required—pick the one you're most likely to make)",
//   `Are you available for a SECOND session as backup? (Optional—if you're free for another time, let us know)

// This helps us fill spots efficiently! If your first choice is full, we'll place you in your second choice, if available. No worries if you're only free for one.`,
//   "Do you understand that signing up reserves a spot, and if you can't attend, you'll let us know so we can offer it to someone else on the waitlist?",
//   "How did you hear about this event?",
//   "Any questions or excitement to share?",
// ];

function parseCSV(csvText: string): Record<string, string>[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;
  let i = 0;

  while (i < csvText.length) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i += 2;
        continue;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      // End of row
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some((field) => field)) {
          // Only add non-empty rows
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = "";
      }
      // Skip \r\n combinations
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
    } else {
      currentField += char;
    }
    i++;
  }

  // Add the last field and row if any
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field)) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map((header) => header.replace(/^"|"$/g, ""));
  const dataRows = rows.slice(1);

  return dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] ? row[index].replace(/^"|"$/g, "") : "";
    });
    return obj;
  });
}

const file = "./scripts/freshers-event/Freshers Event: The Joy of D&D!.csv";
const data = fs.readFileSync(file, "utf-8");
const result = parseCSV(data);
// const columns = Object.keys(result[0]);

const timed: {
  name: string;
  session: string;
  choice: 1 | 2;
  email: string;
}[] = [];

const left: Record<string, number> = {
  "Saturday 27th of September, 2:15PM to 4PM at Arcanist's Tavern (87-91 Hackney Road, E2 8FE). Limited to 35 spots.": 30,
  "Saturday 27th of September, 4:15PM to 6PM at Arcanist's Tavern (87-91 Hackney Road, E2 8FE). Limited to 35 spots.": 30,
  "Monday 29th of September, 6PM to 8PM at Macadam Building, Strand Campus. Limited to 60 spots.": 60,
};

result.sort((a, b) => {
  // if they have a second choice and its 60 option put them later
  const aValues = Object.values(a);
  const bValues = Object.values(b);
  if (
    aValues[7] === "Monday 29th of September, 6PM to 8PM at Macadam Building, Strand Campus. Limited to 60 spots." &&
    bValues[7] !== "Monday 29th of September, 6PM to 8PM at Macadam Building, Strand Campus. Limited to 60 spots."
  ) {
    return 1;
  }
  if (
    bValues[7] === "Monday 29th of September, 6PM to 8PM at Macadam Building, Strand Campus. Limited to 60 spots." &&
    aValues[7] !== "Monday 29th of September, 6PM to 8PM at Macadam Building, Strand Campus. Limited to 60 spots."
  ) {
    return -1;
  }
  return 0;
});

for (let i = 1; i < result.length; i++) {
  const values = Object.values(result[i]);
  if (left[values[6]] > 0) {
    timed.push({ name: values[1], session: values[6], choice: 1, email: values[3] });
    left[values[6]]--;
  } else if (values[7] !== "No, just my first choice is fine, thanks!" && left[values[7]] > 0) {
    timed.push({ name: values[1], session: values[7], choice: 2, email: values[3] });
    left[values[7]]--;
  } else {
    console.warn(`No spots left for ${values[1]}`);
  }
}

fs.writeFileSync("./scripts/freshers-event/timed.json", JSON.stringify(timed, null, 2));

console.warn(left);
