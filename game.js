$ = jQuery;
var maxHealth = 100,
  curHealth = maxHealth;
$('.total').html(maxHealth + "/" + maxHealth);
$(".health-bar-text").html("100%");
$(".health-bar").css({
  "width": "100%"
});
function applyDamage() {
  if (curHealth == 0) {
    $('.message-box').html("Is this the end??");
  } else {
    var damage = 10; // Set a constant damage value
    $(".health-bar").stop();
    curHealth = Math.max(0, curHealth - damage); // Ensure health doesn't go below 0
    if (curHealth == 0) {
      restart();
    } else {
      $('.message-box').html("You took " + damage + " points of damage!");
    }
    applyChange(curHealth);
  }
};

function applyChange(curHealth) {
  var a = curHealth * (100 / maxHealth);
  $(".health-bar-text").html(Math.round(a) + "%");
  $(".health-bar").animate({
    'width': a + "%"
  }, 500);
  $('.total').html(curHealth + "/" + maxHealth);
}

function restart() {
  // Was going to have a game over/restart function here. 
  $('.health-bar');
  $('.message-box').html("You've been knocked down! Thing's are looking bad.");
}

setInterval(function(){
  applyDamage()
}, 2000)

