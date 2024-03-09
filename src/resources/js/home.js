function search(){
    var value = document.getElementById("search").value;
    window.location = "google.com/search?q=" + encodeURIComponent(value);
}