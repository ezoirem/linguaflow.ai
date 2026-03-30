# tasks.md — LinguaFlow AI Görev Listesi

## Adım 1 — Temel Altyapı

- [x] Görev 1: Next.js projesi oluştur, TypeScript + Tailwind kurulumu yap
- [x] Görev 2: Proje klasör yapısını oluştur (`app/`, `app/api/chat/`)
- [x] Görev 3: `.env.local` yapılandır, `GEMINI_API_KEY` değişkenini ekle
- [x] Görev 4: `globals.css` oluştur, DM Sans font entegrasyonu yap
- [x] Görev 5: `layout.tsx` oluştur, SEO metadata ekle

## Adım 2 — Senaryo Veritabanı ve Tip Tanımları

- [x] Görev 6: TypeScript tip tanımlarını yaz (`Message`, `Scenario`, `Phase`, `Lang`)
- [x] Görev 7: 6 adet senaryo verisini oluştur (id, icon, TR/EN label, desc, openingEN)
- [x] Görev 8: TR/EN UI string sözlüğünü (`UI` objesi) yaz
- [x] Görev 9: Sistem prompt builder fonksiyonu yaz (`buildSystemPrompt`)
- [x] Görev 10: LLM yanıt parser fonksiyonu yaz (`parseLLMResponse`)

## Adım 3 — Gemini API Entegrasyonu

- [x] Görev 11: `app/api/chat/route.ts` server route oluştur
- [x] Görev 12: Gemini 1.5 Flash API çağrısını yaz (fetch + JSON parse)
- [x] Görev 13: Hata yönetimi ekle (API key yok, ağ hatası)
- [x] Görev 14: `generationConfig` ayarla (temperature: 0.8, maxOutputTokens: 256)

## Adım 4 — Web Speech API Entegrasyonu

- [x] Görev 15: SpeechRecognition interface tanımla (TypeScript uyumlu)
- [x] Görev 16: `startListening` / `stopListening` fonksiyonlarını yaz
- [x] Görev 17: Press & hold mikrofon UX'ini uygula (onMouseDown/onMouseUp + touch)
- [x] Görev 18: `speak()` fonksiyonu yaz (SpeechSynthesis, ses kapatma desteğiyle)
- [x] Görev 19: Tarayıcı desteği kontrolü ekle, Chrome/Edge uyarısı göster

## Adım 5 — UI — Senaryo Seçim Ekranı

- [x] Görev 20: Kategori tab filtreleme (Profesyonel / Günlük Hayat / Seyahat)
- [x] Görev 21: Senaryo kartlarını oluştur (icon, başlık, açıklama, hover efekti)
- [x] Görev 22: Seçim yapılınca AI açılış mesajını göster ve seslendir

## Adım 6 — UI — Seans Ekranı

- [x] Görev 23: Sohbet baloncuklarını oluştur (kullanıcı sağda, AI solda)
- [x] Görev 24: Koç notlarını baloncuk altında göster
- [x] Görev 25: Yazıyor animasyonu ekle (3 nokta bounce)
- [x] Görev 26: Otomatik scroll ekle (chatEndRef)
- [x] Görev 27: Mikrofon butonu (dinleme, işleme, hazır durumları)
- [x] Görev 28: Ses kapat / seans bitir butonları

## Adım 7 — UI — Özet Ekranı

- [x] Görev 29: Puan hesaplama fonksiyonu yaz (`scoreSession`)
- [x] Görev 30: Özet kartlarını oluştur (puan, mesaj sayısı, hatasız sayı)
- [x] Görev 31: Gelişim notları listesi
- [x] Görev 32: JSON export fonksiyonu

## Adım 8 — Dil ve Erişilebilirlik

- [x] Görev 33: TR/EN toggle header butonu
- [x] Görev 34: Varsayılan dil TR olarak ayarla
- [x] Görev 35: Tüm UI metinleri `t` objesi üzerinden çek (hard-coded string yok)

## Adım 9 — Production Dosyaları

- [x] Görev 36: `error.tsx`, `loading.tsx`, `not-found.tsx` oluştur
- [x] Görev 37: `sitemap.ts`, `robots.ts`, `manifest.ts` oluştur
- [x] Görev 38: `README.md` buildathon şablonuna uygun yaz

## Adım 10 — Deploy

- [ ] Görev 39: Vercel / Netlify'a bağlan, `GEMINI_API_KEY` environment variable ekle
- [ ] Görev 40: Production build test et (`npm run build`)
- [ ] Görev 41: HTTPS ortamında mikrofon iznini test et (Chrome/Edge)
- [ ] Görev 42: End-to-end akış testi (senaryo seç → konuş → özet → export)
- [ ] Görev 43: Demo videosu çek (Loom, 2-3 dakika)
- [ ] Görev 44: Teslim formunu doldur
