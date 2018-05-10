//dependencies 
const request = require('request');
const cheerio = require('cheerio');
const download = require('image-downloader');
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

const grabImage = (link) => {
	console.log('this is a IMGUR LINK!', link);
	const options = {
		url: `${link}`,
		dest: '/images_scraped/'
	}
	download.image(options)
		.then(({
			filename,
			image
		}) => {
			console.log('Saving file to', filename)
		}).catch((err) => {
			console.log(err);
		})

}

const grabImgurPage = (link) => [
	request(link, function (error, response, html) {
		//if (!error && response.status == 200) {
		console.log('this is a IMGUR PAGE LINK!', link);
		let $ = cheerio.load(html);
		let img = $('.zoom').attr('href');
		const options = {
			url: `${link}`,
			dest: '/images_scraped/'
		}
		download.image(options)
			.then(({
				filename,
				image
			}) => {
				console.log('Saving file to', filename)
			}).catch((err) => {
				console.log(err);
			})
	})
]

const grabReddit = (link) => {
	request(link, function (error, response, html) {
		//if (!error && response.status == 200) {
		console.log('this is a REDDIT LINK!', link)
		let $ = cheerio.load(html);
		//sets img equal to div parent of image then goes to div below
		let img = $('.media-preview-content');
		console.log('!!!!!!!' + img + '!!!!!!!!');
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