const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const moment = require("moment");

const url = "https://luiscardoso.com.br/?s=feminicidio";
const outputFile = "posts.json";
const extracted_links = [];

const getWebContent = async url => {
  try {
    console.log(`acessando o endereço: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    $("article").each((i, article) => {
      const post_title = $("h1.post-title > a", article)
        .text()
        .trim();
      const post_link = $("h1.post-title > a", article).attr("href");
      const post_content = $(".post-content", article)
        .contents()
        .map((i, elem) => {
          return $(elem).text() + " ";
        })
        .get()
        .join(" ");

      moment.locale();
      const post_timestamp = moment(
        $(".post-info > .post-date time", article).text(),
        "lll",
        "pt-BR"
      )
        .local("en")
        .format();

      if (post_title && post_link && post_content && post_timestamp) {
        const newArticle = {
          post_title,
          post_link,
          post_content,
          post_timestamp
        };

        extracted_links.push(newArticle);
      }
    });

    nextPage = $("span.current")
      .next()
      .attr("href");

    if (nextPage) {
      console.log("foi encontrado um próximo endereço... cavando mais...");
      await getWebContent(nextPage);
    } else {
      console.log("busca encerrada");
      exportResults(extracted_links);
    }
  } catch (error) {
    console.error(error);
  }
};

const exportResults = parsedResults => {
  console.log(`Exportando para arquivo: ${parsedResults.length} registros`);
  fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), err => {
    if (err) console.error(err);

    console.log(`Resultados exportados com sucesso para ${outputFile}`);
  });
};

getWebContent(url);
