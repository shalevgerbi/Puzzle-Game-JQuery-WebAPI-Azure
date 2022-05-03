(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady);
	let indexEmpty = "15";
	function onDeviceReady() {
        var new_tbody = $("<tbody>");
        var counter = 0;    
        for (var r = 0; r < 4; r++) {
            var new_row = $("<tr>");
            for (var c = 0; c < 4; c++) {
                var new_cell = $("<td>");
                var myButton = $('<button>');
				
				myButton.text((counter + 1).toString());
                myButton.attr('tabindex',counter);
				myButton.css('position','absolute');
				
				
				myButton.attr('class', 'buttonInTable');   		    
                myButton.appendTo(new_cell);
	            
                new_cell.appendTo(new_row);
                counter ++;
				
				
            }
            new_row.appendTo(new_tbody);
        }
		
        new_tbody.appendTo($("#myPage"));
		shuffle();
		
    };
	
	function shuffle(){
		$.ajax({
			type: 'GET',
			url: 'https://puzzlegameapi.azurewebsites.net/api/my/shuffle',
			crossDomain: true,
			async: true,
			
			success: function(results){
				let size=0;
				for(let i=0;i<15;i++){
					let R = results[i].R;
					let G = results[i].G;
					let B = results[i].B;
					let text = results[i].Text;
					
					if (i % 4 == 0)
					size ++;
			
				$('.buttonInTable[tabindex='+i+']').text(text);
				var tempButton = $('.buttonInTable[tabindex='+i+']');
				if(i!=15)
					tempButton.attr('id',text)
				else
					tempButton.attr('id',"16")
				tempButton.css('left',  100+ (i % 4) * 60 + "px"); 
				tempButton.css('top' , size * 60 + "px");
				tempButton.css("background-color", "rgb(" + R + "," + G + "," + B + ")");		

				}
				$('button[tabindex=15]').css('visibility','hidden');
			},
			error: function (xhr, textStatus,errorThrown){
				alert("ERROR");
				alert(textStatus);
				alert(errorThrown);
			}
		});

		
	}
    
	$(document).delegate('button','click',function(e){
		if ($(e).is(':animated')) {
			return;
		}		
		let currTabIndex = e.target.tabIndex.toString();
		let currID = e.target.id;
		let backColor_Pushed = $(this).css("background-color");
		backColor_Pushed = backColor_Pushed.substring(4,backColor_Pushed.length);
		let RGB_parts_Pushed = backColor_Pushed.split(',');

		let TextAndColor_Pushed = new Object();
		TextAndColor_Pushed.Text = currTabIndex;
		TextAndColor_Pushed.R = parseInt(RGB_parts_Pushed[0]);
		TextAndColor_Pushed.G = parseInt(RGB_parts_Pushed[1]);
		TextAndColor_Pushed.B = parseInt(RGB_parts_Pushed[2]);
		let JSON_str_Pushed = JSON.stringify(TextAndColor_Pushed);

		let backColor_Empty = $('body').css("background-color");
		backColor_Empty = backColor_Empty.substring(4,backColor_Empty.length);
		let RGB_parts_Empty = backColor_Empty.split(',');

		let TextAndColor_Empty = new Object();
		TextAndColor_Empty.Text = indexEmpty;
		TextAndColor_Empty.R = parseInt(RGB_parts_Empty[0]);
		TextAndColor_Empty.G = parseInt(RGB_parts_Empty[1]);
		TextAndColor_Empty.B = parseInt(RGB_parts_Empty[2]);

		let TextAndColor_Pushed_Empty = new Object();
		TextAndColor_Pushed_Empty.TextAndColor_Pushed = TextAndColor_Pushed;
		TextAndColor_Pushed_Empty.TextAndColor_Empty = TextAndColor_Empty;
		
		$.ajax({
			type: 'POST',
			url: 'https://puzzlegameapi.azurewebsites.net/api/my/currentStep',
			crossDomain: true,
			async: true,
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify(TextAndColor_Pushed_Empty),

			success: function(results){
				
				if(results.Text == "false"){
					return;
				}
				
				$('body').css("background-color",`rgb(${results.R},${results.G},${results.B})`);
				if(results.Text == "Left")
					$("#"+currID).animate({left: '-=60',},200);
				if(results.Text == "Right")
					$("#"+currID).animate({left: '+=60',},200);
				if(results.Text == "Up")
					$("#"+currID).animate({top: '-=60',},200)
				if(results.Text == "Down")
					$("#"+currID).animate({top: '+=60',},200)
				$("button[tabIndex=15]")
				$("#"+currID).attr("tabIndex",indexEmpty);
				indexEmpty =currTabIndex;
				isEnd();

			},
			error: function (xhr, textStatus,errorThrown){
				alert("ERROR");
				alert(textStatus);
				alert(errorThrown);
			}
		});
	});


function isEnd(){

	var startSizeLeft= 100;
	var startSizeTop= 60;
	let TextAndTabIndex =new Array(15);
	for(var i=0;i<15;i++){
		TextAndTabIndex[i] = new Object();
		let tempButton = $(`button[tabindex=${i}]`)
		TextAndTabIndex[i].Text = tempButton.text();
		TextAndTabIndex[i].TabIndex = i;
	}
	
	$.ajax({
		type: 'POST',
		url: 'https://puzzlegameapi.azurewebsites.net/api/my/isEnd',
		crossDomain: true,
		async: true,
		contentType: "application/json",
		dataType: "json",
		
		
		data: JSON.stringify(TextAndTabIndex),	
		
		success: function(results){
			
			if(results == true){
				setTimeout(function(){
					if(confirm('You Won!, New Game?')){
						window.location.reload();
					}
					else{
						window.close();
					}
				},250)
				
			}
		},
		error: function (xhr, textStatus,errorThrown){
			alert("ERROR");
			alert(textStatus);
			alert(errorThrown);
		}
	})

}

})();