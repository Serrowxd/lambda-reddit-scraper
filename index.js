//dependencies 
const request = require('request');
const cheerio = require('cheerio');
const download = require('image-downloader');
const CronJob = require('cron').CronJob;
const fs = require('fs');
const path = require('path');
//for url storage
let urlArray = [];
//sets variable current location to the directory of index.js
const currentLocation = __dirname;

//checks for a directory for saving images, if it doesn't exist it makes one.
if (!fs.existsSync('images_scraped')) {
	fs.mkdirSync('images_scraped');
};


const job = new CronJob('10 * * * * *', function() {
	/*
	 * Runs every weekday (Monday through Friday)
	 * at 11:30:00 AM. It does not run on Saturday
	 * or Sunday.
	 */
	}, function () {
		scrapeAll();
	  /* This function is executed when the job stops */
	},
	true, /* Start the job right now */
	timeZone /* Time zone of this job. */
  );

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
			url: `${img}`,
			dest: `${currentLocation + '/images_scraped/'}`
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
			}).catch((err) => {
				console.log(err);
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
	let scrapeAllFunction = scrapeR4Chan() && scrapeRDankMemes();
	return scrapeAllFunction;
}


//run once every 12 hours

//post one picture to facebook every 10 minutes

//add unique identifier or image filename to a mongo database upon picture upload

//delete picture from folder