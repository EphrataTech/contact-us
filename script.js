document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm")
  const submitButton = document.getElementById("submit")
  const formGroups = document.querySelectorAll(".form-group")

  // Form validation rules
  const validationRules = {
    Name: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: "Please enter a valid name (letters and spaces only, minimum 2 characters)",
    },
    Email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    Message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      message: "Message must be between 10 and 1000 characters",
    },
  }

  // Real-time validation
  formGroups.forEach((group) => {
    const input = group.querySelector("input, textarea")
    if (input) {
      input.addEventListener("blur", () => validateField(input))
      input.addEventListener("input", () => clearFieldError(input))
    }
  })

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    if (validateForm()) {
      submitForm()
    }
  })

  function validateField(field) {
    const fieldName = field.name
    const fieldValue = field.value.trim()
    const rules = validationRules[fieldName]
    const formGroup = field.closest(".form-group")

    // Clear previous validation state
    clearFieldError(field)

    if (!rules) return true

    // Required validation
    if (rules.required && !fieldValue) {
      showFieldError(field, `${fieldName} is required`)
      return false
    }

    if (fieldValue) {
      // Pattern validation
      if (rules.pattern && !rules.pattern.test(fieldValue)) {
        showFieldError(field, rules.message)
        return false
      }

      // Length validation
      if (rules.minLength && fieldValue.length < rules.minLength) {
        showFieldError(field, rules.message)
        return false
      }

      if (rules.maxLength && fieldValue.length > rules.maxLength) {
        showFieldError(field, rules.message)
        return false
      }
    }

    // Show success state
    formGroup.classList.add("success")
    return true
  }

  function showFieldError(field, message) {
    const formGroup = field.closest(".form-group")
    formGroup.classList.add("error")
    formGroup.classList.remove("success")

    // Remove existing error message
    const existingError = formGroup.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }

    // Add new error message
    const errorElement = document.createElement("span")
    errorElement.className = "error-message"
    errorElement.textContent = message
    formGroup.appendChild(errorElement)
  }

  function clearFieldError(field) {
    const formGroup = field.closest(".form-group")
    formGroup.classList.remove("error", "success")

    const errorMessage = formGroup.querySelector(".error-message")
    if (errorMessage) {
      errorMessage.remove()
    }
  }

  function validateForm() {
    let isValid = true
    const inputs = form.querySelectorAll("input, textarea")

    inputs.forEach((input) => {
      if (!validateField(input)) {
        isValid = false
      }
    })

    return isValid
  }

  function submitForm() {
    // Show loading state
    const originalButtonText = submitButton.innerHTML
    submitButton.disabled = true
    submitButton.innerHTML = '<span class="loading"></span>Sending...'

    // Remove any existing messages
    const existingMessage = document.querySelector(".message")
    if (existingMessage) {
      existingMessage.remove()
    }

    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
      // Get form data
      const formData = new FormData(form)
      const data = Object.fromEntries(formData)

      // Log form data (replace with actual submission)
      console.log("Form submitted with data:", data)

      // Show success message
      showMessage("Thank you for your message! We'll get back to you soon.", "success")

      // Reset form
      form.reset()

      // Clear validation states
      formGroups.forEach((group) => {
        group.classList.remove("error", "success")
        const errorMessage = group.querySelector(".error-message")
        if (errorMessage) {
          errorMessage.remove()
        }
      })

      // Reset button
      submitButton.disabled = false
      submitButton.innerHTML = originalButtonText
    }, 2000) // Simulate network delay

    // Uncomment and modify this section for actual form submission
    /*
        fetch('/submit-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
        */
  }

  function showMessage(text, type) {
    const messageElement = document.createElement("div")
    messageElement.className = `message ${type}`
    messageElement.textContent = text

    // Insert message before the form
    form.parentNode.insertBefore(messageElement, form)

    // Auto-remove success messages after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.remove()
        }
      }, 5000)
    }
  }

  // Add smooth scrolling for better UX
  function smoothScrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Character counter for textarea
  const messageTextarea = document.getElementById("Message")
  if (messageTextarea) {
    const maxLength = validationRules.Message.maxLength

    // Create character counter
    const counter = document.createElement("div")
    counter.style.cssText = "text-align: right; font-size: 0.8rem; color: #666; margin-top: 0.25rem;"
    messageTextarea.parentNode.appendChild(counter)

    function updateCounter() {
      const currentLength = messageTextarea.value.length
      counter.textContent = `${currentLength}/${maxLength} characters`

      if (currentLength > maxLength * 0.9) {
        counter.style.color = "#dc3545"
      } else if (currentLength > maxLength * 0.7) {
        counter.style.color = "#ffc107"
      } else {
        counter.style.color = "#666"
      }
    }

    messageTextarea.addEventListener("input", updateCounter)
    updateCounter() // Initial count
  }
})
