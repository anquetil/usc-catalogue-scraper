const rp = require('request-promise');
const cheerio = require('cheerio');
const {performance} = require('perf_hooks'); //for performance.now
var fs = require('fs'); //filestream



function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function runProgramScraper(){	
	var start = performance.now();
	var results = [];

	var options = {
			uri: `http://catalogue.usc.edu/content.php?catoid=8&navoid=2401`,
			transform: function (body) { return cheerio.load(body);}
	};

	rp(options)
		.then(($) => {

			$('.block_content').children('p').each(function(i, elem) {
				var categoryName = $(this).text();
				console.log(categoryName);
				var categoryResults = { category: categoryName,
										programs: []};


				var list = $(this).next();

				list.children('li').each(function(i,elem){
					var programName = $(this).text().replace('•', '');
					programName = programName.replace('\n', '').trim();
					var programLink = $(this).children('a').attr('href');

					var beginning = programLink.indexOf('poid=') + 5;
					var end = programLink.indexOf('&returnto');
					var id = programLink.substr(beginning, end-beginning);

					console.log('\t' + programName);

					var programItem = {	name: programName, id: id};

					categoryResults.programs.push(programItem);
					console.log(programItem);
				});

				results.push(categoryResults);

			});
			
		
			var end = performance.now();
			console.log((end - start) + " ms to run");
			console.log(results);
			console.log("updating file!");
			var json = JSON.stringify(results, null, 4);
			fs.writeFileSync('results/programs.json', json);
		}).catch((err) => { console.log(err); });	
}

runProgramScraper();



