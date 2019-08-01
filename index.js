const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://luiscardoso.com.br/?s=feminicidio";
const outputFile = "posts.json";
const extracted_links = [];

const getWebContent = async url => {
  try {
    console.log(`acessando o endereço: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    $("article").each((i, article) => {
      const post_title = $("h1.post-title > a", article).text();
      const post_link = $("h1.post-title > a", article).attr("href");
      const post_content = $(".post-content", article).text();
      const post_timestamp = $(
        ".post-info > .post-date time",
        article
      ).text();

      
	  console.log('extraindo post: ', post_title, post_timestamp);
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

    //ir para a próxima página
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
  console.log(`Salvando em arquivo: ${parsedResults.length} registros`);
  fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), err => {
    if (err) console.error(err);

    console.log(`Resultados exportados com sucesso para ${outputFile}`);
  });
};

getWebContent(url);
