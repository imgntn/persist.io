var myDesireTime = "";
var myDesireWant = "";

function getDesires (){
	
	
	tmp = $.get("http://persist.io:7379/SMEMBERS/desires", function(data)
	
	{
	  tmp2 = JSON.parse(data.responseText);
	  tmp3 = JSON.parse(tmp2.SMEMBERS[180]);
		myDesireTime = tmp3.time;
		myDesireWants = tmp3.wants;
	}
	
	 )
	
}
