const dotContainer = document.getElementById('dot-container');
const numDots = 3; 
const dots = [];

// SABİTLER
const FADE_DURATION = 1000; // CSS transition süresi (1 saniye)
const SPIN_DURATION = 3000; // CSS spin animasyonu süresi (3 saniye)
const VISIBLE_ANGLE_DEG = 360 * (30 / 100); // 108 derece

// **GÜNCELLENMİŞ SES NESNELERİ**
const radarSound = new Audio('radar.mp3'); 
radarSound.load(); 

// **YENİ EKLEME: LOOP SESİ**
const spinLoopSound = new Audio('radar-spin.mp3');
spinLoopSound.loop = true; // Sesin sürekli tekrarlamasını sağlar
spinLoopSound.load(); 

const startTime = Date.now();

// --- 1. Noktaları Oluşturma ve Konumlandırma Fonksiyonları ---

function setRandomPolarPosition(dotElement) {
    const radius = Math.random() * 50; 
    const angleRad = Math.random() * 2 * Math.PI; 
    
    const dx = radius * Math.cos(angleRad);
    const dy = radius * Math.sin(angleRad);

    const randomX = 50 + dx;
    const randomY = 50 + dy;
    
    dotElement.style.left = `${randomX}%`;
    dotElement.style.top = `${randomY}%`;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI); 
    
    angle = (angle + 90) % 360; 
    angle = (angle < 0) ? angle + 360 : angle; 

    return { angle: angle, distance: radius };
}

function createDot() {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dotContainer.appendChild(dot);
    
    const { angle, distance } = setRandomPolarPosition(dot);

    dots.push({
        element: dot,
        angle: angle,
        distance: distance,
        isVisible: false
    });
}

// --- 2. Animasyon Açısı Kontrolü ---
function checkDotVisibility(dot) {
    const elapsedTime = (Date.now() - startTime) % SPIN_DURATION;
    
    let currentAngleValue = (elapsedTime / SPIN_DURATION) * 360; 

    const ANGLE_OFFSET = 10;
    
    let bandStart = (currentAngleValue + ANGLE_OFFSET) % 360; 
    let bandEnd = (bandStart + VISIBLE_ANGLE_DEG) % 360; 

    let isInside = false;
    const dotAngle = dot.angle;

    if (bandStart < bandEnd) {
        if (dotAngle >= bandStart && dotAngle <= bandEnd) {
            isInside = true;
        }
    } else {
        if (dotAngle >= bandStart || dotAngle <= bandEnd) {
            isInside = true;
        }
    }
    
    return isInside;
}


// --- 3. Ana Animasyon Döngüsü ---
let isFlashing = false;

function animateDots() {
    dots.forEach(dot => {
        const shouldBeVisible = checkDotVisibility(dot);

        if (shouldBeVisible && !dot.isVisible && !isFlashing) {
            
            isFlashing = true; 
            dot.isVisible = true;

            // FADE-IN
            dot.element.classList.add('visible');
            
            // TEKİL VURUŞ SESİ
            radarSound.currentTime = 0; 
            radarSound.play().catch(e => console.error("Tekil radar sesi çalınamadı:", e)); 

            const visibleDuration = 1000; 

            setTimeout(() => {
                // FADE-OUT BAŞLANGICI
                dot.element.classList.remove('visible'); 

                setTimeout(() => {
                    dot.isVisible = false;
                    isFlashing = false; 
                    
                    const { angle, distance } = setRandomPolarPosition(dot.element);
                    dot.angle = angle;
                    dot.distance = distance;
                }, FADE_DURATION);
                
            }, visibleDuration); 
        }
    });

    requestAnimationFrame(animateDots);
}

// --- 4. BAŞLANGIÇ ---
// Tüm noktaları oluştur
for (let i = 0; i < numDots; i++) {
    createDot();
}

// Sürekli dönen sesi başlatacak yardımcı fonksiyon
function startLoopSound() {
    // Sadece henüz çalmıyorsa başlat
    if (spinLoopSound.paused) { 
        spinLoopSound.play().catch(e => {
            console.warn("Arka plan sesi çalınamadı, kullanıcı etkileşimi bekleniyor:", e);
        });
    }
}

// Animasyon döngüsünü başlat
animateDots();

// Sesin çalması için tarayıcı kısıtlamalarını aşmaya çalışıyoruz:
// Sayfa yüklendiğinde ve kullanıcı ilk etkileşimi yaptığında sesi başlat
document.addEventListener('click', startLoopSound, { once: true });
document.addEventListener('keydown', startLoopSound, { once: true });
startLoopSound(); // Mümkünse hemen başlatmayı dene