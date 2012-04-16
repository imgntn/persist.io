var nodeQuery = require("nodeQuery");

nQuery
  .use(function ($) {

    // similar to $(document).ready, this function
    // is called after the client DOM is ready, a callback is passed
    // aswell, which calls nQuery.ready on the browser
    $.on('ready', function (callback) { 

      $('body').append('<a href="#" class="link">Click me, Im a binding.</a>')

	  // call "nQuery.ready()" on the browser
	      callback()
	    })
	  })