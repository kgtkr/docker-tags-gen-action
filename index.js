const core = require("@actions/core");
const github = require("@actions/github");

const name = core.getInput("name");
const tags = [];
tags.push(github.context.sha);
if (github.context.ref.startsWith("refs/tags/")) {
  const ref = github.context.ref.replace("refs/tags/", "");
  tags.push(ref.replaceAll("/", "-"));
}
if (github.context.ref.startsWith("refs/heads/")) {
  const ref = github.context.ref.replace("refs/heads/", "");
  tags.push(ref.replaceAll("/", "-"));
}
core.setOutput("tags", tags.map((tag) => `${name}:${tag}`).join(","));
