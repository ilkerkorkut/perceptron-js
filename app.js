/**
* x:[-1,1] y:[-1,1] eksenleri arasında olmalı
* x:[-1,1] , y:[-1,1] points must be that axis.
*/
function randomPoint(){
   return -1 + Math.random() * (1 - (-1));
}

/**
* -1 Kırmızı , 1 Mavi olacak şekilde type alıyoruz
* -1 is Red, 1 is Blue, getting types
*/
function getType(seperator, point){
   return sign((seperator.x2-seperator.x1) * (point.y-seperator.y1) - (seperator.y2-seperator.y1) * (point.x-seperator.x1));
}

/**
* Random datanın mutlaka doğrusal ayrılabilen(linearly seperable) olması için bir seperator oluşturuyoruz
* Random data must be linearly seperable , so creating a seperator for current data
*/
function seperatorForData(){
   var seperator = {};
   seperator.x1 = sign(randomPoint());seperator.y1 = randomPoint();
   seperator.x2 = randomPoint();seperator.y2 = sign(randomPoint());
   seperator.type = "seperator"; seperator.color= "#000";
   return seperator;
}
/**
 * Random veri olusturma fonsyionu
 * Random data creating function
 * @param  {[Object]} seperator [Ayrac objesi verilip ayracin koordinatlarina gore type belirlenerek noktalar olusturulmakta] [In respect of separator's coordinates, deciding the points's types]
 * @param  {[Number]} n         [Olusturulacak veri adedi] [Data count]
 * @return {[Array]}           [n uzunlukta Point array] [n length Point array]
 */
function createRandomData(seperator, n){
   var arr = [];
   var checkSeperable = {
      red: 0,
      blue: 0
   }
   for(var i=0; i<n; i++){
      var point = {};
      point.x = randomPoint();
      point.y = randomPoint();
      point.w0 = 1;  // W0 olarak ekleniyor [initial weight value]
      point.type = getType(seperator, point);   // Elde edilen noktanın tipi (-1 veya 1 olarak) [Type of the created Point]
      if(point.type == -1){
         checkSeperable.red += 1;
      }else if(point.type == 1){
         checkSeperable.blue += 1;
      }
      arr.push(point);
   }
   if(checkSeperable.red > 0 && checkSeperable.blue > 0){
      return arr;
   }else{
       return createRandomData(seperator, n);
   }
}
var graph = new Graph();
graph.init();
var svg = graph.svg;

var hasPerceivedLine = false;
/**
 * Her iterasyon sonrasi cagirilan callback fonksiyonu
 * Callback function that triggers after per iteration
 * @param  {[Array]} weightCurrent      [Suanki agirliklarin arrayi] [Current weight array]
 * @param  {[Number]} iter               [Suanki iterasyonun numarasi] [Current iteration number]
 * @param  {[type]} currentLearntPoint [Mevcut ogrendigi nokta] [Current learnt Point]
 * @return {[type]}                    [void]
 */
function iteration(weightCurrent, iter, currentLearntPoint){
   var perceivedLine = createLineAccordingToWeights(weightCurrent);
   if(!hasPerceivedLine){
      graph.addLine(perceivedLine);
      hasPerceivedLine = true;
   }else{
      graph.adjustLine(perceivedLine);
   }
   var html = '<div class="iter">İterasyon:<strong>'+iter+'</strong> Şuanki Ağırlıklar:<strong>'+weightCurrent[0].toFixed(5)+' '+weightCurrent[1].toFixed(5)+'</strong> Öğrenilen Nokta : <strong>'+JSON.stringify(currentLearntPoint)+'</strong> </div>'
   $("#iterations").append(html);
}

// Is iterations finished
var finished = false; // Global iterasyon bitip bitmedigine dair degisken, default false'dur. Iterasyonlar bittiginde true degeri alir
/**
* Iterasyonlarin bittiginde calisan callback fonksyionu,
* son iterasyondan sonra iterasyonlarin bittigine dair ekrana log atar.
* When iterations finished this function will be triggered, and logs as html
*/
function finishCallback(weight, iteration){
   var html = "<div>İterasyonlar bitti.</div>";
   finished=true;
   $("#iterations").append(html);
}

