// تهيئة مصفوفة لتخزين البيانات
let clientData = [];

// رقم الواتساب المسؤول
const adminWhatsApp = "201014642351";
const adminPhone = "01014642351";

// الحصول على البيانات المخزنة مسبقاً إن وجدت
if (localStorage.getItem('visaRequests')) {
    clientData = JSON.parse(localStorage.getItem('visaRequests'));
}

document.addEventListener('DOMContentLoaded', function() {
    // نموذج التواصل
    const visaForm = document.getElementById('visaForm');
    if (visaForm) {
        visaForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // جمع بيانات النموذج
            const formData = {
                date: new Date().toLocaleString('ar-SA'),
                fullName: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                visaType: document.getElementById('visaType').options[document.getElementById('visaType').selectedIndex].text,
                details: document.getElementById('details').value
            };
            
            // إضافة البيانات إلى المصفوفة
            clientData.push(formData);
            
            // حفظ البيانات في localStorage
            localStorage.setItem('visaRequests', JSON.stringify(clientData));
            
            // تصدير البيانات إلى ملف Excel وإرسالها عبر WhatsApp
            await exportToExcelAndSend();
            
            // إظهار رسالة نجاح
            alert('تم استلام طلبك بنجاح! سيتم التواصل معك قريباً');
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

async function exportToExcelAndSend() {
    // إنشاء مصفوفة البيانات للإكسل
    const excelData = [
        ['التاريخ', 'اسم العميل', 'رقم الجوال', 'نوع التأشيرة', 'التفاصيل'] // ترويسة الأعمدة
    ];
    
    // إضافة بيانات العملاء
    clientData.forEach(client => {
        excelData.push([
            client.date,
            client.fullName,
            client.phone,
            client.visaType,
            client.details
        ]);
    });
    
    // إنشاء ورقة عمل جديدة
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // إنشاء مصنف عمل جديد
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'طلبات التأشيرات');
    
    // تحديد عرض الأعمدة
    const columnWidths = [
        { wch: 20 }, // التاريخ
        { wch: 25 }, // اسم العميل
        { wch: 15 }, // رقم الجوال
        { wch: 20 }, // نوع التأشيرة
        { wch: 40 }  // التفاصيل
    ];
    ws['!cols'] = columnWidths;
    
    try {
        // تحويل الملف إلى صيغة base64
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // إنشاء رابط للتحميل
        const downloadUrl = URL.createObjectURL(blob);
        
        // تحميل الملف تلقائياً
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'طلبات_التأشيرات.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // إرسال الملف عبر WhatsApp
        const latestEntry = clientData[clientData.length - 1];
        const message = `طلب تأشيرة جديد:\n` +
            `الاسم: ${latestEntry.fullName}\n` +
            `الجوال: ${latestEntry.phone}\n` +
            `نوع التأشيرة: ${latestEntry.visaType}\n` +
            `التفاصيل: ${latestEntry.details}`;
        
        const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
    } catch (error) {
        console.error('حدث خطأ أثناء تصدير الملف:', error);
        alert('حدث خطأ أثناء تصدير الملف. الرجاء المحاولة مرة أخرى.');
    }
}