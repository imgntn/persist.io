var tmp, tmp1, tmp2;
var getDesiresResultsWants=[];
var getDesiresResultsTime=[];
				function getDesires (){


					tmp = $.get("http://bethere.io:7379/SMEMBERS/desires", function(data)

					{
						tmp1 = tmp.responseText;
					 	tmp2 = JSON.parse(tmp1);
				
						
							
							for(var i=0;i<tmp2.SMEMBERS.length;i++){
								tmp3 = JSON.parse(tmp2.SMEMBERS[i]);
								getDesiresResultsWants.push(tmp3.wants);
								getDesiresResultsTime.push(tmp3.time);
							};
							}
					 );
				
					 
					
				}