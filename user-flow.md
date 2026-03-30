# user-flow.md — LinguaFlow AI Kullanıcı Akışı

## Genel Akış

```
Uygulama Açılır
      │
      ▼
[Senaryo Seçim Ekranı]
  - Kategori seçilir (Profesyonel / Günlük Hayat / Seyahat)
  - Senaryo kartına tıklanır (ör. İş Mülakatı)
      │
      ▼
[Seans Ekranı]
  - AI karakteri açılış cümlesini yazar ve seslendirir
  - Kullanıcı mikrofon butonuna basılı tutar ve konuşur
  - Parmağını kaldırınca sistem sesi metne çevirir
  - AI metni analiz eder → gramer notu + yanıt üretir
  - AI yanıtı ekranda görünür ve seslendirilir
  - Bu döngü kullanıcı istediği kadar tekrar eder
      │
      ▼
[Seans Bitir]
  - Kullanıcı ✕ butonuna basar
      │
      ▼
[Özet Ekranı]
  - Puan (0-100), toplam mesaj, hatasız mesaj gösterilir
  - Gelişim alanları listelenir
  - "Yeni Seans" veya "JSON Dışa Aktar" seçilir
```

---

## Adım Adım Detay

### 1. Uygulama Açılır
- Kullanıcı `linguaflow.vercel.app` adresine gider
- Türkçe arayüzde "Senaryo Seçin" başlığı ve 3 kategori sekmesi karşılar
- Sağ üstte TR/EN dil değiştirme butonu vardır

### 2. Kategori Seçimi
- **Profesyonel:** İş Mülakatı, Ofis Çatışması
- **Günlük Hayat:** Restoran, Sohbet
- **Seyahat:** Havalimanı Check-in, Otel Girişi
- Kullanıcı sekmeye tıklar, kartlar filtrelenir

### 3. Senaryo Başlatma
- Senaryo kartına tıklanır
- Seans ekranına geçilir
- AI karakteri otomatik olarak senaryoya uygun açılış cümlesini yazar ve seslendirir
  - Örnek (İş Mülakatı): *"Good morning! I'm Sarah, the HR Manager. Could you tell me a little about yourself?"*

### 4. Kullanıcı Konuşur
- Mikrofon butonuna basılı tutulur → "Dinleniyor…" göstergesi çıkar
- Kullanıcı İngilizce konuşur
- Parmak kaldırılır → ses metne dönüştürülür → "İşleniyor…" göstergesi
- Kullanıcı mesajı sohbet balonunda görünür

### 5. AI Yanıtı
- Gemini API hem karakter yanıtı hem gramer notu üretir
- Yanıt 1-3 saniye içinde gelir
- AI mesajı sohbet balonunda görünür
- Gramer notu mor renkte baloncuğun altında görünür: `✦ Koç Notu: ...`
- AI yanıtı otomatik seslendirilir (ses kapalıysa atlanır)

### 6. Döngü
- Kullanıcı istediği kadar konuşmaya devam eder
- Tarayıcı desteği yoksa (Chrome/Edge dışı) amber renkte uyarı gösterilir

### 7. Seans Sonu
- Kullanıcı sağ alttaki ✕ butonuna veya sıfırlama butonuna basar
- Özet ekranına geçilir

### 8. Özet
- Puan hesaplanır (mesaj sayısı + hatasız mesaj oranı)
- Gelişim notları (son 4 koç notu) listelenir
- **Yeni Seans:** Senaryo seçim ekranına döner
- **Dışa Aktar:** `linguaflow-seans-[timestamp].json` dosyası indirilir

---

## Hata Durumları

| Durum | Kullanıcıya Gösterilen |
|---|---|
| Chrome/Edge dışı tarayıcı | "Tarayıcınız ses tanımayı desteklemiyor" uyarısı |
| API key eksik | "API key not configured" mesajı (geliştirici görür) |
| Ağ hatası | Fallback mesajı: "Sorry, I didn't catch that. Could you try again?" |
| Mikrofon izni reddedildi | Dinleme durumu kapanır, buton normale döner |