// New Perceptron instance
var perceptron = new Perceptron(); // Yeni Perceptron object instance'i olusturulur

// Global points object
var points; // Olusturulacak noktalar global point degiskenine aktarilir

// Random noktalarin olusturulma click event'i
// Click event that creates random points
$("#create-points").on("click",function(){
   graph.removeLines();
   graph.removePoints();
   var pointCount = $("#point-count").val();
   var seperator = seperatorForData();
   graph.addLine(seperator);
   points = createRandomData(seperator, pointCount);
   var pHtml = "";
   for(var i=0; i<points.length; i++){
      var p = points[i];
      var tip = "";
      if(p.type == -1){
         tip = "Kirmizi";
      }else{
         tip = "Mavi";
      }
      pHtml += "<tr><td>"+p.x+"</td><td>"+p.y+"</td><td>"+tip+"</td></tr>"
   }
      $("#created-points tbody").html(pHtml);
   graph.addPoint(points);
});
// Egit butonu event'i
// Training button event
$("#train").on("click",function(){
   var stepSpeed = $("#step-speed").val();
   startWithStepByStep(points, stepSpeed);
});
// Ekrani resetlemek icin event
// Reset workplace
$("#again").on("click",function(){
   location.reload();
});
/**
* Perceptron algoritmasının iterasyonları
* Perceptron's iterations
*/
function startWithStepByStep(points, stepSpeed){
   if(!finished){
      perceptron.train(points, iteration, finishCallback);
      setTimeout(function(){
         startWithStepByStep(points, stepSpeed);
      },stepSpeed);
   }
}
/**
* Iterasyonlarla birlikte yakinsadigi ayiraci gorsellestirebilmek amaciyla
* duzlem uzerinde x1,y1 ve x2,y2 noktalarina sahip yesil renkte ayiracin koordinatlari o anki agirliklara gore olusturuluyor
* In order to visualize the separator together with the Iterations, the coordinates of green color with x1, y1 and x2, y2 points on the plane are created according to the current weight.
*/
function createLineAccordingToWeights(weights) {
   var x1 = -1 * (weights[1] * 1 + weights[2]) / weights[0];
   var x2 = -1 * (weights[1] * -1 + weights[2]) / weights[0];
   var y1 = -1 * (weights[0] * 1 + weights[2]) / weights[1];
   var y2 = -1 * (weights[0] * -1 + weights[2]) / weights[1];

   var coordinates = [];
   var line = {};
   line.type = "perceived-line";
   line.color = "green";

   line.x1 = x1;
   line.y1 = y2;
   line.x2 = x2;
   line.y2 = y2;

   if(y2 >= -1 && y2 <= 1) {
      coordinates.push([-1, y2]);
      line.x2 = -1;
   }
   if(y1 >= -1 && y1 <= 1) {
      coordinates.push([1, y1]);
      line.x1 = 1;
   }
   if(x2 >= -1 && x2 <= 1) {
      coordinates.push([x2, -1]);
      line.y2 = -1;
   }
   if(x1 >= -1 && x1 <= 1) {
      coordinates.push([x1, 1]);
      line.y1 = 1;
   }
   if(coordinates.length !== 2){
      // Eğer koordinatlar toplamda 4 adet değilse line perceived line oluşturlamayacağı için default [0,0],[0,0] noktası oluşturuyoruz
      // If total coordinates count not equals to 4 , it can't create perceived line, so created default [0,0],[0,0] point
      coordinates = [[0,0],[0,0]];
      line.x1 = 0;
      line.y1 = 0;
      line.x2 = 0;
      line.y2 = 0;
   }
   line.x1 = coordinates[0][0]; line.y1 = coordinates[0][1]; line.x2 = coordinates[1][0]; line.y2 = coordinates[1][1];
   return line;
}
