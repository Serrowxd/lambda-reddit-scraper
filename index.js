const request = require('request');
const cheerio = require('cheerio');
//const validator = require('validator-js');
//built in node module that allows you to save and write files
const fs = require('fs');
//pussypassdenied, 4chan, greentext, dankmemes
let stuff = [];

grabImage = (url) => {
	request(url, function(error, response, html) {
		if (!error && response.status == 200) {
		let $ = cheerio.load(html);
	let imgContainer = $(this).prev();
	console.log(imgContainer);
	}})
}

scrapeSub = () => {
	request('https://www.reddit.com/r/4chan', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('span.domain').each(function(i, element){
      // Select the previous element
      var a = $(this).prev();
	  var title = a.text();
	  var url = a.attr('href');
	  let pattern = new RegExp(/\/r\//)
	  if (pattern.test(url)) url = 'https://reddit.com'+url;
	  stuff.push(/*title + ' ' +*/ url);
	 // grabImage(url);
	  // validator.equals(url, 'imgur');

	})
	stuff.map(thing => {
		if (thing.includes('reddit.com')) {

		} grabImage(thing);
	})
	console.log(stuff);
}})};


scrapeSub()

//find out how to download images from i.reddit

//conditional statement for if it's ireddit or imgur link

//download first 15 only using span index

//run once every 24 hours

//post to facebook every 15 minutes then delete picture

//post the id of the 