// Portfolio JavaScript Logic

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Burger Menu Overlay Toggle
    const burgerBtn = document.getElementById("burger-btn");
    const menuOverlay = document.getElementById("menu-overlay");
    const menuLinks = document.querySelectorAll(".menu-link");

    if (burgerBtn && menuOverlay) {
        burgerBtn.addEventListener("click", () => {
            burgerBtn.classList.toggle("open");
            menuOverlay.classList.toggle("open");
            
            // Lock body scroll when menu is open
            if (menuOverlay.classList.contains("open")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        });

        // Close menu when links are clicked
        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                burgerBtn.classList.remove("open");
                menuOverlay.classList.remove("open");
                document.body.style.overflow = "";
            });
        });
    }

    // 3. Scroll Spy for Sidebar Dot Highlights
    const sections = document.querySelectorAll(".scroll-section");
    const sidebarDots = document.querySelectorAll(".sidebar-dot");

    // 3. Smooth Fullpage Translation Transition Control (Desktop) & Spy Scroll (Mobile)
    const mainContainer = document.querySelector(".main-container");
    const sectionsArray = Array.from(sections);
    let currentSectionIndex = 0;
    let isAnimating = false;

    function scrollToSection(index) {
        if (index < 0 || index >= sectionsArray.length) return;
        
        isAnimating = true;
        currentSectionIndex = index;
        const activeSection = sectionsArray[index];
        const activeId = activeSection.getAttribute("id");

        if (window.innerWidth >= 1024) {
            // Translate the outer wrapper container vertically
            mainContainer.style.transform = `translateY(-${index * 100}vh)`;
            
            // Toggle active animation trigger states
            sectionsArray.forEach((s, idx) => {
                if (idx === index) {
                    s.classList.add("active");
                } else {
                    s.classList.remove("active");
                }
            });
        } else {
            // Scroll smoothly on mobile devices
            activeSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Update dot selection highlights
        sidebarDots.forEach(dot => {
            dot.classList.remove("active");
            if (dot.getAttribute("href") === `#${activeId}`) {
                dot.classList.add("active");
            }
        });

        setTimeout(() => {
            isAnimating = false;
        }, 850); // Matches stylesheet transform transition duration
    }

    // Wheel Event Listener to intercept native scroll
    window.addEventListener("wheel", (e) => {
        if (window.innerWidth < 1024) return;
        
        e.preventDefault(); // Lock native browser scroll to avoid laggy conflicts
        if (isAnimating) return;

        if (e.deltaY > 0) {
            if (currentSectionIndex < sectionsArray.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            }
        } else if (e.deltaY < 0) {
            if (currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
        }
    }, { passive: false });

    // Keyboard Arrow navigation support
    window.addEventListener("keydown", (e) => {
        if (window.innerWidth < 1024) return;
        if (["ArrowDown", "ArrowUp"].includes(e.key)) {
            e.preventDefault();
            if (isAnimating) return;
            if (e.key === "ArrowDown" && currentSectionIndex < sectionsArray.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            } else if (e.key === "ArrowUp" && currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
        }
    });

    // Touch swipe support for smooth mobile/tablet translations
    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => {
        if (window.innerWidth < 1024) return;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
        if (window.innerWidth < 1024) return;
        if (isAnimating) return;

        const touchEndY = e.touches[0].clientY;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffY) > 50) { // threshold
            if (diffY > 0) {
                if (currentSectionIndex < sectionsArray.length - 1) {
                    scrollToSection(currentSectionIndex + 1);
                }
            } else {
                if (currentSectionIndex > 0) {
                    scrollToSection(currentSectionIndex - 1);
                }
            }
        }
    }, { passive: true });

    // Attach click events on sidebar dot menus
    sidebarDots.forEach((dot, index) => {
        dot.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToSection(index);
        });
    });

    // Attach click events on overlay navigation links
    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetIndex = sectionsArray.findIndex(s => s.getAttribute("id") === targetId);
            if (targetIndex !== -1) {
                scrollToSection(targetIndex);
            }
        });
    });

    // Intercept clicks on inline section-to-section links (like "Contact Me" on hero page)
    const inlineLinks = document.querySelectorAll('a[href^="#"]:not(.sidebar-dot):not(.menu-link)');
    inlineLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href").substring(1);
            const targetIndex = sectionsArray.findIndex(s => s.getAttribute("id") === targetId);
            if (targetIndex !== -1) {
                e.preventDefault();
                scrollToSection(targetIndex);
            }
        });
    });

    // Mobile fallback IntersectionObserver scroll-spy
    if (sectionsArray.length > 0 && sidebarDots.length > 0) {
        const spyOptions = {
            root: null,
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0
        };

        const spyObserver = new IntersectionObserver((entries) => {
            if (window.innerWidth >= 1024) return; // Managed by transform engine on desktop
            
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute("id");
                    entry.target.classList.add("active");
                    
                    sidebarDots.forEach(dot => {
                        dot.classList.remove("active");
                        if (dot.getAttribute("href") === `#${activeId}`) {
                            dot.classList.add("active");
                        }
                    });
                } else {
                    entry.target.classList.remove("active");
                }
            });
        }, spyOptions);

        sectionsArray.forEach(section => {
            spyObserver.observe(section);
        });
    }

    // Initialize first section animations immediately
    if (sectionsArray.length > 0) {
        sectionsArray[0].classList.add("active");
    }

    // 4. Metric Count-Up Animation
    const counterElements = document.querySelectorAll("[data-val]");

    const countUpOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetVal = parseFloat(element.getAttribute("data-val"));
                const suffix = element.getAttribute("data-suffix") || "";
                
                animateCount(element, targetVal, suffix);
                observer.unobserve(element); // Animate only once
            }
        });
    }, countUpOptions);

    counterElements.forEach(el => {
        counterObserver.observe(el);
    });

    function animateCount(element, targetVal, suffix) {
        const duration = 1500; // Animation duration in ms
        const startTime = performance.now();
        const isDecimal = targetVal % 1 !== 0;

        function updateCount(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            
            const currentVal = easeProgress * targetVal;
            
            if (isDecimal) {
                element.textContent = currentVal.toFixed(2) + suffix;
            } else {
                element.textContent = Math.floor(currentVal) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                if (isDecimal) {
                    element.textContent = targetVal.toFixed(2) + suffix;
                } else {
                    element.textContent = targetVal + suffix;
                }
            }
        }

        requestAnimationFrame(updateCount);
    }

    // 5. Contact Form Interaction & Feedback (Formspree Integrated)
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Reset status state
            formStatus.className = "form-status-msg";
            formStatus.textContent = "Sending your message...";
            
            const nameInput = document.getElementById("name");
            const name = nameInput ? nameInput.value : "there";
            const data = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action || "https://formspree.io/f/xgojwzyo", {
                    method: contactForm.method || "POST",
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formStatus.className = "form-status-msg success";
                    formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                    contactForm.reset();
                } else {
                    const responseData = await response.json();
                    if (responseData.errors && responseData.errors.length > 0) {
                        formStatus.className = "form-status-msg error";
                        formStatus.textContent = responseData.errors.map(err => err.message).join(", ");
                    } else {
                        formStatus.className = "form-status-msg error";
                        formStatus.textContent = "Oops! There was a problem submitting your form.";
                    }
                }
            } catch (error) {
                formStatus.className = "form-status-msg error";
                formStatus.textContent = "Oops! There was a network error submitting your form.";
            }
            
            // Clear message after 5 seconds
            setTimeout(() => {
                formStatus.textContent = "";
                formStatus.className = "form-status-msg";
            }, 5000);
        });
    }
});
