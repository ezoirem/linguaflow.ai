# PRD — LinguaFlow AI

## Ürün Özeti

LinguaFlow AI, kullanıcıların gerçek hayat İngilizce senaryolarını (iş mülakatı, restoran, havalimanı vb.) sesli olarak pratik yapmasını sağlayan bir web uygulamasıdır. Kullanıcı mikrofona konuşur, Gemini API karakteri canlandırır ve anlık gramer geri bildirimi verir.

---

## Hedef Kullanıcılar

- **Birincil:** 18-35 yaş arası, iş hayatı veya seyahat için İngilizce konuşmayı geliştirmek isteyen Türkçe konuşucular
- **İkincil:** Yurt dışına çıkış hazırlığı yapan üniversite öğrencileri

---

## Temel Özellikler

### MVP (Zorunlu)

| Özellik | Açıklama |
|---|---|
| Senaryo Seçimi | 6 hazır senaryo: İş Mülakatı, Ofis Çatışması, Restoran, Sohbet, Havalimanı, Otel |
| Sesli Giriş | Web Speech API ile basılı tut & konuş |
| AI Yanıtı | Gemini API ile karakter canlandırma ve doğal diyalog |
| Koç Notu | Her mesajda anlık gramer/kelime geri bildirimi |
| TTS | AI yanıtını otomatik seslendir |
| Seans Özeti | Puan, mesaj sayısı, gelişim alanları |
| TR/EN Arayüz | Dil değiştirme butonu |
| JSON Export | Seans geçmişini dışa aktar |

### Ekranlara Göre Akış

```
[Senaryo Seçim Ekranı]
  → Kategori filtreleme (Profesyonel / Günlük Hayat / Seyahat)
  → 6 senaryo kartı
  → Seçince otomatik başlar, AI ilk cümleyi kurar

[Seans Ekranı]
  → Sohbet baloncukları (kullanıcı sağda, AI solda)
  → Koç notu baloncuğun altında
  → Büyük mikrofon butonu (basılı tut & bırak)
  → Ses kapat / Seans bitir butonları

[Özet Ekranı]
  → Puan (0-100)
  → Toplam mesaj sayısı
  → Hatasız mesaj sayısı
  → Gelişim notları listesi
  → Yeni seans / Dışa aktar butonları
```

---

## Teknik Gereksinimler

| Alan | Detay |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Dil | TypeScript (strict mode) |
| Stil | Tailwind CSS |
| AI | Gemini 1.5 Flash (Google AI Studio API) |
| Ses | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| Deploy | Vercel / Netlify |

---

## API Entegrasyonu

- **Endpoint:** `POST /api/chat` (Next.js server route)
- **Model:** `gemini-1.5-flash`
- **API Key:** `.env.local` → `GEMINI_API_KEY`
- **Prompt Yapısı:** Sistem prompt (karakter + senaryo) + kullanıcı mesajı
- **Yanıt Formatı:** `[FEEDBACK: <not>]` + yanıt metni

---

## Kısıtlamalar

- Tarayıcı desteği: Chrome/Edge (Web Speech API için)
- HTTPS zorunlu (production'da mikrofon izni için)
- API key client'a expose edilmez (server route üzerinden)

---

## Başarı Metrikleri

- Kullanıcı en az 3 mesaj gönderiyor → seans tamamlandı sayılır
- AI yanıt süresi < 3 saniye
- `npm run build` hatasız geçiyor
