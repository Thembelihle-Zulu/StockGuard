#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const OXLINT_CONFIG = {
  $schema: "./node_modules/oxlint/configuration_schema.json",
  env: {
    browser: true,
    es2024: true,
  },
  categories: {
    correctness: "warn",
    suspicious: "warn",
    perf: "warn",
  },
  options: {
    reportUnusedDisableDirectives: "warn",
  },
  plugins: ["eslint", "typescript", "unicorn", "oxc", "react", "jsx-a11y"],
  ignorePatterns: ["dist/**", "src/concepts/**", "src/notes/**"],
  overrides: [
    {
      files: ["scripts/**/*.mjs"],
      env: {
        node: true,
      },
      rules: {
        "no-console": "off",
      },
    },
  ],
  rules: {
    "array-callback-return": "error",
    curly: ["error", "all"],
    eqeqeq: ["error", "always"],
    "no-alert": "warn",
    "no-console": "warn",
    "no-debugger": "error",
    "no-duplicate-imports": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-param-reassign": "warn",
    "no-shadow": "warn",
    "no-undef": "error",
    "no-unused-vars": "warn",
    "no-var": "error",
    "object-shorthand": "warn",
    "prefer-const": "warn",
    "prefer-template": "warn",
    "unicorn/no-abusive-eslint-disable": "error",
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/aria-props": "warn",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/label-has-associated-control": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    "react/button-has-type": "warn",
    "react/exhaustive-deps": "warn",
    "react/jsx-key": "error",
    "react/jsx-no-comment-textnodes": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/no-array-index-key": "warn",
    "react/no-children-prop": "error",
    "react/no-danger": "warn",
    "react/no-unknown-property": "error",
    "react/no-unstable-nested-components": "warn",
    "react/only-export-components": ["warn", { allowConstantExport: true }],
    "react/react-in-jsx-scope": "off",
    "react/rules-of-hooks": "error",
    "react/self-closing-comp": "warn",
  },
};

const OXFMT_CONFIG = {
  $schema: "./node_modules/oxfmt/configuration_schema.json",
  printWidth: 100,
  ignorePatterns: [
    "Test/**",
    "docs/**",
    "notes/**",
    "notes.md",
    "src/concepts/**",
    "src/notes/**",
  ],
};

const VSCODE_SETTINGS = {
  "oxc.enable": true,
  "oxc.enable.oxfmt": true,
  "oxc.enable.oxlint": true,
  "oxc.fmt.configPath": ".oxfmtrc.json",
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "always",
  },
};

const PACKAGE_MANAGERS = new Set(["bun", "npm", "pnpm", "yarn"]);

function printHelp() {
  console.log(`Set up the repository's Oxlint, Oxfmt, and VS Code workflow.

Usage:
  node scripts/setup-oxc.mjs [options]

Options:
  --pm <name>       Use bun, npm, pnpm, or yarn instead of auto-detection
  --skip-install    Create configuration without installing dependencies
  --force           Replace different Oxlint/Oxfmt config files
  -h, --help        Show this help

Examples:
  node scripts/setup-oxc.mjs
  node scripts/setup-oxc.mjs --pm npm
  node scripts/setup-oxc.mjs --skip-install

Safety:
  Existing package scripts and VS Code settings are merged.
  Different .oxlintrc.json or .oxfmtrc.json files are not replaced
  unless --force is supplied.`);
}

function fail(message) {
  console.error(`\nSetup failed: ${message}`);
  process.exit(1);
}

function parseOptions(argv) {
  const options = {
    force: false,
    help: false,
    packageManager: undefined,
    skipInstall: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "-h" || argument === "--help") {
      options.help = true;
    } else if (argument === "--force") {
      options.force = true;
    } else if (argument === "--skip-install") {
      options.skipInstall = true;
    } else if (argument === "--pm") {
      if (!argv[index + 1] || argv[index + 1].startsWith("-")) {
        fail("--pm requires bun, npm, pnpm, or yarn.");
      }

      options.packageManager = argv[index + 1];
      index += 1;
    } else if (argument.startsWith("--pm=")) {
      options.packageManager = argument.slice("--pm=".length);
    } else {
      fail(`Unknown option "${argument}". Run with --help for usage.`);
    }
  }

  if (options.packageManager && !PACKAGE_MANAGERS.has(options.packageManager)) {
    fail(`Unsupported package manager "${options.packageManager}".`);
  }

  return options;
}

