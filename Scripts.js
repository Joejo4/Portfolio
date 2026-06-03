// Grab the UI Elements
const hamburgerBtn = document.getElementById("hamburger-btn");
const navMenu = document.querySelector(".nav-menu");

// Toggle Mobile Menu Open/Closed
hamburgerBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  // Animate the hamburger icon itself between bars and an 'X'
  const icon = hamburgerBtn.querySelector("i");
  if (navMenu.classList.contains("active")) {
    icon.className = "fa-solid fa-xmark";
  } else {
    icon.className = "fa-solid fa-bars";
  }
});

// Close mobile menu smoothly when clicking any link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamburgerBtn.querySelector("i").className = "fa-solid fa-bars";
  });
});

//  Intersection Observer for Reveal-on-Scroll
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

//  Project Filtering Logic
const filterBtns = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // UI update
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.category;

    projects.forEach((card) => {
      if (filter === "all" || card.dataset.category === filter) {
        card.style.display = "block";
        setTimeout(() => (card.style.opacity = "1"), 10);
      } else {
        card.style.opacity = "0";
        setTimeout(() => (card.style.display = "none"), 300);
      }
    });
  });
});

// PORTFOLIO CONTACT FORM OPTIMIZATION

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  // Safety check: Only run the code if the contact form exists on the current page
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector(".btn.primary");
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xojbyndz";

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";

    const formData = new FormData(contactForm);

    //  Send data to Formspree silently in the background
    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          //  Show success alert message right on the page, clear the inputs
          showSuccessState();
          contactForm.reset();
        } else {
          throw new Error("Formspree submission failed status code");
        }
      })
      .catch((error) => {
        console.error("Transmission Error:", error);
        alert(
          "Oops! Something went wrong. Please check your internet connection or try again!",
        );
      })
      .finally(() => {
        // Reset button back to normal defaults
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      });
  });

  //  Injects the success block inside the section container smoothly
  function showSuccessState() {
    const contactBox = document.querySelector(".contact-box");

    // Wipe out an old success message if it's still hanging around
    const existingMessage = document.querySelector(".form-success-message");
    if (existingMessage) existingMessage.remove();

    const feedbackOverlay = document.createElement("div");
    feedbackOverlay.className = "form-success-message";

    // Styling inline to perfectly match your dark portfolio parameters safely
    feedbackOverlay.style.textAlign = "center";
    feedbackOverlay.style.padding = "1.5rem 1rem";
    feedbackOverlay.style.backgroundColor = "rgba(55, 65, 81, 0.2)";
    feedbackOverlay.style.borderRadius = "0.75rem";
    feedbackOverlay.style.border = "1px solid #374151";
    feedbackOverlay.style.marginTop = "1.5rem";

    feedbackOverlay.innerHTML = `
      <h3 style="color: #c19a6b; margin-bottom: 0.5rem; font-size: 1.3rem;">Message Sent Successfully! 🎉</h3>
      <p style="color: white; font-size: 0.95rem;">Thanks for reaching out. I will get back to you shortly.</p>
    `;

    contactBox.appendChild(feedbackOverlay);

    // Remove success notice completely after 6 seconds
    setTimeout(() => {
      feedbackOverlay.style.opacity = "0";
      feedbackOverlay.style.transition = "opacity 0.5s ease";
      setTimeout(() => feedbackOverlay.remove(), 500);
    }, 6000);
  }
});
