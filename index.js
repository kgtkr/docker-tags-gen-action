const core = require("@actions/core");
const github = require("@actions/github");

const convertRef = (ref) =>
  ref.substring(0, 64).replaceAll(/[^a-zA-Z0-9_\.]|^\.|\.$/g, "_");

const name = core.getInput("name");
const tags = [];
let ref = "_unknown_";
if (github.context.ref.startsWith("refs/tags/")) {
  ref = convertRef(github.context.ref.replace("refs/tags/", ""));
}
if (github.context.ref.startsWith("refs/heads/")) {
  ref = convertRef(github.context.ref.replace("refs/heads/", ""));
}
tags.push(ref);

const now = new Date();
const timestamp =
  now.getUTCFullYear().toString().leftPad(4, "0") +
  (now.getUTCMonth() + 1).toString().leftPad(2, "0") +
  now.getUTCDate().toString().leftPad(2, "0") +
  now.getUTCHours().toString().leftPad(2, "0") +
  now.getUTCMinutes().toString().leftPad(2, "0") +
  now.getUTCSeconds().toString().leftPad(2, "0") +
  now.getUTCMilliseconds().toString().leftPad(3, "0");
const shortSha = github.context.sha.substring(0, 7);
tags.push(`${timestamp}-${ref}-${shortSha}`);
core.setOutput("tags", tags.map((tag) => `${name}:${tag}`).join(","));
