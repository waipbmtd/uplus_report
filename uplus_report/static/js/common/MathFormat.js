/**
 * 添加四舍五入;
 */
Math.ForDight = function(Dight,How) {
        Dight = Math.round(Dight*Math.pow(10,How))/Math.pow(10,How);
        return Dight;
   }