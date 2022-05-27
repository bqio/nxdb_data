const fs = require("fs");

function compareDateDesc(a, b) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

const titleReg = /\[Nintendo Switch\]\s?(.*?)\s?\n?\[/g;
const uidReg = /\[(0.*?)\]\[v.+\]/gm;

let titles = JSON.parse(
  fs.readFileSync("forum_1605.json", { encoding: "utf-8" })
);

for (const title of titles) {
  let result;
  let isFounded = false;
  while ((result = uidReg.exec(title.files)) !== null) {
    title.uid = result[1];
    isFounded = true;
  }

  while ((result = titleReg.exec(title.title)) !== null) {
    title.title = result[1];
  }

  if (!isFounded) {
    title.uid = -1;
  }

  delete title.content;
  delete title.files;
}

titles = titles
  .filter((title) => {
    if (!title.title.includes("[УДАЛЕНО]")) {
      return true;
    }
    return false;
  })
  .sort(compareDateDesc);

fs.writeFileSync("nxdb.json", JSON.stringify(titles), {
  encoding: "utf8",
});
