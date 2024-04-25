document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("signUpForm").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission
        const usernameInput = document.getElementById("username")
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
    
        const email = emailInput.value;
        const password = passwordInput.value;
        const username = usernameInput.value;
    
    
        try {
            const response = await fetch("https://notesapp-o3mu.onrender.com/signupdata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });
    
            const data = await response.json(); // Parse JSON response
            const statuscode = data.statusCode;
            if(statuscode===201){
                window.location.href='login.html'
            } else if(statuscode===400){
                document.getElementById("signup_status").innerHTML = '<span class="message">Error saving user</span>'
            }
        } catch (error) {
            console.error("Error registering", error);
            // Display error message or handle the error accordingly
        }
    })});
    