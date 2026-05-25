// ==========================================================================
// 1. KATEGORİ FİLTRELEME FONKSİYONU (ÜRÜNLER SAYFASI)
// ==========================================================================

function filtrele(secilenKategori) {
    let kitaplar = document.querySelectorAll('.kart');
    kitaplar.forEach(function(kitap) {
        let kitapKategorisi = kitap.getAttribute('data-kategori');
        if (secilenKategori === 'hepsi' || kitapKategorisi === secilenKategori) {
            kitap.style.display = "";
        } else {
            kitap.style.display = "none";
        }
    });

    let kategoriLinkleri = document.querySelectorAll('.cat-list a');
    kategoriLinkleri.forEach(function(link) {
        link.classList.remove('active-cat');
    });

    if (window.event && window.event.target) {
        window.event.target.classList.add('active-cat');
    }
}

// ==========================================================================
// 2. SEPET ALGORİTMASI VE LOCALSTORAGE YÖNETİMİ
// ==========================================================================

document.addEventListener("DOMContentLoaded", function() {
    if (document.querySelector('.sepet-kapsayici')) {
        sepetiListele();
    }
    // Oyun alanı kontrolü
    if (document.getElementById("oyunKitapAdi")) {
        yeniSoruGetir();
    }
});

// GERÇEK SEPETE EKLEME FONKSİYONU (Diğerini sildim, bu tek olacak)
function sepeteEkle(id, isim, yazar, fiyat, resim) {
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    let varOlanUrun = sepet.find(urun => urun.id === id);
    
    if (varOlanUrun) {
        varOlanUrun.adet += 1;
    } else {
        sepet.push({ id: id, isim: isim, yazar: yazar, fiyat: fiyat, resim: resim, adet: 1 });
    }
    
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    alert(isim + " sepetine eklendi!");
}

function sepetiListele() {
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    let urunlerAlani = document.querySelector('.sepet-urunleri');
    let ozetAlani = document.querySelector('.sepet-ozet');
    
    if (sepet.length === 0) {
        if(urunlerAlani) {
            urunlerAlani.innerHTML = `<h2>Sepetim</h2><div class="bos-sepet"><p>Sepetinizde şu anda ürün bulunmamaktadır.</p><a href="urunler.html" class="btn">Alışverişe Başla</a></div>`;
        }
        if (ozetAlani) ozetAlani.style.display = "none";
        return;
    }
    
    if (ozetAlani) ozetAlani.style.display = "block";
    let htmlIcerik = `<h2>Sepetim (${sepet.length} Ürün)</h2>`;
    let urunToplam = 0;
    
    sepet.forEach(function(urun, sira) {
        let kartFiyati = urun.fiyat * urun.adet;
        urunToplam += kartFiyati;
        htmlIcerik += `
            <div class="sepet-kart">
                <img src="${urun.resim}" alt="${urun.isim}">
                <div class="urun-detay">
                    <h4>${urun.isim}</h4>
                    <p class="yazar">${urun.yazar}</p>
                </div>
                <div class="urun-adet">
                    <button class="adet-btn" onclick="adetDegistir(${sira}, -1)">-</button>
                    <input type="number" value="${urun.adet}" readonly>
                    <button class="adet-btn" onclick="adetDegistir(${sira}, 1)">+</button>
                </div>
                <div class="urun-fiyat">${kartFiyati} TL</div>
                <button class="sil-btn" onclick="sepettenUrunSil(${sira})">&times;</button>
            </div>
        `;
    });
    
    if(urunlerAlani) urunlerAlani.innerHTML = htmlIcerik;
    document.getElementById('urun-toplam-fiyat').innerText = urunToplam + " TL";
    document.getElementById('genel-toplam-fiyat').innerText = urunToplam + " TL";
}

function adetDegistir(sira, degisim) {
    let sepet = JSON.parse(localStorage.getItem('sepetim'));
    sepet[sira].adet += degisim;
    if (sepet[sira].adet < 1) { sepet.splice(sira, 1); }
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    sepetiListele();
}

function sepettenUrunSil(sira) {
    let sepet = JSON.parse(localStorage.getItem('sepetim'));
    sepet.splice(sira, 1);
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    sepetiListele();
}

// ==========================================================================
// YAN MENÜ (SIDEBAR) İÇİN MİNİ KİTAP BİLMECE OYUNU
// ==========================================================================

const oyunKitaplari = [
    { ad: "Nutuk", yazar: "Mustafa Kemal Atatürk", siklar: ["Mustafa Kemal Atatürk", "Halide Edib Adıvar", "Ziya Gökalp"] },
    { ad: "Gurur ve Önyargı", yazar: "Jane Austen", siklar: ["Charles Dickens", "Jane Austen", "Virginia Woolf"] },
    { ad: "Simyacı", yazar: "Paulo Coelho", siklar: ["Gabriel Garcia Marquez", "Franz Kafka", "Paulo Coelho"] },
    { ad: "Küçük Prens", yazar: "Antoine de Saint-Exupéry", siklar: ["Jules Verne", "Antoine de Saint-Exupéry", "Victor Hugo"] },
    { ad: "1984", yazar: "George Orwell", siklar: ["George Orwell", "Aldous Huxley", "Ray Bradbury"] },
    { ad: "Bir Ömür Nasıl Yaşanır", yazar: "İlber Ortaylı", siklar: ["Celal Şengör", "İlber Ortaylı", "Halil İnalcık"] }
];

let mevcutSoru = {};
let skor = 0;

function yeniSoruGetir() {
    const durumAlani = document.getElementById("oyunDurum");
    if (durumAlani) { durumAlani.innerText = ""; durumAlani.style.color = "initial"; }
    const rastgeleIndeks = Math.floor(Math.random() * oyunKitaplari.length);
    mevcutSoru = oyunKitaplari[rastgeleIndeks];
    const kitapAdiAlani = document.getElementById("oyunKitapAdi");
    if (kitapAdiAlani) { kitapAdiAlani.innerText = mevcutSoru.ad; }
    const seceneklerAlani = document.getElementById("seceneklerAlani");
    if (!seceneklerAlani) return; 
    seceneklerAlani.innerHTML = "";
    mevcutSoru.siklar.forEach(sik => {
        const buton = document.createElement("button");
        buton.innerText = sik;
        buton.onclick = function() { cevapKontrolEt(sik); };
        seceneklerAlani.appendChild(buton);
    });
}

function cevapKontrolEt(secilenYazar) {
    const durumAlani = document.getElementById("oyunDurum");
    const tumButonlar = document.querySelectorAll("#seceneklerAlani button");
    tumButonlar.forEach(btn => btn.disabled = true);
    if (secilenYazar === mevcutSoru.yazar) {
        durumAlani.innerText = "🎉 Doğru Cevap!";
        durumAlani.style.color = "#2e7d32"; 
        skor += 10; 
    } else {
        durumAlani.innerText = "❌ Yanlış Cevap!";
        durumAlani.style.color = "#c62828"; 
        if (skor > 0) skor -= 5; 
    }
    const skorAlani = document.getElementById("oyunSkor");
    if (skorAlani) { skorAlani.innerText = skor; }
    setTimeout(yeniSoruGetir, 2000);
}