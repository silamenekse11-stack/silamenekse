/* --- 1. OYUN VERİLERİ --- */
const oyunKitaplari = [
    { ad: "Nutuk", yazar: "Mustafa Kemal Atatürk", siklar: ["Mustafa Kemal Atatürk", "Halide Edib Adıvar", "İlber Ortaylı"] },
    { ad: "Gurur ve Önyargı", yazar: "Jane Austen", siklar: ["Jane Austen", "George Orwell", "Antoine de Saint-Exupéry"] },
    { ad: "Simyacı", yazar: "Paulo Coelho", siklar: ["Paulo Coelho", "José Mauro de Vasconcelos", "Doğan Cüceloğlu"] },
    { ad: "Nutuk (Özel Baskı)", yazar: "Mustafa Kemal Atatürk", siklar: ["Mustafa Kemal Atatürk", "İlber Ortaylı", "Kai-Fu Lee"] },
    { ad: "Küçük Prens", yazar: "Antoine de Saint-Exupéry", siklar: ["Antoine de Saint-Exupéry", "Jane Austen", "Paulo Coelho"] },
    { ad: "Şeker Portakalı", yazar: "José Mauro de Vasconcelos", siklar: ["José Mauro de Vasconcelos", "George Orwell", "Doğan Cüceloğlu"] },
    { ad: "1984", yazar: "George Orwell", siklar: ["George Orwell", "Stephen Hawking", "Kai-Fu Lee"] },
    { ad: "Damdan Düşen Psikolog", yazar: "Doğan Cüceloğlu", siklar: ["Doğan Cüceloğlu", "İlber Ortaylı", "Mustafa Kemal Atatürk"] },
    { ad: "Bir Ömür Nasıl Yaşanır", yazar: "İlber Ortaylı", siklar: ["İlber Ortaylı", "Doğan Cüceloğlu", "Kai-Fu Lee"] },
    { ad: "Zamanın Kısa Tarihi", yazar: "Stephen Hawking", siklar: ["Stephen Hawking", "Kai-Fu Lee", "George Orwell"] },
    { ad: "Yapay Zeka ve Gelecek", yazar: "Kai-Fu Lee", siklar: ["Kai-Fu Lee", "Stephen Hawking", "Paulo Coelho"] }
];

let mevcutSoru = {}, skor = 0, soruSayaci = 0;
const TOPLAM_SORU = 10;

/* --- OYUN FONKSİYONLARI --- */
function yeniSoruGetir() {
    if (soruSayaci >= TOPLAM_SORU) {
        oyunuBitir();
        return;
    }
    soruSayaci++;
    mevcutSoru = oyunKitaplari[Math.floor(Math.random() * oyunKitaplari.length)];
    
    let alan = document.getElementById("seceneklerAlani");
    if (!alan) return;
    
    document.getElementById("oyunKitapAdi").innerText = mevcutSoru.ad;
    document.getElementById("oyunDurum").innerText = `Soru ${soruSayaci} / ${TOPLAM_SORU}`;
    alan.innerHTML = mevcutSoru.siklar.map(s => `<button onclick="cevapKontrol('${s}')" class="oyun-btn">${s}</button>`).join('');
}

function cevapKontrol(secim) {
    const dogru = secim === mevcutSoru.yazar;
    skor += dogru ? 10 : (skor > 0 ? -5 : 0);
    document.getElementById("oyunDurum").innerText = dogru ? "🎉 Doğru!" : "❌ Yanlış!";
    document.getElementById("oyunSkor").innerText = skor;
    
    document.querySelectorAll(".oyun-btn").forEach(b => b.disabled = true);
    setTimeout(() => (soruSayaci < TOPLAM_SORU ? yeniSoruGetir() : oyunuBitir()), 1500);
}

function oyunuBitir() {
    document.getElementById("oyunKitapAdi").innerText = "Oyun Bitti!";
    document.getElementById("oyunDurum").innerText = `Final Skorun: ${skor}`;
    document.getElementById("seceneklerAlani").innerHTML = `<button onclick="oyunuSifirla()" class="btn-yeniden-baslat">Tekrar Başla</button>`;
}

