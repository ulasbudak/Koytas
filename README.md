# Koytaş Yapı — Web Sitesi

Koytaş Yapı için hazırlanmış, mühendislik/inşaat/taahhüt hizmetlerini tanıtan tek sayfalık statik web sitesi.

**Canlı site:** [koytasyapi.com](https://koytasyapi.com)

## İçerik

- `index.html` — Tek sayfalık site (hakkımızda, hizmetler, projeler, iletişim)
- Görseller: `LOGO.png`, `LOGO_Arkaplansiz.png`, `ArkaFon.png`, `Vinc.png`, `Konsept.jpeg`, `Proje_Sureci.jpeg`, `proj*.jpeg`, vb.
- `SiteVideo.mp4` — Sitede kullanılan tanıtım videosu

## Yerelde çalıştırma

Statik bir sitedir, build adımı gerekmez:

```bash
python3 -m http.server 8000
```

`http://localhost:8000/index.html` adresini açın.

## İletişim formu

Sayfadaki iletişim formu (`#contactForm`) şu an `mailto:` yönlendirmesi kullanıyor; gerçek bir backend'e (ör. Formspree) bağlanmıyor.

## Lisans

Bu depodaki tüm kod, metin ve görseller Koytaş Yapı'ya aittir. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakınız.
