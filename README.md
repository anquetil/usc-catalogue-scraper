# USC Catalogue Scraper
Scraping USC's 11,500+ courses

Included:
1. 3 Node.js files to scrape USC's courses and programs
	* courseScraper.js
	* descriptionScraper.js
	* programScraper.js
2. 4 Result JSON files
	* courses.json
	* courses-with-description.json
	* program.json
	* cleanCourses.json: a list of courses cleaned up by hand(ish) and with array of possible unit count for each course

### courseScraper.js
Searches each prefix in USC's course catalogue and returns every course id and name ([example](http://catalogue.usc.edu/search_advanced.php?cur_cat_oid=8&ecpage=1&search_database=Search&filter%5Bkeyword%5D=CSCI&filter%5Bexact_match%5D=1&filter%5B3%5D=1&filter%5B31%5D=1&sorting_type=1)).

**Input: prefixes.txt
**Output: courses.json - alphabetized list of courses with **name** & **ID** (used for querying in descriptionScraper)
**Approx. Runtime**: 

### descriptionScraper.js
Queries every course page ([example](http://catalogue.usc.edu/preview_course_nopop.php?catoid=8&coid=120931)) by ID and returns a json with descriptions added to the course items.

_Note: I've found an error in which some queries near the end do not go through. The errors are noticeable in the console. You might need to get the descriptions by hand from the courses that failed. The result files included are not impacted by this error._ 

**Input**: courses.json
**Output**: courses-with-description.json - list of courses with **name**, **ID**, and **desc**.
**Approx. Runtime**: 38 minutes ( 11,500+ queries, 1 every 200ms :( ) 

### programScraper.js
Queries [a single page](http://catalogue.usc.edu/content.php?catoid=8&navoid=2401) with the list of all USC programs (majors, minors, etc.), returns a json with list of programs.

**Input**: none
**Output**: programs.json - list of program categories, with **category** and list of programs, each with **name** & **id**.
**Approx. Runtime**: 2 seconds
