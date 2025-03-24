function searchItems() {
    let query = document.getElementById("search-bar").value;
    if (query) {
        alert("Searching for: " + query);
        // Here, you can integrate search functionality later
    } else {
        alert("Please enter a search term!");
    }
}
