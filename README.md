# LinguaFlow AI

> 🎙️ 7/24 erişilebilir, yargılamayan, anlık geri bildirimli yapay zeka konuşma partneri.

---

## Problem

Dil öğrenen birçok kişi gramer bilse de "konuşma bariyerini" aşamıyor. Gerçek insanlarla pratik yapmak maliyetli, her an erişilebilir değil ve hata yapma korkusu öğrenme sürecini yavaşlatıyor. Özellikle iş mülakatı, havalimanı, restoran gibi spesifik senaryolara hazırlanmak için güvenli bir alan eksikliği var.

## Çözüm

LinguaFlow AI, kullanıcıları gerçek hayat senaryolarının içine sokar. Mikrofona konuşursun → Gemini API bir karakter canlandırır ve yanıt verir → Gramer hatalarını anlık görürsün → Seans sonunda puanınla birlikte gelişim notlarını alırsın. Tamamen ücretsiz, tarayıcıda, kurulum gerektirmeden.

**AI'ın rolü:**
- **Senaryo Yönetimi:** Gemini 1.5 Flash, HR yöneticisi / garson / otel görevlisi gibi karakterler canlandırır
- **Anlık Koçluk:** Her mesajda gramer ve kelime hatalarını tespit eder
- **Sesli Etkileşim:** Web Speech API ile konuşma ↔ metin dönüşümü

## Canlı Demo

🌐 **Yayın Linki:** `(https://ezokeskin.lovable.app/)`
🎬 **Demo Video:** *(çekim sonrası eklenecek)*

---

## Özellikler

- 🎭 **6 Senaryo:** İş Mülakatı, Ofis Çatışması, Restoran, Sohbet, Havalimanı, Otel
- 🎙️ **Basılı Tut & Konuş** mikrofon deneyimi
- 📝 **Anlık Koç Notu** — her mesajın altında gramer geri bildirimi
- 🔊 **Otomatik TTS** — AI yanıtları seslendirilir
- 🏆 **Seans Özeti** — puan, güçlü yönler, gelişim alanları
- 📥 **JSON Export** — seans geçmişini indir
- 🌍 **TR/EN Arayüz** — tek tıkla dil değiştir

---

## Kullanılan Teknolojiler

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS**
- **Gemini 1.5 Flash** (Google AI Studio API)
- **Web Speech API** (SpeechRecognition + SpeechSynthesis)
- **Lucide React**
- **Vercel** (deploy + analytics)

---

## Nasıl Kurulur ve Çalıştırılır?

### Gereksinimler
- Node.js 18+
- Chrome veya Edge tarayıcısı (mikrofon için)
- Google AI Studio API anahtarı (ücretsiz: [aistudio.google.com](https://aistudio.google.com))

### Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/KULLANICI_ADIN/linguaflow-ai.git
cd linguaflow-ai

# 2. Bağımlılıkları kur
npm install

# 3. Ortam değişkenlerini ayarla
cp .env.example .env.local
```

`.env.local` dosyasını aç ve API anahtarını ekle:

```env
GEMINI_API_KEY=buraya_gercek_anahtarini_yaz
```

```bash
# 4. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

### Production Build

```bash
npm run build
npm run start
```

---

## Proje Yapısı

```
linguaflow-ai/
├── app/
│   ├── api/chat/route.ts   # Gemini API proxy
│   ├── page.tsx            # Ana uygulama
│   ├── layout.tsx          # Root layout + SEO
│   └── globals.css         # Global stiller
├── features/               # Kaynak kodları
├── idea.md                 # Proje fikri ve rakip analizi
├── prd.md                  # Ürün gereksinim belgesi
├── tasks.md                # Görev listesi
├── user-flow.md            # Kullanıcı akışı
└── tech-stack.md           # Teknoloji seçimleri
```

---

## Notlar

- Mikrofon için Chrome veya Edge kullanın
- Production'da HTTPS zorunlu (mikrofon izni için)
- API key hiçbir zaman client'a expose edilmez (server route üzerinden çalışır)

---
