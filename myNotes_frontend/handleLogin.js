document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission

      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");

      const email = emailInput.value;
      const password = passwordInput.value;

      try {
        const response = await fetch("http://localhost:4000/logindata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json(); // Parse JSON response
        const username = data.username; // Access username from parsed data/
        const userEmail = data.email;
        const statuscode = data.statusCode;
        if (statuscode === 404) {
          document.getElementById("statusmessage").innerHTML =
            '<span class="message">user not found.</span><span class="statusmessage"><a href="signup.html">signUp</a></span>';
        } else if (statuscode === 401) {
          document.getElementById("statusmessage").innerHTML =
            '<span class="message">wrong password.</span>';
        } else if (statuscode === 200) {

          localStorage.setItem("username", data.username);
          localStorage.setItem("useremail", data.email);
          window.location.href = "index.html";

        }
      } catch (error) {
        console.error("Error logging in", error);
      }
    });
});
