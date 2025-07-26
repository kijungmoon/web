document.addEventListener('DOMContentLoaded', () => {
    const subscribeForm = document.getElementById('subscribe-form');
    const emailInput = document.getElementById('email-input');
    const subscribeMessage = document.getElementById('subscribe-message');

    // Smooth scrolling for anchor links (기존 코드 유지)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Subscription form handler (수정된 부분 시작)
    if (subscribeForm && emailInput && subscribeMessage) {
        subscribeForm.addEventListener('submit', function(event) {
            event.preventDefault(); // <<<---- 이전에 제거했던 이 줄을 다시 추가합니다! 페이지 새로고침 방지

            const email = emailInput.value.trim(); // 입력된 이메일 앞뒤 공백 제거

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

            if (email === '') {
                subscribeMessage.textContent = "이메일 주소를 입력해주세요.";
                subscribeMessage.style.color = 'red';
            } else if (!emailRegex.test(email)) {
                subscribeMessage.textContent = "유효한 이메일 주소 형식으로 입력해주세요.";
                subscribeMessage.style.color = 'red';
            } else {
                // 이메일 유효성 검사 성공 시:

                // 로컬 스토리지에서 이미 구독되었는지 확인 (선택 사항, 서버와 별개)
                let emails = JSON.parse(localStorage.getItem('subscribedEmails')) || [];
                if (emails.includes(email)) {
                    subscribeMessage.textContent = '이미 구독된 이메일 주소입니다.';
                    subscribeMessage.style.color = 'orange';
                    return; // 중복이면 여기서 함수 종료
                }

                // Netlify Forms로 AJAX 제출 (핵심!)
                // 폼의 name 속성을 사용합니다 (여기서는 "email_subscribe")
                fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    // FormData를 URLSearchParams로 변환하여 전송 (폼의 모든 name=value 데이터를 자동으로 포함)
                    body: new URLSearchParams(new FormData(subscribeForm)).toString(),
                })
                .then(response => {
                    if (response.ok) { // 응답 상태가 200번대인 경우 성공
                        subscribeMessage.textContent = "감사합니다! 성공적으로 구독되었습니다.";
                        subscribeMessage.style.color = 'green';
                        emailInput.value = ''; // 입력 필드 초기화

                        // 성공 시에만 로컬 스토리지에 저장
                        emails.push(email);
                        localStorage.setItem('subscribedEmails', JSON.stringify(emails));
                    } else {
                        // Netlify 응답이 200번대가 아닌 경우 (예: 4xx, 5xx)
                        subscribeMessage.textContent = "오류가 발생했습니다. 다시 시도해주세요.";
                        subscribeMessage.style.color = 'red';
                        console.error('Netlify form submission error:', response.status, response.statusText);
                    }
                })
                .catch((error) => {
                    // 네트워크 오류 등 fetch 자체의 오류
                    subscribeMessage.textContent = "네트워크 오류가 발생했습니다. 다시 시도해주세요.";
                    subscribeMessage.style.color = 'red';
                    console.error('Form submission fetch error:', error);
                });
            }
        });
    }

    // 이메일 유효성 검사 함수 (기존 코드 유지)
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});