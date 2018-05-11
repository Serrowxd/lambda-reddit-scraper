//dependencies 
const request = require('request');
const cheerio = require('cheerio');
const download = require('image-downloader');
const chalkAnimation = require('chalk-animation');
const CronJob = require('cron').CronJob;
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
 const config = require('./config');
 const picModel = require('./models/picModel');
 require('./models/picModel');

mongoose.connect(config.mongoURI).then((res => {
console.log('Connected to MongoDB');
}))
const server = express();

//for url storage

const asciiIntro = console.log(`

_____               
/ _  /_   _  ___ ___ 
\// /| | | |/ __/ __|
 / //\ |_| | (_| (__ 
/____/\__,_|\___\___|
___       _   
/ __\ ___ | |_ 
/__\/// _ \| __|
/ \/  \ (_) | |_ 
\_____/\___/ \__|
			   
https://github.com/JaredRCooper
`);

let urlArray = [];
//sets variable current location to the directory of index.js
const currentLocation = __dirname;

//checks for a directory for saving images, if it doesn't exist it makes one.
if (!fs.existsSync('images_scraped')) {
	fs.mkdirSync('images_scraped');
}; 

//npm module for timing and executing functions

const grabImage = (link) => {
	console.log('this is a IMGUR LINK!', link);
	const options = {
		url: `${link}`,
		dest: `${currentLocation + '/images_scraped/'}`
	}
	download.image(options)
		.then(({
			filename,
			image
		}) => {
			console.log('Saving file to', filename)
			let downPic = new picModel({
				url: img,
				filename: filename 
			});
			downPic.save();
		}).catch((err) => {
			//console.log(err);
		})

}

const grabImgurPage = (link) => [
	request(link, function (error, response, html) {
		//if (!error && response.status == 200) {
		console.log('this is a IMGUR PAGE LINK!', link);
		let $ = cheerio.load(html);
		let img = $('.zoom').attr('href');
		const options = {
			url: `${img}`,
			dest: `${currentLocation + '/images_scraped/'}`
		}
		download.image(options)
			.then(({
				filename,
				image
			}) => {
				console.log('Saving file to', filename)
				let downPic = new picModel({
					url: img,
					filename: filename 
				});
	
				downPic.save();
			}).catch((err) => {
				//console.log(err);
			})
	})
]

const grabReddit = (link) => {
	request(link, function (error, response, html) {
		//if (!error && response.status == 200) {
		console.log('this is a REDDIT LINK!', link)
		let $ = cheerio.load(html);
		//sets img equal to div parent of image then goes to div below
		let img = $('.media-preview-content').find('a').attr('href');
		//console.log('!!!!!!!' + img + '!!!!!!!!');
		const options = {
			url: `${img}`,
			dest: `${currentLocation + '/images_scraped/'}`
		}
		download.image(options)
			.then(({
				filename,
				image
			}) => {
				console.log('Saving file to', filename)
				let downPic = new picModel({
					url: img,
					filename: filename 
				});
	
				downPic.save();
			}).catch((err) => {
				//console.log(err);
			})
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

scrapeR4Chan = () => {
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

scrapeRDankMemes = () => {
	request('https://www.reddit.com/r/dankmemes', function (error, response, html) {
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

const scrapeAll = () => {
	let scrapeAllFunction = scrapeR4Chan();
	return scrapeAllFunction;
};

scrapeAll();

//run once every 12 hours

//post one picture to facebook every 10 minutes

//photo filename + url + title on reddit for Schema upon image upload

//delete picture from folder

//break down functions into different files for read ability
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  chalkAnimation.rainbow(`The server is running on port ${PORT}`);
});