var http = require('http');

// HTTP content getter.
exports.getContent = function(host, path, callBack, index){
  
  // Fake user agent.
  var firefox = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_4; en-US) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.41 Safari/534.7'; 
  
  try {
    var request = http.request({
    	//userAgent: firefox, // h['user-agent'] = this.userAgent;
    	'user-agent': firefox,
      host: host,
      port: 80,
      method: "GET",
      path: path
    });
    
    request.on("response", function(response){
      
      var body = "";
      
      response.on("data", function(chunk){
        body += chunk;
      });
      
      response.on("end", function(){
        try {
          
          callBack({
            isSucessful: true,
            body: body, 
            index: index
          });
        } 
        catch (ex) {
          callBack({
            isSucessful: false,
            args: {
              host: host, 
              path: path, 
              callBack: callBack, 
              index: index
            },
            ex: ex
          });
        }
      });
    });
  
    // End the request
    request.end();
  }
  catch (ex) {
    callBack({
        isSucessful: false,
        args: {
          host: host, 
          path: path, 
          callBack: callBack, 
          index: index
        },
        ex: ex
      });
  }
};