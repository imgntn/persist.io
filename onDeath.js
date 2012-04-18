
function onDeath () {


addDeathTree();


}

function addDeathTree()

{
	
	$.get("http://bethere.io:7379/SADD/deathTrees/"+JSON.stringify(scene2treeContainer2.position))
	
}


var deathTreeArrayFetch, deathTreeArrayParse, deathTreeArrayStaging;

var deathTreeArray = [];



function deathTreeArrayGet () {
	
	deathTreeArrayFetch = $.get("http://bethere.io:7379/SMEMBERS/deathTrees")
	.success(function (){
			
			deathTreeArrayParse = JSON.parse(deathTreeArrayFetch.responseText);
			deathTreeArrayStaging = deathTreeArrayParse.SMEMBERS;
			deathTreeArray.push(deathTreeArrayStaging);
			
	deathTreeJSON();
	
			});
	
	
}

var i;
var deathTreePositionArray = [];
var temp;

function deathTreeJSON()
{
	for (i=0; i <= deathTreeArrayStaging.length ; i++)
		{
			temp = JSON.parse(deathTreeArray[0][i]);
			deathTreePositionArray.push(temp);
		}
}





