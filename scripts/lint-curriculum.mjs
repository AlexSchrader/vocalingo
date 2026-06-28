// Curriculum lint CLI — the single mechanical gate for authored content.
// Runs the hard content contract (validateContent) AND the authoring lint
// (lintCurriculum) so every Part 1 rule from BUILD-BRIEF-curriculum-lint.md is
// enforced in one place. Green here = mechanically sound; language naturalness is
// the separate batched native-speaker gate (brief Part 2).
import { validateContent } from "../src/data/contract.js";
import { lintCurriculum } from "../src/data/lint.js";
import { UNITS, LANGUAGES } from "../src/data/index.js";

const contract = validateContent(UNITS, LANGUAGES);
const lint = lintCurriculum(UNITS);

const errors = [...contract.errors, ...lint.errors];
const warnings = [...contract.warnings, ...lint.warnings];

if (warnings.length) {
  console.warn(`\nCurriculum warnings (${warnings.length}):`);
  warnings.forEach((w) => console.warn(`  ⚠  ${w}`));
}

if (errors.length) {
  console.error(`\nCurriculum errors (${errors.length}):`);
  errors.forEach((er) => console.error(`  ✗  ${er}`));
  console.error("\nCurriculum lint FAILED.");
  process.exit(1);
}

console.log(`Curriculum OK — ${UNITS.length} unit(s), 0 errors, ${warnings.length} warning(s).`);
