require ('os');
var http = require('http');

var jsonObject = {
	"resultContext" : {
		 "aspects" :[ "title"],
		 "offset": 0,
		 "maxResults": 100
	},
	"queryContext" : {
		 "curations" : [ "ARTICLES"]
	}
};

function POSTRequest(jsonObject) {
	
	var postheaders = {
		'Content-Type' : 'application/json',
		'Content-Length' : Buffer.byteLength(JSON.stringify(jsonObject), 'utf8')
	};

	var optionspost = {
		host : 'api.ft.com', // here only the domain name
		path : '/content/search/v1?apiKey=XXXXX', // the rest of the url with parameters if needed
		method : 'POST',
		headers : postheaders
	};	
	
	var reqPost = http.request(optionspost, function(res) {
		var statusCode = res.statusCode;
		var body = '';
	
		res.on('data', function(d) {
			//JSON.parse(`${d}`);
			body += d;
		});
	
		res.on('end', function(d) {
			//JSON.parse(`${d}`);
			if (statusCode == 200) {
				var complResponse = JSON.parse(body);
				for (var i = 0; i < complResponse.results[0].results.length; i++) {
				//console.log(JSON.stringify(complResponse.results[0].results[1].title.title, null, 2));
					console.log(complResponse.results[0].results[i].title.title);
				}
			} else {
				console.log("Offending Response: ", body);
			}
		});
	});
	
	reqPost.write(JSON.stringify(jsonObject));
	reqPost.end();
	reqPost.on('error', function(e) {
		console.error("Got error: ", e);
	});
}

//FT mandates a 1 request per second limit	
setInterval(function() {
	POSTRequest(jsonObject);
	jsonObject.resultContext.offset +=100;
}, 1000);

var jj = 0;

//while (jj<2) {

//	jj++;
	
//	POSTRequest(jsonObject);
//	jsonObject.resultContext.offset +=100;
//}
