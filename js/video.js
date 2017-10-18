$( document ).ready(function() {
   var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
   var frameMax = 392;
   var frameCount = 0;

   var dragThis = document.getElementById("dragThis");
   var container = document.getElementById("container");

   var widthFrame = 0;
   var heightFrame = 0;

   var widthCanvas = 700;
   var heightCanvas = 394;
   var canMove = true;
   var maxQuestions = 10;
   
   if(isMobile){  
    widthCanvas = 394;
    heightCanvas = 700;
  }

  var preguntaDisplay = false;

  var blurFilterContainer = new PIXI.filters.BlurFilter();
  var loader = PIXI.loader;
  var renderer = PIXI.autoDetectRenderer(widthCanvas, heightCanvas, {view:dragThis});
  renderer.view.style.position = "absolute";
  var stage = new PIXI.Stage(0xFFFFFF);

  var initFrame = 0;
  var frameScale = .00555;
  TweenMax.to(dragThis, 0, {css:{autoAlpha:0}});
  TweenMax.to($("#pregunta"), 0, {css:{autoAlpha:0}});
  TweenMax.to($("#texto"), 1, {css:{autoAlpha:.5}});
  
  $("#texto").text(initFrame);

  

  function swipe2(event, phase, direction, distance) {
    if(direction == "down"){
      initFrame -= (distance * frameScale);
    }
    if(direction == "up"){
      initFrame += (distance * frameScale);
    }
    moveTheVideoFRAMES();
  }
  function endTrivia(){
      if(isMobile){
          $("#texto").swipe.destroy();
      }else{
        $("#texto").off('mousewheel');
      }
  }
  function launchQ(){
    console.log("WTF??");
    canMove = false;
    TweenMax.to($("#pregunta"), .5, {css:{autoAlpha:1}});
    TweenMax.to(blurFilterContainer, .25, {blur:5});
   
    $("#pregunta").text("PREGUNTA " + (frameCount+1));
  }

  function nextq(){
    TweenMax.to(blurFilterContainer, .15, {blur:0});
    TweenMax.to($("#pregunta"), .5, {css:{autoAlpha:0}});
    preguntaDisplay = false;
    canMove = true;
    ++frameCount;
    console.log("PREGUNTA " + (frameCount+1)+ " CONTESTADA");
    if(frameCount == maxQuestions){
      endTrivia();
    }
  }

  function moveTheVideoFRAMES(){
    var framePregunta = [100, 150, 200, 392];

    if(initFrame <= 0){
      initFrame = 0;
    }
    if(initFrame >= framePregunta[frameCount]){
      if(preguntaDisplay == false){
        launchQ();
        preguntaDisplay = true;
      }
      initFrame = framePregunta[frameCount];
    }
    if(theVideo){
      if(canMove)
        theVideo.gotoAndStop(initFrame>>0);
    }
    $("#texto").text("Vamos en el frame:" + (initFrame>>0) + "/" + frameMax);
  }

    var theVideo;
    var videoArr = [];
      var urlPath = "test-imagina/ref_animacion_"//"sonyreal/SONY_FULL_DROP_05_" ; 

      //urlPath = "/v11/sony_Smartband11-700px/sony_Smartband11-700px_"
      loader = PIXI.loader
      for(var i = 0; i<frameMax; ++i){
        var leading = pad (i, 5);
        loader.add('frame' + i, urlPath + leading + ".jpg");
      }

      loader.on('progress', function (loader, loadedResource) {
        var progressStr = 'Progress:' + (loader.progress>>0) + '%';
        $("#texto").text(progressStr);
      });

      loader.load(function (loaderKick, resources) {
        widthFrame = resources["frame0"].texture.width;
        heightFrame = resources["frame0"].texture.height;
        
        for(var i = 0; i<frameMax; ++i){
          videoArr.push(resources["frame" + i].texture);
        }

        theVideo = new PIXI.extras.MovieClip(videoArr);
        theVideo.animationSpeed = 1;

        blurFilterContainer.blur = 0;
        blurFilterContainer.dirty = true;
        theVideo.filters = [blurFilterContainer];
        
        theVideo.gotoAndStop(0);
        stage.addChild(theVideo);
        TweenMax.to(dragThis, 1, {css:{autoAlpha:1}});
        resizePixi($(window).width(), $(window).height());
        $("#texto").text("todos los frames cargados");
        window.scrollTo(0,1);
      });

          //FUNCTIONS
          requestAnimationFrame(animate);
          function animate() {
            requestAnimationFrame(animate);
            stats.begin();
            renderer.render(stage);
            stats.end();
          }
          function pad (str, max) {
            str = str.toString();
            return str.length < max ? pad("0" + str, max) : str;
          }


          $( window ).resize(function() {
            resizePixi($(window).innerWidth(), $(window).innerHeight());
          });
          function toFull(){
          //launchIntoFullscreen(document.documentElement);
        }
        function launchIntoFullscreen(element) {
          if(element.requestFullscreen) {
            element.requestFullscreen();
          } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        }
        //
        function resizePixi(w, h){
            // 
            theVideo.width = widthFrame * 3;
            theVideo.height = heightFrame * 3;

            var ratio = 0;
            var width = theVideo.width;//renderer.view.style.width;   
            var height = theVideo.height;//renderer.view.style.width;  
            var maxWidth = w;
            var maxHeight = h;
            
            renderer.view.style.width = w + "px";
            renderer.view.style.height = h + "px";

            renderer.resize(w, h);

            if(width > maxWidth){

              ratio = maxWidth / width;   
              theVideo.height = (height * ratio);
              theVideo.width = maxWidth;
                height = height * ratio;    // Reset height to match scaled image
                width = width * ratio; 
              }else if(height > maxHeight){

                ratio = maxHeight / height; 
                theVideo.width = (width * ratio);
                theVideo.height = maxHeight;
                height = height * ratio;    // Reset height to match scaled image
                width = width * ratio; 
              }
              console.log("ratio" + ratio);
              if(isMobile){
                theVideo.x = -theVideo.width *.5;
              }
            }

            var stats = new Stats();
            stats.setMode(0); // 0: fps, 1: ms

            // align top-left
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';

           // document.body.appendChild( stats.domElement );

            // EVENTO DE WHEEL DE MOUSE & DRAG
           
            if(isMobile){

              $("#texto").swipe({ swipeStatus:swipe2, allowPageScroll:"vertical"} );
            }else{
               $('#texto').on('mousewheel', function(event) {
                  initFrame -= (event.deltaY * frameScale * 2);
                  moveTheVideoFRAMES();
               });
            }
            //

            $( "#pregunta" ).bind( "click", function() {
                if(canMove == false)
                nextq();
            });

});
