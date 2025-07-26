document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Subscription form handler
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('email-input');
            const messageContainer = document.getElementById('subscribe-message');
            const email = emailInput.value;

            if (!validateEmail(email)) {
                messageContainer.textContent = '이메일 주소를 입력해주세요.';
                messageContainer.style.color = 'red';
                return;
            }

            // 로컬 스토리지에서 기존 이메일 목록을 가져옴
            let emails = JSON.parse(localStorage.getItem('subscribedEmails')) || [];

            if (emails.includes(email)) {
                messageContainer.textContent = '이미 구독된 이메일 주소입니다.';
                messageContainer.style.color = 'orange';
            } else {
                // 새 이메일을 목록에 추가하고 로컬 스토리지에 저장
                emails.push(email);
                localStorage.setItem('subscribedEmails', JSON.stringify(emails));
                
                messageContainer.textContent = '감사합니다! 성공적으로 구독되었습니다.';
                messageContainer.style.color = 'green';
                emailInput.value = ''; // 입력 필드 비우기
            }
        });
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});