/*function searchItems() {
    let query = document.getElementById("search-bar").value;
    if (query) {
        alert("Searching for: " + query);
        // Here, you can integrate search functionality later
    } else {
        alert("Please enter a search term!");
    }
}*/

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const header = document.querySelector('header');
    
    if (header) {
        header.addEventListener('click', function(e) {
            // Only toggle if the click was on the header itself or the menu icon (::before)
            if (e.target === header || (e.clientX > window.innerWidth - 50 && e.clientY < 50)) {
                header.classList.toggle('active');
            }
        });
        
        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                header.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target)) {
                header.classList.remove('active');
            }
        });
    }
    
    // Add scroll-to-top button
    const scrollButton = document.createElement('div');
    scrollButton.className = 'scroll-top';
    scrollButton.innerHTML = '↑';
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
    
    // Scroll to top when button is clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Handle search functionality
    window.searchItems = function() {
        const searchInput = document.getElementById('search-bar');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const items = document.querySelectorAll('.item');
        
        if (searchTerm && items.length) {
            items.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                if (itemText.includes(searchTerm)) {
                    item.style.display = 'block';
                    // Highlight the item briefly
                    item.classList.add('highlight');
                    setTimeout(() => {
                        item.classList.remove('highlight');
                    }, 2000);
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Scroll to the results
            document.querySelector('.featured').scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    // Handle input on mobile - scroll into view when focused
    const mobileInputs = document.querySelectorAll('input');
    mobileInputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Small delay to ensure keyboard is open
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
    
    // Fix for 100vh issue on mobile browsers
    const setViewportHeight = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
});

// Add active state to touch elements for better mobile feedback
document.addEventListener('touchstart', function() {}, {passive: true});