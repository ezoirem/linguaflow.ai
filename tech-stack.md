# tech-stack.md — LinguaFlow AI Teknoloji Yığını

## Seçilen Teknolojiler

| Katman | Teknoloji | Versiyon | Seçim Gerekçesi |
|---|---|---|---|
| **Framework** | Next.js | latest | App Router ile server-side route desteği; API key'i client'a expose etmeden Gemini'yi çağırmak için şart |
| **Dil** | TypeScript | latest | Tip güvenliği; `SpeechRecognition` gibi tarayıcı API'lerini güvenle sarmalamak için |
| **Stil** | Tailwind CSS | latest | Utility-first, hızlı prototipleme; dark theme ve responsive layout kolay |
| **AI Modeli** | Gemini 1.5 Flash | — | Hız (düşük latency), ücretsiz Google AI Studio API erişimi, Türkçe prompt desteği |
| **Ses Girişi** | Web Speech API | — | Sıfır kurulum, tarayıcı üzerinde native çalışıyor, harici SDK gerektirmiyor |
| **Ses Çıkışı** | SpeechSynthesis API | — | Aynı şekilde native, ek maliyet yok |
| **İkonlar** | Lucide React | latest | Hafif, tree-shakeable, tutarlı ikon seti |
| **Deploy** | Vercel / Netlify | — | GitHub entegrasyonu, otomatik HTTPS (mikrofon izni için zorunlu), ücretsiz tier yeterli |
| **Analytics** | Vercel Analytics | — | Sıfır konfigürasyonla sayfa görüntüleme ve performans takibi |

---

## Neden Bu Stack?

### Next.js + TypeScript
Gemini API key'ini `NEXT_PUBLIC_` prefix olmadan `.env.local`'da tutmak ve sadece server route (`/api/chat`) üzerinden çağırmak için Next.js şarttı. Bu sayede key hiçbir zaman tarayıcıya gitmez.

### Gemini 1.5 Flash
Flash modeli Pro'ya kıyasla yaklaşık 5x daha hızlı yanıt veriyor ve konuşma akışı için kritik olan düşük latency'yi sağlıyor. Google AI Studio üzerinden tamamen ücretsiz.

### Web Speech API
Ek paket yok, ek maliyet yok. Chrome ve Edge üzerinde güvenilir şekilde çalışıyor. Mobil Safari desteği kısıtlı — bu nedenle README'de Chrome/Edge zorunluluğu belirtildi.

### Tailwind CSS
`dark:` prefix olmadan tek bir dark theme üzerinde hızlıca çalışmak için ideal. `slate-950` tabanlı koyu arkaplan, `cyan-400 → violet-500` gradient aksanlar.

---

## Kurulum

```bash
# 1. Bağımlılıkları kur
npm install

# 2. Ortam değişkenlerini ayarla
cp .env.example .env.local
# .env.local içine GEMINI_API_KEY=senin_anahtarin yaz

# 3. Google AI Studio'dan API anahtarı al
# → aistudio.google.com → "Get API Key"

# 4. Geliştirme sunucusunu başlat
npm run dev

# 5. Production build testi
npm run build
```

---

## Proje Klasör Yapısı

```
linguflow-ai/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # Gemini API proxy (server-side)
│   ├── globals.css            # Global stiller + DM Sans font
│   ├── layout.tsx             # Root layout + SEO metadata
│   ├── page.tsx               # Ana uygulama (tüm 3 faz)
│   ├── error.tsx              # Hata sayfası
│   ├── loading.tsx            # Yükleme sayfası
│   ├── not-found.tsx          # 404 sayfası
│   ├── sitemap.ts             # SEO sitemap
│   ├── robots.ts              # robots.txt
│   └── manifest.ts            # PWA manifest
├── features/                  # Kaynak kodları (buildathon gereksinimi)
│   ├── page.tsx               # Ana bileşen kopyası
│   └── route.ts               # API route kopyası
├── .env.example               # Ortam değişkeni şablonu
├── .env.local                 # Gerçek API key (git'e gitmez!)
├── idea.md                    # Proje fikri ve rakip analizi
├── prd.md                     # Ürün gereksinim belgesi
├── tasks.md                   # Görev listesi
├── user-flow.md               # Kullanıcı akışı
├── tech-stack.md              # Bu dosya
├── README.md                  # Kurulum ve kullanım kılavuzu
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Güvenlik Notları

- `GEMINI_API_KEY` asla `NEXT_PUBLIC_` ile başlamamalı
- `.env.local` `.gitignore`'a eklenmiş olmalı
- Tüm API çağrıları `app/api/chat/route.ts` üzerinden geçiyor
