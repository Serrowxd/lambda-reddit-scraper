const request = require('request');
const cheerio = require('cheerio');
//const validator = require('validator-js');
//built in node module that allows you to save and write files
const fs = require('fs');
const path = require('path');
//pussypassdenied, 4chan, greentext, dankmemes
let urlArray = [];
/*
const download = (uri, filename, callback) => {
	request.head(uri, function(err, res, body){
	  console.log('content-type:', res.headers['content-type']);
	  console.log('content-length:', res.headers['content-length']);
  
	  request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
  };
  */

const grabImage = (url) => {
	request(url, function (error, response, html) {
		//if (!error && response.status == 200) {
			console.log('this is IMGUR LINK!', url);
			//we have to differentiate between imgur link, and imgur page
		})
	}

const grabImgurPage = (url) => [
	request(url, function(error, response, html) {
		//if (!error && response.status == 200) {
			console.log('this is IMGUR PAGE LINKE!', url);
			let $ = cheerio.load(html);
		})
]

const grabReddit = (url) => {
	request(url, function (error, response, html) {
		//if (!error && response.status == 200) {
			console.log('this is REDDIT LINK!',url)
			let $ = cheerio.load(html);
			//sets img equal to div parent of image then goes to div below
			let img = $('.media-preview-content').next().attr('href');
			
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
			//console.log($.children)
			$('span.domain').each(function (i, element) {
				// Select the previous element
				let a = $(this).prev();
				let title = a.text();
				let url = a.attr('href');
				let pattern = new RegExp(/\/r\//)
				if (pattern.test(url)) url = 'https://reddit.com' + url;
				urlArray.push( /*title + ' ' +*/ url);
			})
			//map over the array of links and pass each into a link variable
			urlArray.map(link => {
				if (link.includes('reddit.com')) {
					grabReddit(link);
				} else if (link.includes('.jpg' || '.png' || 'gif')) {
					grabImage(link);
				} else {
					grabImgurPage(link);
				}
				
			})
			//console.log(urlArray);
		}
	//	urlArray.map(url => request(url, function(err, response, html){
		//	let $  = cheerio.load(html)
		//response.pipe(process.stdout).on('input', console.log(response))
		})
//	)})
};

scrapeSub()

//find out how to download images from i.reddit

//conditional statement for if it's ireddit or imgur link

//download first 15 only using span index

//run once every 24 hours

//post to facebook every 15 minutes then delete picture

//post the id of the