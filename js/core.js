//init vars
var currSel;
var opacity = 100;
var winWidth = 1920;
var winHeight = 1200;
var selBlk;
var linesDrawn = false;
var lsnLoaded = false;
var blkImgsClr = false;
var lstTitle;
var lstSel;
var colMarTop;
var oldHt;
var numCol = 4; //@TODO: add responsive column behavior

$(document).ready(function(){
	//populates blkCol based on DATA object in structure.js
	popBlkData(); 
	//adjusts block image and text heights on initial load and window resizing
	setLayout(); 
	$(window).resize(function(){
		setLayout();
	});
	//allows user to skip setTimeout block animation below by clicking anywhere on body
	$("body").click(function(){
		if(!blkImgsClr){
			blkImgsClr = true;
			if(!linesDrawn){
				blockInAnim();
			}
			blockOutAnim();
		}
	});
	//pause and then execute opening animation
	setTimeout(function(){ 
		if(!linesDrawn){
			blockInAnim();
			setTimeout(function(){
				blockOutAnim();
			}, 2000);
		}
	}, 2000);
});

function popBlkData(){
	//populates block area based on blocks within structure file
	var bCont = $("#blkConts");
	var bInsert = "";
	var bNum;
	for(i = 0; i < DATA.arrBlks.length; i++){
		if(DATA.arrBlks[i].lsnNames.length <= 9){
			bNum = "0" + DATA.arrBlks[i].lsnNames.length;
		} else {
			bNum = DATA.arrBlks[i].lsnNames.length;
		}
		bInsert += "<article id='blkCont_" + (i + 1) +"' title='" + DATA.arrBlks[i].name + "'><h4>" + DATA.arrBlks[i].name + "</h4><p class='lsnNum'><span>" + bNum + "</span><br>Topics</p></article>";
	}
	bCont.append(bInsert);
}

function setLayout(){
	switch(numCol){
		case 4:
			//sets wrapper class height based on dimensions of full image
			var fullImgHt = $(".fullImg").height();
			var wrapHt = fullImgHt + (fullImgHt * 0.43);
			$(".wrapper").css("height", wrapHt + "px");
			//sets header tag height and then top of full image
			$("header").css("height", (wrapHt * 0.15) + "px");
			$(".fullImg").css("top", $("header").height());
			//sets column dimensions based on full image dimensions
			var fullImgWt = $(".fullImg").width();
			$(".fourCol .blkCol, .fourCol .lsnCols, #lsnConts").css("height", fullImgHt + "px");
			$(".fourCol .blkCol, .fourCol .lsnCols article").css("width", (fullImgWt * 0.245) + "px");
			$("").css("width", fullImgWt + "px");
			//sets dimensions and placement of block articles and block spacer elements
			var blockHt = (fullImgHt * 0.115);
			var numBlks = $("#blkConts article").length;
			var blkMargin = (fullImgHt - (blockHt * numBlks))/(numBlks-1);
			$("#blkImgs article, #blkConts article").css("height", blockHt + "px");
			$("#blkImgs article, #blkConts article").css("margin-bottom", blkMargin + "px");
			$(".bSpacer").css("height", blkMargin + "px");
			$(".bSpacer").css("margin-top", "-" + blkMargin + "px");
			//horizontal spacing vars
			var horzSpacerWt = (fullImgWt - ((fullImgWt * 0.245)*4))/3;
			var xPos = $("#blkConts").position();
			xPos = xPos.left + $(".blkCol").width();
			//based on vertical position of block, determines position of background image
			$("#blkImgs article").each(function(){
				var $el = $(this);
				var blkPos = $el.position();
				$el.css("background-position","0 -" + blkPos.top + "px");
			});
			//sets dimensions and placement of vertical lines opening animation
			$(".horzSpacer").css("height", fullImgHt + "px");
			$(".horzSpacer").css("width", horzSpacerWt + "px");
			$(".horzSpacer").each(function(i){
				var nxtPos = (xPos * (i + 1)) + (horzSpacerWt * i);
				$(this).css("left", nxtPos + "px");
			});
			//places each lesson column after each horzontal spacer
			$(".lsnCols article").each(function(i){
				var currHorzSp = $("#horzSp_" + (i + 1));
				var currPos = currHorzSp.position();
				currPos = currPos.left + currHorzSp.width();
				$(this).css("left", currPos + "px");
				$(this).css("background-position","-" + currPos + "px 0");
			});
			$(".contCol").each(function(i){
				var currCont = $("#contCol_" + (i + 1));
				var currImg = $("#lsnImg_" + (i + 1));
				currCont.css("left", currImg.position().left - (currImg.width() + horzSpacerWt) + "px");
				currCont.css("width", currImg.width() + "px");
			});
			//sets dimensions and placement of lesson background
			$("#lsnConts").css("left", ($("#horzSp_1").position().left + $("#horzSp_1").width()) + "px");
			$("#lsnConts").css("top", $(".fullImg").position().top - $("header").height() + "px");
			$("#lsnConts").css("width", ($("#lsnImg_3").position().left - $("#lsnImg_1").position().left)+$("#lsnImg_3").width() + "px");
			break;
		case 3:
			break;
		case 2:
			break;
		case 1:
			break;
	}
}

