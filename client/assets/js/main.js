$(document).ready(function(){


  $('#posts-container').on('scroll', function(e){
    // console.log($(this).scrollTop())
    // console.log($('.timeline-label'))
    for(var x = 0; x < $('.timeline-label').length; x++){
      if ($('.timeline-label')[x].offsetTop <= $(this).scrollTop()){
        $($('.timeline-label')[x]).addClass('timeline-label-fixed')
      } else {
        $($('.timeline-label')[x]).removeClass('timeline-label-fixed')
      }
    }
  })




  


})
