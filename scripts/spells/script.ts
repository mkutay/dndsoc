import fs from "fs";

const spellsDir = "./scripts/spells/Spell Cards/";
const spells =
  "blade ward, mage hand, ray of frost, true strike, sacred flame, spare the dying, thaumaturgy, minor illusion, vicious mockery, fire bolt, acid splash, shocking grasp, druidcraft, thorn whip, eldritch blast, poison spray, prestidigitation, shillelagh, chromatic orb, magic missile, shield, blur, bless, cure wounds, detect evil and good, detect poison and disease, guiding bolt, healing word, charm person, comprehend languages, faerie fire, bane, compelled duel, heroism, hunter’s mark, wrathful smite, thunderwave, burning hands, detect magic, identify, mage armor, sleep, fog cloud, hellish rebuke, hex, goodberry, longstrider, calm emotions, lesser restoration, prayer of healing, spiritual weapon, crown of madness, enhance ability, flaming sphere, web, flame blade, moonbeam, invisibility, scorching ray, light, resistance, inflict wounds, protection from evil and good, gust of wind, shatter, sanctuary, elementalism, suggestion, command";
const spellList = spells.split(", ").map((s) => s.toLowerCase().replace(/’/g, "_"));

const spellFiles = fs.readdirSync(spellsDir).map((file) => ({ lower: file.toLowerCase(), file }));

for (const spell of spellList) {
  const spellFile = `${spell}.png`;
  if (!spellFiles.find((sf) => sf.lower === spellFile)) {
    console.error(`Missing spell card: ${spellFile}`);
  }
  fs.copyFileSync(spellsDir + spellFile, `./scripts/spells/needed/${spellFile}`);
}

// mehmet.bozkurt@kcl.ac.uk, fraser.shimmins@kcl.ac.uk, mark.sanu@kcl.ac.uk, joshua.purcell@kcl.ac.uk, gune.soyer@kcl.ac.uk, kai.mann@kcl.ac.uk, maryam.al-farooq@kcl.ac.uk, jules.balogh@kcl.ac.uk, wei.x.lin@kcl.ac.uk

/*
Session: Saturday 27th of September, 2:15PM to 4PM at Arcanist's Tavern (87-91 Hackney Road, E2 8FE). Limited to 35 spots.

felix1103ho@gmail.com, emmaflanagan12@yahoo.com, victor.raga@kcl.ac.uk, k.f.geron@gmail.com, K23170734@kcl.ac.uk, sophia.massouras@kcl.ac.uk, ezgiagir.08@gmail.com, felix_lucchini@icloud.com, rebeccayrausquin@gmail.com, hagenhermjakob@gmail.com, siham.mahamud@kcl.ac.uk, k25119008@kcl.ac.uk, K22001852@kcl.ac.uk, Aryan.hunjan@kcl.ac.uk, annabellong99@gmail.com, alwxalqx@gmail.com, luis.arija.gonzalez@gmail.com, kaving16@outlook.com, qinxin.xue@kcl.ac.uk, iantayupeacosta@gmail.com, k25157369@kcl.ac.uk, zuzanna.toltyzewska@kcl.ac.uk, rebeccayrausquin@gmail.com, joannalui20@gmail.com, K25050954@kcl.ac.uk, emilie.sprayoon@gmail.com, coronel.francisco.97@gmail.com, dashazucok@gmail.com, baturalpkaratas06@gmail.com, lhallewellpearson@outlook.com

Session: Saturday 27th of September, 4:15PM to 6PM at Arcanist's Tavern (87-91 Hackney Road, E2 8FE). Limited to 35 spots.

jestaylor006@outlook.com, 24031101@kcl.ac.uk, evandevar@gmail.com, k23115333@kcl.ac.uk, caitlyn.maggs@live.co.uk, mengren531@gmail.com, k25138384@kcl.ac.uk, nathan.jabialu@kcl.ac.uk, baray.efe.r@gmail.com, Matthewobalogun@gmail.com, karla24082007@gmail.com, marcin1252005@gmail.com, K24027783@kcl.ac.uk, 777keely@gmail.com, didi.g.chitimia@gmail.com, k25005609@kcl.ac.uk, k25095393@kcl.ac.uk, kalani.tam.24@ucl.ac.uk, heather.gent@kcl.ac.uk, aldongan@gmail.com, Matthew.horvitz@kcl.ac.uk, rushika.madala@kcl.ac.uk, Gracerumis004@gmail.com, k25000399@kcl.ac.uk, kaitlan.harrison@gmail.com, Tabitha.prendergast-coates@kcl.ac.uk, louisa.c.whyte@gmail.com, achloejfoster@gmail.com, sgt.m.garbolino@gmail.com, k25006649@kcl.ac.uk

Session: Monday 29th of September, 6PM to 8PM at Macadam Building, Strand Campus. Limited to 60 spots.

nirvaan.parambat@outlook.com, Mahzabin.haque@kcl.ac.uk, benedict.moorhead@kcl.ac.uk, juliet.filkin@gmail.com, annika.pangilinan23@gmail.com, ellis.pollard23@gmail.com, aedalene.pupec@kcl.ac.uk, henry.2.brown@kcl.ac.uk, vrimkute29@mail.ru, Weichung.yen@gmail.com, k21010842@kcl.ac.uk, K25137491@kcl.ac.uk, mberthoud2@gmail.com, sharonosamor27@gmail.com

*/
