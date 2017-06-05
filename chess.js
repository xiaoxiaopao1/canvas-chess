window.onload=function(){
	var chess = document.getElementById('canvas');
	var context = chess.getContext('2d');

	var me = true;
	var over = false;
	var chessBox = [];

	// 赢法数组
	var wins = [];


	//赢法统计数组
	var myWin = [];
	var computerWin = [];


	//初始化棋盘二维数组
	for (var i = 0; i < 15; i++) {
		chessBox[i] = [];
		for (var j = 0; j < 15; j++) {
			chessBox[i][j] = 0;
		}
	}

	// 初始化赢法数组
	for (var i = 0; i < 15; i++) {
		wins[i] = [];
		for (var j = 0; j < 15; j++) {
			wins[i][j] = [];
		}
	}

	var count = 0;

	//竖线赢法
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[i][j + k][count] = true;
			}
			count++;
		}
	}

	//横线赢法
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[j + k][i][count] = true;
			}
			count++;
		}
	}

	//反斜线赢法
	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				wins[i + k][j + k][count] = true;
			}
			count++;
		}
	}
	
	// 斜线赢法
	for (var i = 0; i < 11; i++) {
		for (var j = 14; j > 3; j--) {
			for (var k = 0; k < 5; k++) {
				wins[i + k][j - k][count] = true;
			}
			count++;
		}
	}

	for (var i = 0; i < count; i++) {
		myWin[i] = 0;
		computerWin[i] = 0;
	}


	var logo = new Image();
	logo.src = "Image/black.jpg";
	logo.onload = function(){
		context.drawImage(logo,0,0,450,450);
		drawChessBox();


	}
	
	var drawChessBox = function(){
		context.strokeStyle = "#BFBFBF";

		for (var i = 0; i < 15; i++) {
			context.save();
			context.moveTo(15 + i * 30,15);
			context.lineTo(15 + i * 30,435);
			context.restore();
			context.stroke();
			

			context.save();
			context.beginPath();
			context.moveTo(15, i * 30 + 15);
			context.lineTo(435, i * 30 + 15);
			context.restore();
			context.stroke();
		}
	}

	var oneStep = function(i,j,me){
		context.save();
		context.beginPath();
		
		context.arc(15 + i * 30,15 + j * 30,13,0,2 * Math.PI);
		context.closePath();
		var gradient = context.createRadialGradient(15 + i * 30 + 2,15 + j * 30 - 2,13,15 + i * 30 + 2,15 + j * 30 - 2,0);
		if (me) {
			gradient.addColorStop(0,"#0A0A0A");
			gradient.addColorStop(1,"#636363");
		}
		else{
			gradient.addColorStop(0,"#D1D1D1");
			gradient.addColorStop(1,"#F9F9F9");
		}
		context.fillStyle = gradient;
		
		context.fill();
		context.restore();
	}

	chess.onclick = function(e){
		if (over) {
			return;
		}
		if (!me) {
			return;
		}
		var x = e.offsetX;
		var y = e.offsetY;
		var i = Math.floor(x / 30);
		var j = Math.floor(y / 30);

		if (chessBox[i][j] == 0) {
			oneStep(i,j,me);
			chessBox[i][j] = 1;

			//假如第一个点在四种赢法里面，分别为1,2,3,4种赢法，则myWin[1]=1,myWin[2]=1,myWin[3]=1,myWin[4]=1
			// 假如在上述基础上，第二个点在2,3种赢法里，则myWin[1]=1,myWin[2]=2,myWin[3]=2,myWin[4]=1
			//......
			//在任意一种赢法里面占有了5个点，即为赢
			for(var k = 0; k < count; k++){
				if (wins[i][j][k]) {
					myWin[k]++;
					computerWin[k] = 6;
					if (myWin[k] == 5) {
						window.alert("你赢了");
						over = true;
					}
				}
			}

			//切换电脑操作
			if (!over) {
				me =!me;
				computerAI();
			}
		}
		
	}


	var computerAI = function(){
		var myScore = [];
		var computerScore = [];
		var max = 0;
		var u = 0,v = 0;

		for (var i = 0; i < 15; i++) {
			myScore[i] = [];
			computerScore[i] = [];
			for(var j = 0;j < 15; j++){
				myScore[i][j] = 0;
				computerScore[i][j] = 0;
			}
		}

		for (var i = 0; i < 15; i++) {
			for(var j = 0; j< 15; j++){
				if (chessBox[i][j] == 0) {
					for(var k = 0; k < count; k++){
						if (wins[i][j][k]) {
							switch(myWin[k]){
								case 1:
								myScore[i][j] += 200;
								break;

								case 2:
								myScore[i][j] += 400;
								break;

								case 3:
								myScore[i][j] += 2000;
								break;

								case 4:
								myScore[i][j] += 10000;
								break;
							}

							switch(computerWin[k]){
								case 1:
								computerScore[i][j] += 220;
								break;

								case 2:
								computerScore[i][j] += 420;
								break;

								case 3:
								computerScore[i][j] += 2100;
								break;

								case 4:
								computerScore[i][j] += 20000;
								break;
							}
						}
					}
					if (myScore[i][j] > max) {
						max = myScore[i][j];
						u = i;
						v = j;
					}else if (myScore[i][j] == max) {
						if (computerScore[i][j] > computerScore[u][v]) {
							u = i;
							v = j;
						}
					}

					if (computerScore[i][j] > max) {
						max = computerScore[i][j];
						u = i;
						v = j;
					}else if (computerScore[i][j] == max) {
						if (myScore[i][j] > myScore[u][v]) {
							u = i;
							v = j;
						}
					}
				}
			}
		}
		oneStep(u,v,false);
		chessBox[u][v] = 2;
		for(var k = 0; k < count; k++){
			if (wins[u][v][k]) {
				computerWin[k]++;
				myWin[k] = 6;
				if (computerWin[k] == 5) {
					window.alert("计算机赢了");
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
		}
	}
}