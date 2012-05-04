var myDesireTime = "";
var myDesireWant = "";

function getDesires (){
	
	
	tmp = $.get("http://bethere.io:7379/SMEMBERS/desires", function(data)
	
	{
	  tmp2 = JSON.parse(data.responseText);
	  tmp3 = JSON.parse(tmp2.SMEMBERS[180]);
		myDesireTime = tmp3.time;
		myDesireWants = tmp3.wants;
	}
	
	 )
	
}

$.get('ajax/test.html', function(data) {
  $('.result').html(data);
  alert('Load was performed.');
});