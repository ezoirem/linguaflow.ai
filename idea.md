# LinguaFlow AI — İnteraktif Dil Pratiği Simülatörü

## 💡 Problem

Dil öğrenen birçok kişi gramer bilse de "konuşma bariyerini" aşamıyor. Gerçek insanlarla pratik yapmak maliyetli, her an erişilebilir değil ve hata yapma korkusu (sosyal kaygı) öğrenme sürecini yavaşlatıyor. Özellikle iş hayatı veya günlük hayattaki spesifik senaryolara (mülakat, havalimanı, restoran) hazırlık yapacak güvenli bir alan yok.

## 👤 Kullanıcı

- Konuşma pratiği yapmak isteyen dil öğrencileri
- Yurt dışına çıkmaya hazırlanan gezginler
- İş hayatında (mülakat, sunum, kriz yönetimi) İngilizce becerini geliştirmek isteyen çalışanlar

## 🤖 AI'ın Rolü

- **Senaryo Karakteri:** Gemini API seçilen senaryoya göre bir karakter canlandırır (HR yöneticisi, garson, otel görevlisi vb.) ve diyaloğu doğal şekilde sürdürür.
- **Anlık Düzeltme:** Her kullanıcı mesajının ardından gramer/kelime hatasını tespit eder ve koç notu olarak gösterir.
- **Ses Entegrasyonu:** Web Speech API ile kullanıcı sesi metne dönüştürülür; AI yanıtı Speech Synthesis ile seslendirilir.
- **Performans Özeti:** Seans sonunda kullanıcıya puan, güçlü yönler ve gelişim alanları içeren bir özet sunulur.

## 🔍 Rakip Durum

| Rakip | Güçlü Yönler | Eksikler |
|---|---|---|
| **Duolingo** | Gamification, geniş içerik | Gerçek konuşma pratiği yok, senaryo bazlı değil |
| **Speak App** | Sese odaklı | Aylık ücret (~$15), senaryo çeşitliliği sınırlı |
| **ChatGPT** | Güçlü dil modeli | Senaryo yok, ses entegrasyonu yok, koçluk yok |
| **italki** | Gerçek öğretmen | Pahalı ($15-40/saat), anlık erişim yok |

**Bizim Farkımız:** 7/24 ücretsiz, senaryo bazlı, sesli, anlık gramer geri bildirimi olan ve Türkçe arayüze sahip tek platform.

## ✅ Başarı Kriteri

Kullanıcı, seçtiği bir İngilizce senaryoda (ör. iş mülakatı) mikrofona konuşur, 2 saniyede AI yanıtını alır, gramer hatasını ekranda görür ve seans sonunda puanıyla birlikte neleri geliştirdiğini öğrenir. Tüm bunlar sıfır ücret ve sıfır bekleme süresiyle gerçekleşir.
