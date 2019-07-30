const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://luiscardoso.com.br/?s=feminicidio';

rp(url)
	.then(html => {
		const articles = $('article', html);

		const keys = Object.keys(articles);

        for (const key of keys){
            const post_title = $('h1.post-title > a', articles[key].children);
            console.log(post_title.text());
        }
	})
	.catch(err => console.error(err));