function blockInAnim(){
	//draws horizontal and vertical lines for blocks and columns
	TweenMax.staggerTo(".bSpacer", 0.25,{marginLeft:0, ease:Sine.easeInOut}, 0.125); //tweens from -100% margin-left
	TweenMax.staggerTo($(".horzSpacer").get().reverse(), 0.25,{top:0, ease:Sine.easeInOut}, 0.25); //tweens from -100% top
	linesDrawn = true;
}

function blockOutAnim(){
	//block images slide out/fade out
	var blkArticle = $("#blkImgs article");
	if(blkArticle.css("background-position-x") != undefined || blkArticle.css("background-position-x") != null){ 
		TweenMax.staggerTo(blkArticle.get().reverse(), 0.8,{"background-position-x":"+=150%", ease:Power4.easeIn}, 0.2);
	} else {
		TweenMax.staggerTo(blkArticle.get().reverse(), 0.8,{"background-position-x":"+=150%", ease:Power4.easeIn}, 0.2); //fallback for IE to still slide out images
		TweenMax.staggerTo(blkArticle.get().reverse(), 0.8,{alpha:0, ease:Power4.easeIn}, 0.2); //fallback for Firefox/Opera to fade out block images
	}
	blkImgsClr = true;
	//sets block button functionality
	$(".blkCol article").addClass("on");
	$(".blkCol article").click(function(){
		//stores block ID and passes to popLsnData function
		var blockID = $(this).attr("id");
		$(".blkCol article").removeClass("active");
		$(this).toggleClass("active");
		popLsnData(blockID);
		if(!lsnLoaded){
			lsnAnim();
		}
		lsnLoaded = true;
	});
	//shifts layer order of block images and content for mouse events
	setTimeout(function(){
		$("#blkImgs").css("z-index","1");
		$("#blkConts").css("z-index","2");
	},2500);
}

function lsnAnim(){
	//zooms in lesson column background image and fades in lesson content
	TweenMax.to("#lsnImgs article", 1, {paddingLeft:"150%", ease:SlowMo.easeOut});
	TweenMax.to("#lsnConts", 2, {alpha:1, ease:Power4.easeInOut});
}

function popLsnData(who){
	//clears any existing content in lesson columns first
	$(".contCol").each(function(){
		$(this).html("");
	});
	//saves index number of block that was clicked
	selBlk = Number(who.slice(who.length -1, who.length)) -1;
	//loops through every array item in the current block to populate columns with topic names
	for(i = 0; i < DATA.arrBlks[selBlk].lsnNames.length; i++){ 
		var pID = "lsn_" + (i + 1);
		var lsnName = DATA.arrBlks[selBlk].lsnNames[i];
		//fix for lessons titles that are too long to fit in columns
		if(lsnName.length > 30){
			lsnName = lsnName.slice(0,30) + "...";
		}
		//creates var to store html that is appended to columns
		var lsnInsert = "<p class='lsn' id='" + pID + "' onclick='lsnClick(" + pID + ")'>" + lsnName + "</p>";
		//based on current iteration, determines appropriate column to append content to
		if(i <= 12){
			$("#contCol_1").append(lsnInsert);
		} else if(i > 12 && i <= 25){
			$("#contCol_2").append(lsnInsert);
		} else {
			$("#contCol_3").append(lsnInsert);
		}
	}
	//tweens new content in
	TweenMax.staggerFrom(".contCol p", 0.25, {marginLeft:"-100%", ease:SlowMo.easeIn}, 0.01);
}

function lsnClick(pID){
	//removes any existing topic popups
	$(".lsnPopup").remove();
	$(".lsn").removeClass("active");
	//creates reference to parent element of popup
	var $el = $(pID);
	$el.addClass("active");
	//creates ID for popup reference later
	var popID = $el.attr("id") + "_img";
	//creates reference to array number for use in append action below
	var arrNum = Number($el.attr("id").slice(4,$el.attr("id").length)) - 1;
	//creates topic click event popup
	$el.append("<div id='" + popID + "' class='lsnPopup' style='opacity:0.0;'><div class='imgOvrly' title='Launch Topic'><img class='playBtn' src='img/playIcon.svg'><img src='img/stock/" + (arrNum + 1) + ".jpg' class='tpcImg'></div><p><b style='color:#676c74 !important;'>Description:</b> " + DATA.arrBlks[selBlk].lsnDescr[arrNum] + "</p><p><b style='color:#676c74 !important;'>Duration:</b> " + DATA.arrBlks[selBlk].lsnDur[arrNum] + "</p></div>");
	//creates reference var to popup area for removal later
	var popRef = $("#" + popID);
	//tweens visibility of popup in
	TweenMax.to(popRef, 0.5, {alpha:1, ease:Power4.easeInOut});
	//creates reference var to popup area's parent column to scroll to
	var currCol = popRef.closest(".contCol");
	currCol.animate({
      scrollTop: popRef.position().top
    }, 250);
}

function lsnRollout(pID){
	//creates reference to popup to remove
	var popRef = $("#" + $(pID).attr("id") + "_img");
	TweenMax.to(popRef, 0.5, {alpha:0, ease:Power4.easeInOut, onComplete:removeEl, onCompleteParams:[popRef]});
}

function removeEl(who){
	who.remove();
}

function loadLsn(lsnNum){
	//loads lesson based on data from structure.js
	//@TODO: Add alert box for demo
}