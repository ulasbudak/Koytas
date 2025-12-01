# Sosyal Medya Otomatik Entegrasyonu - Hızlı Başlangıç

Bu rehber, sosyal medya gönderilerini otomatik olarak sitenize eklemek için gerekli adımları içerir.

## 📋 İçindekiler

1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [API Token'larını Alma](#api-tokenlarını-alma)
3. [Kurulum](#kurulum)
4. [Kullanım](#kullanım)
5. [Sorun Giderme](#sorun-giderme)

---

## 🚀 Hızlı Başlangıç

### Seçenek 1: Backend API ile (Önerilen)

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Token'ları ayarlayın:**
   ```bash
   cp .env.example .env
   # .env dosyasını düzenleyip token'larınızı ekleyin
   ```

3. **Backend API'yi başlatın:**
   ```bash
   npm start
   ```

4. **HTML'e client-side script'i ekleyin:**
   `index.html` dosyasının sonuna, `</body>` etiketinden önce ekleyin:
   ```html
   <script src="./social-posts-loader.js"></script>
   <script>
     // API endpoint'inizi ayarlayın
     window.CONFIG = {
       API_ENDPOINT: 'http://localhost:3000/api/social-posts'
     };
   </script>
   ```

### Seçenek 2: Manuel Güncelleme Script'i

1. **Token'ları `social-posts-updater.js` dosyasına ekleyin**

2. **Script'i çalıştırın:**
   ```bash
   node social-posts-updater.js
   ```

3. **Cron job ile otomatikleştirin:**
   ```bash
   # Her saat başı çalıştır
   0 * * * * cd /path/to/project && node social-posts-updater.js
   ```

---

## 🔑 API Token'larını Alma

### Instagram

1. https://developers.facebook.com/ adresine gidin
2. Yeni bir app oluşturun
3. "Instagram Basic Display" ürününü ekleyin
4. OAuth redirect URI'ınızı ayarlayın
5. Test kullanıcısı ekleyin ve token alın

**Detaylı rehber:** https://developers.facebook.com/docs/instagram-basic-display-api

### Facebook

1. https://developers.facebook.com/ adresine gidin
2. Mevcut app'inizi kullanın veya yeni oluşturun
3. Graph API Explorer'ı açın
4. Page Access Token alın
5. Page ID'nizi bulun (Sayfa ayarları > Sayfa Bilgileri)

**Detaylı rehber:** https://developers.facebook.com/docs/graph-api

### LinkedIn

1. https://www.linkedin.com/developers/ adresine gidin
2. Yeni bir app oluşturun
3. OAuth 2.0 ile authentication yapın
4. Company Page ID'nizi bulun
5. Access token alın

**Detaylı rehber:** https://docs.microsoft.com/en-us/linkedin/

---

## 📦 Kurulum

### Gereksinimler

- Node.js 14+ 
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın veya dosyaları indirin**

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın:**
   ```bash
   cp .env.example .env
   ```

4. **`.env` dosyasını düzenleyin ve token'larınızı ekleyin**

5. **Test edin:**
   ```bash
   npm run update-posts
   ```

---

## 💻 Kullanım

### Backend API Kullanımı

Backend API'yi başlattıktan sonra:

```bash
# Tüm gönderileri getir
curl http://localhost:3000/api/social-posts

# Sadece Instagram
curl http://localhost:3000/api/social-posts/instagram

# Sadece Facebook
curl http://localhost:3000/api/social-posts/facebook

# Sadece LinkedIn
curl http://localhost:3000/api/social-posts/linkedin
```

### Client-Side Kullanımı

`social-posts-loader.js` dosyasını HTML'inize ekledikten sonra, sayfa yüklendiğinde otomatik olarak gönderiler güncellenecektir.

Manuel olarak güncellemek için:
```javascript
window.loadSocialPosts();
```

---

## 🔧 Sorun Giderme

### Token Hataları

**Problem:** "Invalid access token" hatası alıyorsunuz.

**Çözüm:**
- Token'ların süresi dolmuş olabilir, yenileyin
- Token'ların doğru kopyalandığından emin olun
- API izinlerini kontrol edin

### CORS Hatası

**Problem:** Browser'da CORS hatası alıyorsunuz.

**Çözüm:**
- `backend-api-example.js` dosyasındaki `ALLOWED_ORIGIN` değerini güncelleyin
- Backend'de CORS ayarlarını kontrol edin

### Instagram Embed Yüklenmiyor

**Problem:** Instagram gönderisi görünmüyor.

**Çözüm:**
- Instagram embed script'inin yüklendiğinden emin olun
- `data-instgrm-permalink` değerinin doğru olduğunu kontrol edin
- Browser console'da hata mesajlarını kontrol edin

### Rate Limiting

**Problem:** API'den çok fazla istek yapıyorsunuz.

**Çözüm:**
- İstek sıklığını azaltın (örn: her saat yerine her 6 saatte bir)
- Cache mekanizması ekleyin
- API limitlerini kontrol edin

---

## 📝 Notlar

- ⚠️ **Token'ları asla Git'e commit etmeyin!** `.env` dosyasını `.gitignore`'a ekleyin
- 🔒 Token'ları güvenli bir şekilde saklayın
- 🔄 Token'ları düzenli olarak yenileyin
- 📊 API limitlerini takip edin
- 🧪 Önce test ortamında deneyin

---

## 📚 Ek Kaynaklar

- [Instagram API Dokümantasyonu](https://developers.facebook.com/docs/instagram-api)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [LinkedIn API](https://docs.microsoft.com/en-us/linkedin/)
- [Detaylı Rehber](./social-media-integration-guide.md)

---

## ❓ Yardım

Sorularınız için:
- Detaylı rehberi okuyun: `social-media-integration-guide.md`
- API dokümantasyonlarını inceleyin
- Console log'larını kontrol edin

