const rp = require('request-promise');
const cheerio = require('cheerio');
const {performance} = require('perf_hooks'); //for performance.now
var fs = require('fs'); //filestream



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runCourseScraper(prefixes){
	var dictionary = [];
	var more = [];
	var courses = [];
	for(var j = 0; j < prefixes.length; j++){ //initialize
		more[j] = true;
		courses[j] = [];
	}

	var pagenumber = 1; 
	var abbrev = '';
	while(true){ // loop through all pagenumbers

		for(var i = 0; i < prefixes.length; i++){ // go through each prefix
			abbrev = prefixes[i];
			
			if(more[i]){ //if this prefix has more pages left

				console.log('Querying Page ' + pagenumber + ' of ' + abbrev + ' (' + (i) + ')');

				var options = {
					uri: `http://catalogue.usc.edu/search_advanced.php?cur_cat_oid=8&ecpage=` + pagenumber + `&search_database=Search&filter%5Bkeyword%5D=` + abbrev + `&filter%5Bexact_match%5D=1&filter%5B3%5D=1&filter%5B31%5D=1&sorting_type=1`,
					transform: function (body) { return cheerio.load(body);}
				};

				var x = function(thisi, thispage, thisabbrev){
					return rp(options)
					.then(($) => {
						var results = [];

						$('#whatever').next().next().children('tbody').children('tr').children('td').not('.acalog-highlight-ignore').children('a').each(
							function(i, elem) {
								var name = $(this).text();
								var courseLink = $(this).attr('href');
								var id = courseLink.substr(courseLink.lastIndexOf('=') + 1); //last 6 digits is ID

								results.push({name: name,id: id});
							}
						);
						
						
						if(results[0].name === ''){ 
							//if no classes on this page
							more[thisi] = false;
							console.log("NONE - "  + thispage + ' of ' + thisabbrev + ' (' + (thisi) + ')');
							courses[thisi].forEach((v,i) => dictionary.push(v));
						} else { 
							//if classes found on this page
							courses[thisi] = courses[thisi].concat(results);
							console.log("FOUND - "  + thispage + ' of ' + thisabbrev + ' (' + (thisi) + ')');
						}
						
					}).catch((err) => { console.log(err); });
				};

				x(i, pagenumber, abbrev);

				await sleep(100); //can only do around 10 queries a second
			}	
		}
		await sleep(3000); //wait a bit for all to finish

		pagenumber++;

		var MoreGlobal = false;
		for(var k = 0; k < prefixes.length; k++){
			if(more[k] === true){ //if at least one prefix has more left, continue
				MoreGlobal = true;
			}
		}

		if(!MoreGlobal) dictionary.sort(function(a,b) { return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));});
		//sort at end

		var json = JSON.stringify(dictionary, null, 4);
		console.log("updating file!");
		fs.writeFileSync('results/courses.json', json); // write to file as we go

		if(!MoreGlobal) break; //if no more classes anywhere
	}
}


var text = fs.readFileSync('results/prefixes.txt','utf8');
var prefixes = text.split(",");
runCourseScraper(prefixes);



