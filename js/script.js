document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('nav ul');

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navUl.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            const links = navUl.querySelectorAll('li');
            if (navUl.classList.contains('active')) {
                links.forEach((link, index) => {
                    link.style.animation = `fadeInUp 0.5s ease forwards ${index / 7 + 0.2}s`;
                    link.style.opacity = '0';
                });
            } else {
                links.forEach(link => {
                    link.style.animation = '';
                    link.style.opacity = '0';
                });
            }
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.card, .product-item, .section-title, .forum-post, .platform-card, .contact-info, .contact-form, .hero-content');
    
    animatedElements.forEach(el => {
        el.classList.add('hidden-scroll');
        observer.observe(el);
    });

    const internalLinks = document.querySelectorAll('a[href]');
    internalLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            const target = link.getAttribute('target');

            if (href && 
                !href.startsWith('#') && 
                !href.startsWith('mailto:') && 
                !href.startsWith('tel:') && 
                target !== '_blank' &&
                !link.classList.contains('btn')
            ) {
                e.preventDefault();
                document.body.classList.add('fade-out');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            }
        });
    });

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('fade-out');
        }
    });

    const buttons = document.querySelectorAll('a.btn, .platform-card .btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            
            if (href === '#' || href === '' || href === 'javascript:void(0)') {
                e.preventDefault();
                const text = btn.innerText.toLowerCase();
                
                if (text.includes('download')) {
                    alert('Starting download for JCI App...');
                } else if (text.includes('visit') || text.includes('load')) {
                    if (text.includes('load more')) {
                        btn.innerText = 'Loading...';
                        setTimeout(() => {
                            alert('No more posts to load in this prototype.');
                            btn.innerText = 'Load More';
                        }, 1000);
                    } else {
                        alert('Redirecting to partner store...');
                    }
                }
            }
        });
    });

    const tags = document.querySelectorAll('.category-tag');

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const parent = tag.parentElement;
            parent.querySelectorAll('.category-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const category = tag.getAttribute('data-category');
            
            let itemsToFilter = [];
            const container = tag.closest('.container');
            if (container.querySelector('.forum-list')) {
                itemsToFilter = container.querySelectorAll('.forum-post');
            } else if (container.querySelector('.product-list')) {
                itemsToFilter = container.querySelectorAll('.product-item');
            }

            itemsToFilter.forEach(item => {
                const displayStyle = item.classList.contains('product-item') ? 'flex' : 'block';
                const itemCategories = item.getAttribute('data-category');
                const shouldShow = category === 'all' || (itemCategories && itemCategories.includes(category));

                if (shouldShow) {
                    item.style.display = displayStyle;
                    item.classList.remove('show-scroll');
                    
                    setTimeout(() => {
                        item.classList.add('show-scroll');
                    }, 50);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('show-scroll');
                }
            });
        });
    });

    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm()) {
                const btn = contactForm.querySelector('button');
                const originalText = btn.innerText;
                btn.innerText = 'Sending...';
                btn.disabled = true;

                setTimeout(() => {
                    alert('Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 1500);
            }
        });
    }

    function validateForm() {
        let isValid = true;
        
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (nameInput.value.trim() === '') {
            setError(nameInput, nameError, 'Name is required');
            isValid = false;
        } else {
            clearError(nameInput, nameError);
        }

        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailVal = emailInput.value.trim();
        if (emailVal === '') {
            setError(emailInput, emailError, 'Email is required');
            isValid = false;
        } else if (emailVal.indexOf('@') === -1 || emailVal.indexOf('.') === -1 || emailVal.indexOf('@') > emailVal.lastIndexOf('.')) {
            setError(emailInput, emailError, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(emailInput, emailError);
        }

        const phoneInput = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');
        const phoneVal = phoneInput.value.trim();
        if (phoneVal === '') {
            setError(phoneInput, phoneError, 'Phone number is required');
            isValid = false;
        } else if (isNaN(phoneVal)) {
            setError(phoneInput, phoneError, 'Phone number must be numeric');
            isValid = false;
        } else if (phoneVal.length < 10) {
            setError(phoneInput, phoneError, 'Phone number must be at least 10 digits');
            isValid = false;
        } else {
            clearError(phoneInput, phoneError);
        }

        const msgInput = document.getElementById('message');
        const msgError = document.getElementById('messageError');
        if (msgInput.value.trim().length < 10) {
            setError(msgInput, msgError, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            clearError(msgInput, msgError);
        }

        const termsInput = document.getElementById('terms');
        const termsError = document.getElementById('termsError');
        if (!termsInput.checked) {
            setError(termsInput, termsError, 'You must agree to the terms');
            isValid = false;
        } else {
            clearError(termsInput, termsError);
        }

        return isValid;
    }

    function setError(input, errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.style.borderColor = 'var(--error)';
        input.style.boxShadow = '0 0 10px rgba(255, 77, 77, 0.3)';
    }

    function clearError(input, errorElement) {
        errorElement.style.display = 'none';
        input.style.borderColor = '#333';
        input.style.boxShadow = 'none';
    }
});
