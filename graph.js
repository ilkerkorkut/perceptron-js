/*
   Duzlem icin Graph objesi olusturuluyor
 */
function Graph(){
   this.margin = {top: 20, right: 20, bottom: 30, left: 40}; // Duzlemin kenarlarini olusturabilmek icin margin degerleri px cinsinden
   this.width = 1200 - this.margin.left - this.margin.right; // Duzleme ait genislik px cinsinden
   this.height = 760 - this.margin.top -this.margin.bottom; // Duzleme ait yukseklik px cinsinden
   this.svg = undefined; // default undefined verip init icerisinde svg'i init ediyoruz
   this.x = d3.scale.linear().range([0, this.width]); // x duzlemi icin yukseklik kadar range veriyoruz
   this.y = d3.scale.linear().range([this.height, 0]); // y duzlemi icin genislik kadar range veriyoruz
}
/*
   svg uzerinde duzlem olusturmak icin yardımcı fonksiyon
 */
Graph.prototype.appendSVG = function(){
   return d3.select("#perceptron-graph").append("svg")
   .attr("width", this.width + this.margin.left + this.margin.right)
   .attr("height", this.height + this.margin.top + this.margin.bottom)
   .append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
}

/*
 * Duzlem ekranda olusturulur
 */
Graph.prototype.init = function(){
   this.svg = this.appendSVG();
   var x = d3.scale.linear().range([0, this.width]);
   var y = d3.scale.linear().range([this.height, 0]);
   this.x.domain([-1,1]); // minimum ve max eksen degerleri
   this.y.domain([-1,1]); // minimum ve max eksen degerleri

   // X ekseni
   this.svg.attr("class", "x axis").append("g")
   .attr("transform", "translate(0," + this.height + ")")
   .call(d3.svg.axis().scale(this.x).tickValues([-1,0,1]).orient("bottom"));

   this.svg.attr("class", "x axis").append("g")
   .call(d3.svg.axis().scale(this.x).tickValues([]).orient("top"));

   // Y ekseni
   this.svg.attr("class", "y axis").append("g")
   .call(d3.svg.axis().scale(this.y).tickValues([-1,0,1]).orient("left"));

   this.svg.attr("class", "y axis").append("g")
   .attr("transform", "translate(" + this.width + ",0)")
   .call(d3.svg.axis().scale(this.y).tickValues([]).orient("right"));

}

/**
 * Duzlem uzerine nokta eklemek cin
 * @param  {[Object]} point [Point objesi]
 * @return {[void]}       [herhangi birsey dondurmez grafik cizdirir]
 */
Graph.prototype.addPoint = function(point){
   var self = this;
   if(Object.prototype.toString.call( point ) === '[object Array]'){
      point.forEach(function(p){
         if(p.type == -1){
            type = "red";
         }else{
            type = "blue";
         }
         svg.append("circle").attr("class", type).attr("r",4.5).attr("cx", self.x(p.x)).attr("cy", self.y(p.y));
      });
   }else if(Object.prototype.toString.call( point ) === "[object Object]"){
      if(point.type == -1){
         type = "red";All
      }else{
         type = "blue";
      }
      svg.append("circle").attr("class", type).attr("r",4.5).attr("cx", self.x(point.x)).attr("cy", self.y(point.y));
   }else{
      throw new Error("Nokta eklemek için {x:x1,y:y1,type:blue} örnek objesi veya obje arrayi veriniz.");
   }
}

/**
 * Duzleme belirli koordinatlara sahip cizgi eklemek icin yardimci method. Ayirici cizgiler gorsel olarak burada eklenir.
 * @param  {[Object]} lineObj [Line objesi parametresi]
 * @return {[void]}         [Append eder birsey dondurmez]
 */
Graph.prototype.addLine = function(lineObj){
   this.svg.append("line")
   .attr("x1", this.x(lineObj.x1))
   .attr("y1", this.y(lineObj.y1))
   .attr("x2", this.x(lineObj.x2))
   .attr("y2", this.y(lineObj.y2))
   .attr("class", lineObj.type)
   .attr("stroke", lineObj.color);
}
/*
   Duzlemdeki ayirac cizgileri siler
 */
Graph.prototype.removeLines = function(){
   d3.selectAll("line.seperator").remove();
}

/*
   Duzlemdeki noktalari siler
 */
Graph.prototype.removePoints = function(){
   d3.selectAll("circle").remove();
}

/**
 * Bir ayirac cizgisini gorsel olarak update edebilmek icin gerekli method.
 * @param  {[Object]} lineObj [Line objesi parametresi]
 * @return {[void]}         [Ayirac gorsel olarak guncellenir]
 */
Graph.prototype.adjustLine = function(lineObj){
   this.svg.select("."+lineObj.type)
   .transition().duration(1000).ease('elastic')
   .attr("x1", this.x(lineObj.x1))
   .attr("y1", this.y(lineObj.y1))
   .attr("x2", this.x(lineObj.x2))
   .attr("y2", this.y(lineObj.y2))
   .attr("stroke", lineObj.color);
}
