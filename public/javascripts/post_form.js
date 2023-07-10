/*Otvara formu za postovanje.*/
document.getElementById("post_link").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("postLinkSpan").style.display = "none";
    document.getElementById("post_form").style.display = "block";
});

