var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/main.ts
var import_child_process = require("child_process");
var core = __toESM(require("@actions/core"));
async function main() {
  const ref = core.getInput("head-ref");
  const pkg = core.getInput("package") || "";
  const command = core.getInput("command");
  const cmd = `npx turbo run ${command} --filter=[${ref}] --dry=json`;
  core.info(`Executing command: "${cmd}"`);
  (0, import_child_process.exec)(
    cmd,
    {
      cwd: process.cwd()
    },
    (error2, stdout) => {
      if (error2) {
        core.error(`Could not execute command. Error: ${error2}`);
        core.setFailed(error2);
        return;
      }
      try {
        const parsed = JSON.parse(stdout);
        if (parsed === null) {
          core.error(`Failed to parse JSON output from "${cmd}"`);
          core.setFailed("parsed JSON is null");
          return;
        }
        const { packages } = parsed;
        if (packages.length) {
          const isPackageAffected = packages.includes(pkg);
          const affected = JSON.stringify(packages);
          core.info(
            `Affected packages since ${ref} (${packages.length}):
${affected}`
          );
          core.setOutput("affected", affected);
          core.setOutput("is-package-affected", isPackageAffected);
          core.summary.addHeading("Affected Packages");
          core.summary.addRaw(
            "There are ${packages.length} affected packages since ${ref}"
          );
          core.summary.addTable([
            [
              { data: "name", header: true },
              { data: "checked", header: true }
            ],
            packages.map((p) => [p, p === pkg ? "true" : ""])
          ]);
        } else {
          core.info(`No packages affected since ${ref}`);
          core.setOutput("affected", JSON.stringify([]));
          core.setOutput("is-package-affected", false);
          core.summary.addHeading("Affected Packages");
          core.summary.addRaw(`No affected packages since ${ref}`);
        }
        core.summary.write();
      } catch (err) {
        core.error(`Failed to parse JSON output from "${cmd}"`);
        core.setFailed(err);
      }
    }
  );
}
main().catch((err) => {
  core.setFailed(err);
});