function stripJsonComments(source) {
  let output = "";
  let inBlockComment = false;
  let inLineComment = false;
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const nextCharacter = source[index + 1];

    if (inLineComment) {
      if (character === "\n") {
        inLineComment = false;
        output += character;
      }

      continue;
    }

    if (inBlockComment) {
      if (character === "*" && nextCharacter === "/") {
        inBlockComment = false;
        index += 1;
      } else if (character === "\n") {
        output += character;
      }

      continue;
    }

    if (inString) {
      output += character;

      if (isEscaped) {
        isEscaped = false;
      } else if (character === "\\") {
        isEscaped = true;
      } else if (character === '"') {
        inString = false;
      }

      continue;
    }

    if (character === '"') {
      inString = true;
      output += character;
    } else if (character === "/" && nextCharacter === "/") {
      inLineComment = true;
      index += 1;
    } else if (character === "/" && nextCharacter === "*") {
      inBlockComment = true;
      index += 1;
    } else {
      output += character;
    }
  }

  return output;
}

function stripTrailingCommas(source) {
  let output = "";
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (inString) {
      output += character;

      if (isEscaped) {
        isEscaped = false;
      } else if (character === "\\") {
        isEscaped = true;
      } else if (character === '"') {
        inString = false;
      }

      continue;
    }

    if (character === '"') {
      inString = true;
      output += character;
      continue;
    }

    if (character === ",") {
      let lookahead = index + 1;

      while (/\s/.test(source[lookahead])) {
        lookahead += 1;
      }

      if (source[lookahead] === "}" || source[lookahead] === "]") {
        continue;
      }
    }

    output += character;
  }

  return output;
}

function readJson(path, label = path) {
  const source = readFileSync(path, "utf8");

  try {
    return JSON.parse(source);
  } catch (jsonError) {
    try {
      return JSON.parse(stripTrailingCommas(stripJsonComments(source)));
    } catch {
      fail(
        `${label} is not valid JSON or JSON-with-comments: ${jsonError.message}`,
      );
    }
  }
}

function normalize(value) {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .toSorted(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, normalize(nestedValue)]),
    );
  }

  return value;
}

