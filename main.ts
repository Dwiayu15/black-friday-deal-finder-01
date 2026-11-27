// DealHunt hand-in (Node 22, standard library only). The site lives in app/ as
// plain static files; this program copies app/ and screenshots/ next to the
// entry's dossier into the output directory, so the scorer and the judge see
// exactly the site as built. Outside the grader, MAKEFUN_OUTPUT_DIR stands in
// for /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// vendor/makefun-frontend.ts is the kit's copy and stays untouched: the scorer
// rebuilds the dossier with its own copy and the two must match byte for byte.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Refuse to hand in a broken entry rather than ship one silently.
const indexFile = join(repoRoot, "app", "index.html");
if (!existsSync(indexFile) || !statSync(indexFile).isFile()) {
  throw new Error("app/index.html is missing — the site cannot be handed in");
}
const shotsDir = join(repoRoot, "screenshots");
const shots = existsSync(shotsDir) ? readdirSync(shotsDir).filter((f) => !f.startsWith(".")) : [];
if (shots.length > 4) {
  throw new Error(`screenshots/ holds ${shots.length} images, the cap is 4`);
}

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });
}

writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
