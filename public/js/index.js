var config = {
  apiKey: "AIzaSyBAsiy7dPo_4xVty440snA-Sun7-PrXDNY",
  authDomain: "gbook1line.firebaseapp.com",
  databaseURL: "https://gbook1line.firebaseio.com",
  projectId: "gbook1line",
  storageBucket: "gbook1line.appspot.com",
  messagingSenderId: "731905230056"
};
firebase.initializeApp(config);

/***** 전역변수 설정 *****/
var log = console.log;
var auth = firebase.auth();
var db = firebase.database();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var ref = null;
var user = null;

/***** Auth *****/
$("#login_bt").on("click", function () {
  auth.signInWithPopup(googleAuth);
});
$("#logout_bt").on("click", function () {
  auth.signOut();
})

auth.onAuthStateChanged(function (result) {
  if (result) {
    user = result;
    var email = '<img src="' + result.photoURL + '" style="width:24px; border-radius:50%;"> ' + result.email;
    $("#login_bt").hide();
    $("#logout_bt").show();
    $("#user_email").html(email);
  } else {
    user = null;
    $("#login_bt").show();
    $("#logout_bt").hide();
    $("#user_email").html('');
  }
});

/***** Database *****/
init();

function init() {
  ref = db.ref("root/gbook");
  ref.on("child_added", onAdded);
}

function onAdded(data) {
  var k = data.key;
  var v = data.val();
  var html = '<ul id="'+k+'" data-uid="'+v.uid+'" class="gbook">';
  html += '<li>'+v.uname+' ('+v.email+')</li>';
  html += '<li>'+v.content+'</li>';
  html += '<li>'+v.wdate+'</li>';
  html += '</ul>';
  $(".gbooks").prepend(html);
}

$("#save_bt").on("click", function(){
var $content = $("#content");
if($content.val() == ""){
  alert("내용을 입력하세요.");
  $content.focus();
}
else{
  ref = db.ref("root/gbook/");
  ref.push({
    email: user.email,
    uid: user.uid,
    uname: user.displayName,
    content: $content.val(),
    wdate: Date.now()
  }).key;
  $content.val('');
}
});
