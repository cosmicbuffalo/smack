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


  $('#new-post-form').on('keypress', function(e){
    console.log("TRIGGERED KEYPRESS HANDLER ON FORM")
    // console.log(e)
    if (e.keyCode == 13){
      console.log("Cicked ENTER key")
      // $('#new-post-form').trigger('submit')
      $('#new-post-submit-button').click()
      // $('.emoji-wysiwyg-editor').empty()
    }
  })

  // $('.emoji-wysiwyg-editor').keypress(function(){
  //   console.log("TRIGGERED KEYPRESS HANDLER")
  // })



  // $("#posts-container").animate({scrollTop:$("#posts-container").scrollHeight‌​}, 1000);




  


})
