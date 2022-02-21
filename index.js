const core = require("@actions/core");
const github = require("@actions/github");

const convertRef = (ref) =>
  ref.substring(0, 64).replaceAll(/[^a-zA-Z0-9_\.]|^\.|\.$/g, "_");

const name = core.getInput("name");
const tags = [];
let ref = "_unknown_";
if (github.context.ref.startsWith("refs/tags/")) {
  ref = convertRef(github.context.ref.replace("refs/tags/", ""));
  tags.push(ref);
}
if (github.context.ref.startsWith("refs/heads/")) {
  ref = convertRef(github.context.ref.replace("refs/heads/", ""));
  tags.push(`latest-${ref}`);

  const now = new Date();
  const timestamp =
    now.getUTCFullYear().toString().padStart(4, "0") +
    (now.getUTCMonth() + 1).toString().padStart(2, "0") +
    now.getUTCDate().toString().padStart(2, "0") +
    now.getUTCHours().toString().padStart(2, "0") +
    now.getUTCMinutes().toString().padStart(2, "0") +
    now.getUTCSeconds().toString().padStart(2, "0") +
    now.getUTCMilliseconds().toString().padStart(3, "0");
  const shortSha = github.context.sha.substring(0, 7);
  if (ref === "master" || ref === "main") {
    tags.push(`${timestamp}-${shortSha}`);
  } else {
    tags.push(`${timestamp}-${shortSha}-${ref}`);
  }
}

const result = tags.map((tag) => `${name}:${tag}`).join(",");
console.log("Generated tags:", result);
core.setOutput("tags", result);
