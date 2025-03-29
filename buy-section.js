// Function to filter items based on category
function filterItems() {
    let selectedCategory = document.getElementById("category").value;
    let products = document.querySelectorAll(".product-item");

    products.forEach(product => {
        if (selectedCategory === "all" || product.getAttribute("data-category") === selectedCategory) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// Handle product request submission
document.getElementById("request-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let productName = document.getElementById("product-name").value;
    let productCategory = document.getElementById("product-category").value;
    let productDescription = document.getElementById("product-description").value;

    if (productName && productDescription) {
        document.getElementById("request-message").innerText = "Your request has been submitted!";
        
        // Clear form
        document.getElementById("product-name").value = "";
        document.getElementById("product-description").value = "";
    }
});