function oyunuSifirla() {
    skor = 0; soruSayaci = 0; 
    document.getElementById("oyunSkor").innerText = skor; 
    yeniSoruGetir();
}

/* --- SEPET ALGORİTMASI --- */
function sepeteEkle(id, isim, yazar, fiyat, resim) {
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    let urun = sepet.find(u => u.id === id);
    
    if (urun) {
        urun.adet++;
    } else {
        sepet.push({ id, isim, yazar, fiyat: parseFloat(fiyat), resim, adet: 1 });
    }
    
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    alert(`${isim} sepete eklendi!`);
}

function sepetiListele() {
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    let urunlerAlani = document.querySelector('.sepet-urunleri');
    let ozetAlani = document.querySelector('.sepet-ozet');

    if (!urunlerAlani) return;

    if (sepet.length === 0) {
        urunlerAlani.innerHTML = `
            <div class="bos-sepet">
                <div class="bos-ikon">🛒</div>
                <h2>Sepetiniz Şu An Boş</h2>
                <p>Düşlerinizdeki kitabı henüz seçmediniz. Harika kitaplarımızı keşfetmeye ne dersiniz?</p>
                <a href="urunler.html" class="btn">Kitaplara Göz At</a>
            </div>`;
        if (ozetAlani) ozetAlani.style.display = "none";
        return;
    }

    let toplam = sepet.reduce((sum, u) => sum + (parseFloat(u.fiyat) * u.adet), 0);
    
    urunlerAlani.innerHTML = `<h2>Sepetim (${sepet.length} Ürün)</h2>` + sepet.map((u, i) => `
        <div class="sepet-kart">
            <img src="${u.resim}" alt="${u.isim}">
            <div class="urun-detay"><h4>${u.isim}</h4><p>${u.yazar}</p></div>
            <div class="urun-adet">
                <button class="adet-btn" onclick="adetGuncelle(${i}, -1)">-</button>
                <input type="number" value="${u.adet}" readonly>
                <button class="adet-btn" onclick="adetGuncelle(${i}, 1)">+</button>
            </div>
            <div class="urun-fiyat">${(parseFloat(u.fiyat) * u.adet).toFixed(2)} TL</div>
            <button class="sil-btn" onclick="adetGuncelle(${i}, -999)">&times;</button>
        </div>`).join('');

    if (document.getElementById('urun-toplam-fiyat')) 
        document.getElementById('urun-toplam-fiyat').innerText = toplam.toFixed(2) + " TL";
    if (document.getElementById('genel-toplam-fiyat')) 
        document.getElementById('genel-toplam-fiyat').innerText = toplam.toFixed(2) + " TL";
}

function adetGuncelle(i, degisim) {
    let sepet = JSON.parse(localStorage.getItem('sepetim'));
    if (degisim === -999) {
        sepet.splice(i, 1);
    } else {
        sepet[i].adet += degisim;
        if (sepet[i].adet < 1) sepet.splice(i, 1);
    }
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    sepetiListele();
}

/* --- KATEGORİ FİLTRELEME --- */
function filtrele(kategori) {
    localStorage.setItem('seciliKategori', kategori);
    const kartlar = document.querySelectorAll('.kart');
    const kategoriLinkleri = document.querySelectorAll('.cat-list a');

    kategoriLinkleri.forEach(link => {
        link.classList.remove('active-cat');
        if (link.getAttribute('onclick').includes(kategori)) {
            link.classList.add('active-cat');
        }
    });

    kartlar.forEach(kart => {
        kart.style.display = (kategori === 'hepsi' || kart.getAttribute('data-kategori') === kategori) ? 'block' : 'none';
    });
}

/* --- BAŞLATICI --- */
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('.sepet-urunleri')) sepetiListele();
    if (document.getElementById("oyunKitapAdi")) yeniSoruGetir();
});