function isEqual(left, right) {
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

function writeJsonIfChanged(path, value) {
  if (existsSync(path)) {
    const existing = readJson(path);

    if (isEqual(existing, value)) {
      console.log(`unchanged  ${path}`);
      return;
    }
  }

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
  console.log(`updated    ${path}`);
}

function preflightManagedConfig(path, expected, force) {
  if (!existsSync(path)) {
    return;
  }

  const existing = readJson(path);

  if (!force && !isEqual(existing, expected)) {
    fail(
      `${path} already has a different configuration. Review it manually or rerun with --force.`,
    );
  }
}

function detectPackageManager(root, packageJson, requested) {
  if (requested) {
    return requested;
  }

  const declaredManager = packageJson.packageManager?.split("@")[0];

  if (PACKAGE_MANAGERS.has(declaredManager)) {
    return declaredManager;
  }

  if (
    existsSync(join(root, "bun.lock")) ||
    existsSync(join(root, "bun.lockb"))
  ) {
    return "bun";
  }

  if (existsSync(join(root, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (existsSync(join(root, "yarn.lock"))) {
    return "yarn";
  }

  return "npm";
}

function installTools(root, packageManager) {
  const commands = {
    bun: ["bun", ["add", "--dev", "oxlint@latest", "oxfmt@latest"]],
    npm: ["npm", ["install", "--save-dev", "oxlint@latest", "oxfmt@latest"]],
    pnpm: ["pnpm", ["add", "--save-dev", "oxlint@latest", "oxfmt@latest"]],
    yarn: ["yarn", ["add", "--dev", "oxlint@latest", "oxfmt@latest"]],
  };
  const [command, arguments_] = commands[packageManager];

  console.log(`\nInstalling tools with ${packageManager}...`);
  const result = spawnSync(command, arguments_, {
    cwd: root,
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    fail(`${packageManager} could not install Oxlint and Oxfmt.`);
  }
}

function packageRunCommand(packageManager) {
  return packageManager === "yarn" ? "yarn" : `${packageManager} run`;
}

const options = parseOptions(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

const root = process.cwd();
const packagePath = join(root, "package.json");

if (!existsSync(packagePath)) {
  fail("Run this command from a project directory containing package.json.");
}

const initialPackageJson = readJson(packagePath, "package.json");
const packageManager = detectPackageManager(
  root,
  initialPackageJson,
  options.packageManager,
);
const oxlintPath = join(root, ".oxlintrc.json");
const oxfmtPath = join(root, ".oxfmtrc.json");
const extensionsPath = join(root, ".vscode", "extensions.json");
const settingsPath = join(root, ".vscode", "settings.json");

preflightManagedConfig(oxlintPath, OXLINT_CONFIG, options.force);
preflightManagedConfig(oxfmtPath, OXFMT_CONFIG, options.force);

if (!options.skipInstall) {
  installTools(root, packageManager);
}

console.log("\nWriting team configuration...");
writeJsonIfChanged(oxlintPath, OXLINT_CONFIG);
writeJsonIfChanged(oxfmtPath, OXFMT_CONFIG);

const existingExtensions = existsSync(extensionsPath)
  ? readJson(extensionsPath, ".vscode/extensions.json")
  : {};
const extensionRecommendations = Array.isArray(
  existingExtensions.recommendations,
)
  ? existingExtensions.recommendations
  : [];
const nextExtensions = {
  ...existingExtensions,
  recommendations: [
    ...new Set([...extensionRecommendations, "oxc.oxc-vscode"]),
  ],
};
writeJsonIfChanged(extensionsPath, nextExtensions);

const existingSettings = existsSync(settingsPath)
  ? readJson(settingsPath, ".vscode/settings.json")
  : {};
const existingCodeActions = existingSettings["editor.codeActionsOnSave"];
const nextSettings = {
  ...existingSettings,
  ...VSCODE_SETTINGS,
  "editor.codeActionsOnSave": {
    ...(existingCodeActions && typeof existingCodeActions === "object"
      ? existingCodeActions
      : {}),
    ...VSCODE_SETTINGS["editor.codeActionsOnSave"],
  },
};
writeJsonIfChanged(settingsPath, nextSettings);

const packageJson = readJson(packagePath, "package.json");
const run = packageRunCommand(packageManager);
const buildCheck = packageJson.scripts?.build ? ` && ${run} build` : "";
const qualityCheck = `${run} lint && ${run} format:check${buildCheck}`;
const existingCheck = packageJson.scripts?.check;
const canOwnCheck =
  !existingCheck ||
  existingCheck.includes("oxlint") ||
  existingCheck.includes("format:check");
const checkScriptName = canOwnCheck ? "check" : "check:quality";

packageJson.scripts = {
  ...packageJson.scripts,
  [checkScriptName]: qualityCheck,
  format: "oxfmt --write .",
  "format:check": "oxfmt --check .",
  lint: "oxlint .",
  "lint:fix": "oxlint --fix .",
  "setup:quality": "node scripts/setup-oxc.mjs",
};
writeJsonIfChanged(packagePath, packageJson);

console.log(`
Setup complete.

Package manager: ${packageManager}
Format code:     ${run} format
Check project:   ${run} ${checkScriptName}

Install the recommended "Oxc" VS Code extension when prompted.
Commit the generated config and .vscode files so the whole team shares them.`);
