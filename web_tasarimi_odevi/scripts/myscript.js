// --- 1. KATEGORİ FİLTRELEME ---
function filtrele(kategori, el) {
    document.querySelectorAll('.kart').forEach(k => 
        k.style.display = (kategori === 'hepsi' || k.dataset.kategori === kategori) ? "" : "none");
    
    document.querySelectorAll('.cat-list a').forEach(a => a.classList.toggle('active-cat', a === el));
}

// --- 2. SEPET ALGORİTMASI ---
function sepeteEkle(id, isim, yazar, fiyat, resim) {
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    let urun = sepet.find(u => u.id === id);
    urun ? urun.adet++ : sepet.push({ id, isim, yazar, fiyat, resim, adet: 1 });
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    alert(`${isim} sepete eklendi!`);
}

function sepetiListele() {
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    let urunlerAlani = document.querySelector('.sepet-urunleri');
    let ozetAlani = document.querySelector('.sepet-ozet');

    if (sepet.length === 0) {
        if (urunlerAlani) urunlerAlani.innerHTML = '<h2>Sepetim</h2><div class="bos-sepet">Sepetinizde ürün bulunmamaktadır. <a href="urunler.html" class="btn">Alışverişe Başla</a></div>';
        if (ozetAlani) ozetAlani.style.display = "none";
        return;
    }

    let toplam = sepet.reduce((sum, u) => sum + (u.fiyat * u.adet), 0);
    urunlerAlani.innerHTML = `<h2>Sepetim (${sepet.length} Ürün)</h2>` + sepet.map((u, i) => `
        <div class="sepet-kart">
            <img src="${u.resim}" alt="${u.isim}">
            <div class="urun-detay"><h4>${u.isim}</h4><p>${u.yazar}</p></div>
            <div class="urun-adet">
                <button class="adet-btn" onclick="adetGuncelle(${i}, -1)">-</button>
                <input type="number" value="${u.adet}" readonly>
                <button class="adet-btn" onclick="adetGuncelle(${i}, 1)">+</button>
            </div>
            <div class="urun-fiyat">${u.fiyat * u.adet} TL</div>
            <button class="sil-btn" onclick="adetGuncelle(${i}, -999)">&times;</button>
        </div>`).join('');

    if(document.getElementById('urun-toplam-fiyat')) document.getElementById('urun-toplam-fiyat').innerText = toplam + " TL";
    if(document.getElementById('genel-toplam-fiyat')) document.getElementById('genel-toplam-fiyat').innerText = toplam + " TL";
}

function adetGuncelle(i, degisim) {
    let sepet = JSON.parse(localStorage.getItem('sepetim'));
    if (degisim === -999) sepet.splice(i, 1);
    else {
        sepet[i].adet += degisim;
        if (sepet[i].adet < 1) sepet.splice(i, 1);
    }
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    sepetiListele();
}

// --- 3. OYUN ALANI ---
const oyunKitaplari = [
    { ad: "Nutuk", yazar: "Mustafa Kemal Atatürk", siklar: ["Mustafa Kemal Atatürk", "Halide Edib Adıvar", "Ziya Gökalp"] },
    { ad: "Gurur ve Önyargı", yazar: "Jane Austen", siklar: ["Charles Dickens", "Jane Austen", "Virginia Woolf"] },
    { ad: "Simyacı", yazar: "Paulo Coelho", siklar: ["Gabriel Garcia Marquez", "Franz Kafka", "Paulo Coelho"] }
];

let mevcutSoru = {}, skor = 0;

function yeniSoruGetir() {
    mevcutSoru = oyunKitaplari[Math.floor(Math.random() * oyunKitaplari.length)];
    let alan = document.getElementById("seceneklerAlani");
    if(!alan) return;
    document.getElementById("oyunKitapAdi").innerText = mevcutSoru.ad;
    document.getElementById("oyunDurum").innerText = "";
    alan.innerHTML = mevcutSoru.siklar.map(s => `<button onclick="cevapKontrol('${s}')">${s}</button>`).join('');
}

function cevapKontrol(secim) {
    const dogru = secim === mevcutSoru.yazar;
    skor += dogru ? 10 : (skor > 0 ? -5 : 0);
    document.getElementById("oyunDurum").innerText = dogru ? "🎉 Doğru!" : "❌ Yanlış!";
    document.getElementById("oyunSkor").innerText = skor;
    document.querySelectorAll("#seceneklerAlani button").forEach(b => b.disabled = true);
    setTimeout(yeniSoruGetir, 1500);
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('.sepet-kapsayici')) sepetiListele();
    if (document.getElementById("oyunKitapAdi")) yeniSoruGetir();
});