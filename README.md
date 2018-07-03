# USC Catalogue Scraper
Scraping USC's 11,500+ courses!

Included:
1. 3 Node.js files to scrape USC's courses and programs
	* courseScraper.js
	* descriptionScraper.js
	* programScraper.js
2. 4 Result JSON files
	* courses.json
		_list of courses with **name** & **id**._
	* courses-with-description.json: 
		_list of courses with **name**, **id**, and **desc**._
	* program.json:
		_list of program categories, with **category** and list of programs, each with **name** & **id**._
	* cleanCourses.json
		_cleaned up list of courses  with **name**, **id**, **desc**, and **units**._

## courseScraper.js
Searches each prefix in USC's course catalogue and returns every course id and name ([example](http://catalogue.usc.edu/search_advanced.php?cur_cat_oid=8&ecpage=1&search_database=Search&filter%5Bkeyword%5D=CSCI&filter%5Bexact_match%5D=1&filter%5B3%5D=1&filter%5B31%5D=1&sorting_type=1)).

**Input**: prefixes.txt 
**Output**: courses.json 
**Approx. Runtime**: 4 minutes  

## descriptionScraper.js
Queries every course page ([example](http://catalogue.usc.edu/preview_course_nopop.php?catoid=8&coid=120931)) by ID and returns a json with descriptions added to the course items.

_Note: I've found an error in which some queries near the end do not go through. The errors are noticeable in the console. You might need to get the descriptions by hand from the courses that failed. The result files included are not impacted by this error._ 

**Input**: courses.json 
**Output**: courses-with-description.json  
**Approx. Runtime**: 38 minutes ( 11,500+ queries, 1 every 200ms :( ) 

## programScraper.js
Queries [a single page](http://catalogue.usc.edu/content.php?catoid=8&navoid=2401) with the list of all USC programs (majors, minors, etc.), returns a json with list of programs.

**Input**: none 
**Output**: programs.json 
**Approx. Runtime**: 2 seconds
