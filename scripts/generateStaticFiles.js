const fs = require("fs");
const path = require("path");

const isProcuction = process.env.NODE_ENV === "production";

// const createRobotsTxt = () => {
//   return isProcuction
//     ? `
//         User-agent: *
//         Disallow:
//         Sitemap: https://sosovalue.xyz/sitemap.xml
//     `
//     : `
//         User-agent: *
//         Disallow: /
//     `;
// };
const createRobotsTxt = () => {
  return isProcuction
    ? `
        User-agent: *
        Disallow:
    `
    : `
        User-agent: *
        Disallow: /
    `;
};

const generateFiles = () => {
  const filePath = path.join(__dirname, "../public/robots.txt");
  fs.writeFileSync(filePath, createRobotsTxt());
};

generateFiles();
