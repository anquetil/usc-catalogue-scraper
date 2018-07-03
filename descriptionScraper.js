const rp = require('request-promise');
const cheerio = require('cheerio');
const {performance} = require('perf_hooks'); //for performance.now
var fs = require('fs'); //filestream



function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function runCourseScraper(courses){	
	var start = performance.now();
	var results = [];

	for(var i = 0; i < courses.length; i++){
		var name = courses[i].name;
		var id = courses[i].id;

		console.log(i + ': Querying Course ' + name + '\n\tID:' + id);

		var options = {
				uri: `http://catalogue.usc.edu/preview_course_nopop.php?catoid=8&coid=` + id,
				transform: function (body) { return cheerio.load(body);}
		};

		var x = function(thisName, thisID){
			return rp(options)
			.then(($) => {
				var desc = $(".block_content").html();
				var beginning = desc.indexOf('/h1>')  + 4;
				desc = desc.substr(beginning);

				var end = desc.indexOf('<div');
				desc = desc.substr(0, end);

				/* to clean up description*/
					desc = desc.replace(/<hr>/g, '\n');
					desc = desc.replace(/<br>/g, '\n');
					desc = desc.replace(/<p><\/p>/g, '\n');
					desc = desc.replace('\t', ' '); 		// tabs to space
					desc = desc.replace(/<[^>]*>/g, " "); 	// remove all html tags
					desc = desc.replace(/&#xA0;/g, ' '); 	// space
					desc = desc.replace(/&quot;/g, '\"'); 	// quotes
					desc = desc.replace(/&apos;/g, '\''); 	// apostrophes
					desc = desc.replace(/&#x2014;/g, '-'); 	// dashes
					desc = desc.replace(/&#x2013;/g, '-'); 	// more dashes
					desc = desc.replace(/&amp;/g, '&'); 	// ampersand
					desc = desc.replace(/  +/g, ''); 		//remove any number of spaces
					desc = desc.trim();

				results.push({name: thisName,id: thisID, desc: desc});	
				
			}).catch((err) => { console.log(err); }); 
			// you should ocassionaly check your console for errors - the servers sometimes can't handle many requests
		};
		x(name, id);
		await sleep(200);
	}
	console.log("sleeping 5 seconds");
	await sleep(5000);

	results.sort(function(a,b) { return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));});
	var json = JSON.stringify(results, null, 4);
	fs.writeFileSync('results/courses-with-description.json', json);
	console.log("updating file!");

	var end = performance.now();
	console.log((end - start) + " ms to run");
}

var text = fs.readFileSync('results/courses.json','utf8');
var allCourses = JSON.parse(text);
runCourseScraper(allCourses);
