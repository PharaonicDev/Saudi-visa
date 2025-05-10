document.addEventListener('DOMContentLoaded', function() {
    // نموذج التواصل
    const visaForm = document.getElementById('visaForm');
    if (visaForm) {
        visaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع البيانات من النموذج
            const formData = new FormData(visaForm);
            const data = {};
            formData.forEach((value, key) => data[key] = value);
            
            // يمكن هنا إضافة كود لإرسال البيانات إلى الخادم
            alert('تم استلام طلبك بنجاح! سنتواصل معك قريباً');
            visaForm.reset();
        });
    }

    // تأثيرات التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // إضافة تأثيرات ظهور العناصر عند التمرير
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
        observer.observe(section);
    });
});