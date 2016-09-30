(function(){
  if(!! window.$) {
    
    /**
     * generic debounce function
     * @method debounce
     */
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    $(function(){
      
      $('.js-share-toggle').each(function(index){
        var $thisButton = $(this);
        var $container = $thisButton.parent().parent();
        var t = $thisButton.data().dest;
        $thisButton.on('click', function(e){
          $container.find(t).toggleClass('js-hidden');
        })
      });
      
    	$('.conversation__bubble').each(function(i) {
    	  $(this).delay((i++) * 400).fadeTo(1000, 1); 
      });

    });
    
  } else {
    console.log('You don\'t some to have jQuery available');
  }
  
})();