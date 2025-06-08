window.addEventListener("message", (event) => {
  if (event.data.type === "AUTOFILL") {
    // Use 'var' instead of 'const' for maximum compatibility
    var name = event.data.payload.name;
    var email = event.data.payload.email;

    // Keep the explicit checks for elements as discussed previously
    var nameInput = document.querySelector("input[name='name']");
    if (nameInput) {
      nameInput.value = name;
    }

    var emailInput = document.querySelector("input[name='email']");
    if (emailInput) {
      emailInput.value = email;
    }
  }
});