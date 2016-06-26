console.log("Green-pass");

document.addEventListener('DOMContentLoaded', function() {
	console.log("DOMContentLoaded");
	// Leave Button
    var leaveBtn = document.getElementById('btnLeave');
    leaveBtn.addEventListener('click', function() {
        window.close();
  });
	// Visit Button
	var visitBtn = document.getElementById('btnVisit');
    visitBtn.addEventListener('click', function() {
        window.location="http://www.facebook.com"

    });
});
