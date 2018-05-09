const request = require('request');
const cheerio = require('cheerio');
//const validator = require('validator-js');
//built in node module that allows you to save and write files
const fs = require('fs');
const path = require('path');
//pussypassdenied, 4chan, greentext, dankmemes
let stuff = [];

grabImage = (url) => {
	request(url, function (error, response, html) {
		if (!error && response.status == 200) {
			let $ = cheerio.load(html);
			//sets img equal to div parent of image then goes to div below
			let img = $('div.media-preview-content').next();
			console.log(img);
		}
	})
}

//need to remove index 0 of the array

//this function takes in a url as a string, a file path as a string, and a callback function
/*
const downloadImage = (url, path, callback) => {
	request({uri: url})
	.pipe(fs.createWriteStream(path))
	.on('close', function() {
		callback();
	})
} */

scrapeSub = () => {
	request('https://www.reddit.com/r/4chan', function (error, response, html) {
		if (!error && response.statusCode == 200) {
			let $ = cheerio.load(html);
			$('span.domain').each(function (i, element) {
				// Select the previous element
				var a = $(this).prev();
				var title = a.text();
				var url = a.attr('href');
				let pattern = new RegExp(/\/r\//)
				if (pattern.test(url)) url = 'https://reddit.com' + url;
				stuff.push( /*title + ' ' +*/ url);
			})
			//map over the array of links and pass each into a link variable
			stuff.map(link => {
				if (link.includes('reddit.com')) {
				}
				grabImage(link);
			})
			console.log(stuff);
		}
	})
};


scrapeSub()

//find out how to download images from i.reddit

//conditional statement for if it's ireddit or imgur link

//download first 15 only using span index

//run once every 24 hours

//post to facebook every 15 minutes then delete picture

//post the id of the