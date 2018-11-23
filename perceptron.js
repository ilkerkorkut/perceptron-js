/**
 * Sign fonksiyonu
 * Sign function
 * @param  {[Number]} x [number]
 * @return {[Number]}   [-1 veya 1 doner]
 */
var sign = function(x) {
   if(x){
      if(x < 0){
         return -1;
      }else{
         return 1
      }
   }
   // Never returns 0
   return 0; // 0 return etme olasiligi yok , elbette deger verilmisse veya null degilse yoksa hata alalim.
}

function Perceptron(){
   this.weights = [0,0,0]; // Baslangic agirliklari (default) [Default beginning weights]
   this.iteration = 0;  // Baslangic Iterasyon 0 [Default beginning iteration count]
}

/**
* Siniflandirilmamis dataya gore agirlik guncellemesi yapilmakta
* According to Unclassified data , weights updating, perceiving
*/
Perceptron.prototype.perceive = function(data){
   var self = this;
   // Tekrar Type belirlemek icin agirliklara gore tahmin yapiliyor
   if(data.type == this.getType(data)){
      /*
         Tahminin dogru oldugu belirlendiginde agirlik guncellemesi yapmaya gerek olmadigi icin
         islemi burada kesmek icin false donduruyoruz
       */
      return false;
   }
   var i = 0;
   Object.keys(data).forEach(function(d){
      // Burada noktamizin tum propertylerini donerken type'i bu islemin icine katmamak icin kontrol ediyoruz
      if(d != "type"){
         // Agirlik guncellemesi
         self.weights[i] += data["type"] * data[d];
         i++;
      }
   });

   this.iteration += 1;
   return true;
}
/**
 * Perceptron egitim fonksiyonu
 * Perceptron training function
 * @param  {[Array]} data     [Siniflandirilacak veri seti parametresi, Point objelerinin arrayi olarak verilmektedir] [Dataset parameter to classify, Array of Point objects]
 * @param  {[Function]} itcb     [Her iterasyon sonucu calistilacak callback function] [Iteration callback function]
 * @param  {[Function]} finishcb [Iterasyonlar bittiginde calistirilacak callback function] [Iterations finished callback function]
 * @return {[void]}          [Burada deger dondurmeyip callback functionlara gelen degerlerle iterasyonlarda veya islem tamamlandiginda istenilen logic calistilabilmektedir ] [void]
 */
Perceptron.prototype.train = function(data, itcb, finishcb){
   var unclassifiedDataset; // Siniflandirilmamis veri seti icin degisken [uncllasified data set]
   var willIterate = true; // Iterasyonun olup olmayacagına dair kontol edilecek degisken, default olarak true veriliyor ki iterasyonları baslatalim [will iterate, default true]

   while(willIterate){
      // Her iterasyona weight'e gore siniflandirilacak siniflandirilmamis data icin bosaltiliyor.
      // In Every iteration, unclassifiedData setting empty according to weights
      unclassifiedDataset = [];
      for(var i=0; i<data.length; i++){
         // Type tahmini yapiliyor , siniflandirilmazsa siniflandirilmamis diziye iterasyonu devam ettirmek icin ekliyoruz.
         // Type guessing, if couldn't classified , adding data to uncllasifiedDataset to continue iteration
         if(data[i].type != this.getType(data[i])){
            unclassifiedDataset.push(data[i]);
         }
      }
      // Siniflandirilmamis data sayisi bitene kadar iterasyonu devam ettiriyoruz
      // Continues until unclassifiedDataset is 0
      if(unclassifiedDataset.length != 0){
         /*
          * Her zaman siniflandirilmayan ilk datayi alalim, [everytime getting first data of unclassifiedDataset]
          * random olarak da secebiliriz ancak ayni islem icin farkli iterasyon sayisi olusacaktir hesaplanacak agirliklarin [can be selected by random but at this time iterations count will be different according to different weight calculation]
          * farklilik gostermesi sebebiyle. Daha hizli da yakinsayabilir daha gec de. [can be converge early or lately]
          */
         var unclassifiedData = unclassifiedDataset[0];
         // Weight updating according to unclassifiedData
         // Agirlik guncellemesi yapiyoruz siniflandirilmamis veriye gore
         this.perceive(unclassifiedData);
         // Callback function for per iteration
         // Her Iterasyon sonrasi calisacak fonksiyon
         if(itcb) itcb(this.weights, this.iteration, unclassifiedData);
      }
      // Are there any unclassifiedData in uncllasifiedDataset, if exist then continue iterations
      // siniflandirilmamis veri var mi, varsa yeniden iterasyon yapiliyor, yoksa islem tamamlaniyor
      willIterate = unclassifiedDataset.length != 0 && false;
   }
   /**
   * Siniflandirilmamis veri kalmamis ve iterasyonlar bittiginde,
   * calistirilacak finish callback'i de varsa finishcallback tetiklenip islem tamamlaniyor
   * [Iterations finished and there no more unclassifiedData in uncllasifiedDataset, and then call finish callback]
   */
   if(unclassifiedDataset.length == 0 && finishcb){
      finishcb(this.weights, this.iteration);
   }
}
/**
 * Agirliklara gore type tahmini yapiliyor, sonucunda sign fonksiyonuna sokularak -1 veya 1 dondurmekte [Type guessing according to weights, at the end of triggers sign function and getting -1 or 1]
 * @param  {[Object]} data [Tek bir nokta veriyoruz, olusturdugumuz point objesi] [Single Point which is created Point object before]
 * @return {[Number]}      [-1 veya 1] [-1 or 1]
 */
Perceptron.prototype.getType = function(data) {
   var self = this;
   if(Object.keys(data).length-1 != this.weights.length){
      console.error("HATA : Weight'lerin sayisi ile data'nin attribute'leri ayni tutarsiz. Olusturulan data sorunlu !");
   }
   var type = 0;
   var i = 0;
   Object.keys(data).forEach(function(d){
      // Burada noktamizin tum propertylerini donerken type'i bu islemin icine katmamak icin kontrol ediyoruz
      // While looping Point objects keys, excluding type in calculation
      if(d != "type"){
         /**
         * Agirliklar uzerinden type tahmini icin agirliklarla veriye ait degerleri carpiyoruz(x,y) [Guessing type according to weights , multiplying with weights and its values]
         * Agirlik sirasiyla x,y,w0 sirasi ayni oldugu icin agirliklari arraydan aldigimiz icin i ile index almaktayiz [Weights order is x,y,w0 and point keys order same so we can use simple counting index in here]
         */
         type += self.weights[i] * data[d];
         i++;
      }
   });
   // Type belirlemek icin sign fonksiyonuna sokup return ediyoruz
   // To determine of type trigger the sign function and return its value
   return sign(type);
}
