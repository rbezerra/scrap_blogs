const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://luiscardoso.com.br/?s=feminicidio";
const outputFile = "posts.json";

const getWebContent = async url => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    extracted_links = [];

    $("article").each((i, article) => {
      const post_title = $("h1.post-title > a", article).text();
      const post_link = $("h1.post-title > a", article).attr("href");

      if (post_title && post_link) {
        const newArticle = { post_title, post_link };

        extracted_links.push(newArticle);
      }
	});
	
	exportResults(extracted_links);
  } catch (error) {
    console.error(error);
  }
};

const exportResults = parsedResults => {
  fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), err => {
    if (err) console.error(err);

    console.log(`Resultados exportados com sucesso para ${outputFile}`);
  });
};

getWebContent(url);
