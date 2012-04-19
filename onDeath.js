/*
function onDeath () {


addDeathTree();


}

function addDeathTree()

{
	
	$.get("http://bethere.io:7379/SADD/deathTrees/"+JSON.stringify(scene2treeContainer2.position));
	
}
*/


var deathTreeArrayFetch, deathTreeArrayParse, deathTreeArrayStaging;



var deathTreeArray = [];
var deathTreePositionArray = [];

var length, i, temp;

function onDeath (){
	
 	deathTreeArrayFetch = $.ajax({
	  url: "http://bethere.io:7379/SMEMBERS/deathTrees",
	  context: document.body,
	dataType: "json",
		  success: function(){
	    deathTreeArrayParse =  JSON.parse(deathTreeArrayFetch.responseText);
			length = deathTreeArrayParse.SMEMBERS.length;
				for (i=0; i< length; i++){
					temp = deathTreeArrayParse.SMEMBERS[i];
		temp=JSON.parse(temp);
				deathTreePositionArray.push(temp);
					//console.log(temp);
	  }
	}
	
	});
}
	
	/*
	$(document).ajaxError(function(e, xhr, settings, exception) {
	alert('error in: ' + settings.url + ' \n'+'error:\n' + xhr.responseText );
	});
	*/
