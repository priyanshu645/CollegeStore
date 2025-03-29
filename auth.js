// Pre-defined user accounts
const predefinedUsers = [
    {
        fullname: "Amit Kumar",
        email: "amit@heritage.com",
        password: "amit",
        studentId: "ST12345"
    },
    {
        fullname: "Suman Deb Kundu",
        email: "suman@heritage.com",
        password: "suman",
        studentId: "ST23456"
    },
    {
        fullname: "Priyanshu Raj",
        email: "priyanshu@heritage.com",
        password: "anshu",
        studentId: "ST34567"
    },
    {
        fullname: "Vivek Kumar Das",
        email: "vivek@heritage.com",
        password: "vivek",
        studentId: "ST45678"
    },
    {
        fullname: "Rohit Kumar",
        email: "rohit@heritage.com",
        password: "rohit",
        studentId: "ST56789"
    }
];

// Initialize localStorage with predefined users if not already set
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(predefinedUsers));
}

// Signup Form Handling
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const studentId = document.getElementById('studentId').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const messageElement = document.getElementById('message');
        
        // Validate password match
        if (password !== confirmPassword) {
            showMessage(messageElement, 'Passwords do not match!', 'error');
            return;
        }
        
        // Validate student ID format (example: must start with ST followed by 5 digits)
        const studentIdPattern = /^ST\d{5}$/;
        if (!studentIdPattern.test(studentId)) {
            showMessage(messageElement, 'Invalid Student ID format. Must be ST followed by 5 digits (e.g., ST12345)', 'error');
            return;
        }
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.email === email)) {
            showMessage(messageElement, 'User with this email already exists!', 'error');
            return;
        }
        
        if (users.some(user => user.studentId === studentId)) {
            showMessage(messageElement, 'User with this Student ID already exists!', 'error');
            return;
        }
        
        // Add new user
        const newUser = {
            fullname,
            email,
            password,
            studentId
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showMessage(messageElement, 'Account created successfully! Redirecting to login...', 'success');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}

// Login Form Handling
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const messageElement = document.getElementById('loginMessage');
        
        // Check credentials
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);
        
        if (user) {
            // Store current user info (except password)
            const currentUser = {
                fullname: user.fullname,
                email: user.email,
                studentId: user.studentId
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMessage(messageElement, 'Login successful! Redirecting...', 'success');
            
            // Redirect to index page after 1 second
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage(messageElement, 'Invalid email or password!', 'error');
        }
    });
}

// Helper function to display messages
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'message ' + type;
}
