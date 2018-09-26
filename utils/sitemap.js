const sitemaps = require('sitemap-stream-parser');
const debug = require('debug')('crawler:sitemap');

function parseSitemap(url) {
	return new Promise((resolve, reject) => {
		let sitemapUrl = [`http://${url}/sitemap.xml`, `https://${url}/sitemap.xml` ];
		debug('Start looking at sitemaps', sitemapUrl);

		// To store all page URLs
		let foundURLs = [];

		// Retrieve page URLs from given sitemap
		// Module also finds child sitemaps. E.g. https://www.bombaysapphire.com/es/es/sitemap.xml
		sitemaps.parseSitemaps(sitemapUrl,
			function(page) { 
				debug(page);
				let regExp = RegExp('http(s)?:\/\/' + url, 'g');
				foundURLs.push({ path: page.replace(regExp, ''), status: "test" });
			},
			function(err, sitemaps) {

				if (err) { 
					debug('ERROR', err); 
					reject(err);
				}
			    
			    debug('foundURLs', foundURLs);
			    resolve(foundURLs);
			}
		);
	});
}

module.exports = parseSitemap;