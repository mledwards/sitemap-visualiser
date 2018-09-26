var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var debug = require('debug')('crawler:app');
var _ = require('lodash');
var utils = require('./utils/setup.js');

// TODO: Add this later
// var client = require('redis').createClient(process.env.REDIS_URL || '');
// const {promisify} = require('util');
// const getAsync = promisify(client.get).bind(client);

app.use(utils.bodyParser());

const sitemap = require('./utils/sitemap.js');
// Set up sitemap


// Set up public folder
app.use(express.static('public')); // Folder to serve static files

// Set up handlebars
var exphbs  = require('express-handlebars');
app.engine('.html', exphbs({defaultLayout: 'main', extname: '.html' }));
app.set('view engine', '.html');

// Start Crawler
app.post('/', (request, response, next) => {
	let displayUrl = request.body.url.replace(/http(s)?:\/\//g, '').replace(/\//g, '');
	// Redirect to the spider render page
	// TODO: Only does root domains
	return response.redirect('/site/' + displayUrl);
});

app.get('/', (request, response) => {
	response.render('pages/index', {
		title: 'Sitemap',
		subtitle: 'Visualiser'
	});
});

app.get('/site/:url', function(request, response) {

	// Parsing sitemap
	// getAsync(request.params.url)
	// .then((value) => {

	// 	// If found in redis parse as JSON then return
	// 	if (value) { return JSON.parse(value); }

	// 	// Otherwise go and get sitemaps
	// 	return sitemap(request.params.url); 
	// })
	sitemap(request.params.url)
	.then((results) => {
		// client.set(request.params.url, JSON.stringify(results), 'EX', 86400);
		let data = { "name": request.params.url, "children": [] };
		// debug(results);
		results.forEach(function(url) {
			var temp = data.children;
			_.get(url, 'path', []).split('/').filter(String).forEach(function(part) {
				var index = _.findKey(temp, function(o) { return o.name === part; }) || temp.push({"name": part, "children": []}) - 1;
				temp = temp[index].children;
			});
		});

		// Render page
		response.render('pages/site', {
			data: JSON.stringify(data),
			total: _.get(data, 'children', '').length,
			layout: 'site'
		});
	});
});

app.listen(port, function() {
	console.log('Site loaded on port ' + port);
});