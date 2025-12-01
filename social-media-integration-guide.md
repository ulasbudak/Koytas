# Sosyal Medya Gönderilerini Otomatik Ekleme Rehberi

Bu rehber, Instagram, Facebook ve LinkedIn gönderilerini otomatik olarak sitenize eklemek için gerekli adımları içerir.

## Seçenekler

### 1. **API Kullanımı (Önerilen)**
Her platformun resmi API'sini kullanarak gönderileri çekebilirsiniz.

### 2. **Backend Script ile Otomatik Güncelleme**
Sunucunuzda periyodik olarak çalışan bir script ile gönderileri güncelleyebilirsiniz.

### 3. **Third-Party Servisler**
RSS feed veya aggregator servisler kullanabilirsiniz.

---

## Instagram Entegrasyonu

### Instagram Basic Display API

**Gereksinimler:**
- Facebook Developer hesabı
- Instagram Business veya Creator hesabı
- App oluşturma ve token alma

**Adımlar:**
1. https://developers.facebook.com/ adresinden yeni bir app oluşturun
2. Instagram Basic Display ürününü ekleyin
3. OAuth redirect URI'ınızı ayarlayın
4. Access token alın

**Kod Örneği:**
```javascript
// Instagram API ile son gönderiyi çekme
async function fetchInstagramPost() {
  const ACCESS_TOKEN = 'YOUR_INSTAGRAM_ACCESS_TOKEN';
  const USER_ID = 'YOUR_INSTAGRAM_USER_ID';
  
  try {
    const response = await fetch(
      `https://graph.instagram.com/${USER_ID}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${ACCESS_TOKEN}&limit=1`
    );
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const post = data.data[0];
      return {
        image: post.media_url,
        caption: post.caption || '',
        link: post.permalink,
        timestamp: post.timestamp
      };
    }
  } catch (error) {
    console.error('Instagram API hatası:', error);
  }
}
```

### Alternatif: Instagram Embed (Mevcut Yöntem)
Şu anda kullandığınız embed yöntemi en basit çözümdür. Yeni gönderiler için sadece `data-instgrm-permalink` değerini güncellemeniz yeterlidir.

---

## Facebook Entegrasyonu

### Facebook Graph API

**Gereksinimler:**
- Facebook Developer hesabı
- Page Access Token

**Adımlar:**
1. https://developers.facebook.com/ adresinden app oluşturun
2. Graph API Explorer ile Page Access Token alın
3. Page ID'nizi bulun

**Kod Örneği:**
```javascript
// Facebook API ile son gönderiyi çekme
async function fetchFacebookPost() {
  const PAGE_ID = 'YOUR_FACEBOOK_PAGE_ID';
  const ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN';
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PAGE_ID}/posts?fields=id,message,created_time,full_picture,permalink_url&access_token=${ACCESS_TOKEN}&limit=1`
    );
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const post = data.data[0];
      return {
        image: post.full_picture || '',
        text: post.message || '',
        link: post.permalink_url,
        date: post.created_time
      };
    }
  } catch (error) {
    console.error('Facebook API hatası:', error);
  }
}
```

---

## LinkedIn Entegrasyonu

### LinkedIn API v2

**Gereksinimler:**
- LinkedIn Developer hesabı
- OAuth 2.0 authentication
- Company Page ID

**Adımlar:**
1. https://www.linkedin.com/developers/ adresinden app oluşturun
2. OAuth 2.0 ile authentication yapın
3. Company Page ID'nizi bulun

**Kod Örneği:**
```javascript
// LinkedIn API ile son gönderiyi çekme
async function fetchLinkedInPost() {
  const COMPANY_ID = 'YOUR_LINKEDIN_COMPANY_ID';
  const ACCESS_TOKEN = 'YOUR_LINKEDIN_ACCESS_TOKEN';
  
  try {
    const response = await fetch(
      `https://api.linkedin.com/v2/shares?q=owners&owners=${COMPANY_ID}&count=1`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );
    const data = await response.json();
    
    if (data.elements && data.elements.length > 0) {
      const post = data.elements[0];
      return {
        text: post.text?.text || '',
        link: `https://www.linkedin.com/feed/update/${post.id}`,
        timestamp: post.created?.time || Date.now()
      };
    }
  } catch (error) {
    console.error('LinkedIn API hatası:', error);
  }
}
```

---

## Backend Script Çözümü (Node.js Örneği)

Sunucunuzda periyodik olarak çalışan bir script oluşturabilirsiniz:

```javascript
// update-social-posts.js
const fs = require('fs');
const path = require('path');

async function updateSocialPosts() {
  // API çağrıları yapın
  const instagramPost = await fetchInstagramPost();
  const facebookPost = await fetchFacebookPost();
  const linkedInPost = await fetchLinkedInPost();
  
  // HTML dosyasını güncelleyin
  const htmlPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Instagram gönderisini güncelle
  if (instagramPost) {
    html = html.replace(
      /data-instgrm-permalink="[^"]*"/,
      `data-instgrm-permalink="${instagramPost.link}"`
    );
  }
  
  // Facebook gönderisini güncelle
  if (facebookPost) {
    // Facebook post HTML'ini güncelle
  }
  
  // LinkedIn gönderisini güncelle
  if (linkedInPost) {
    // LinkedIn post HTML'ini güncelle
  }
  
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Sosyal medya gönderileri güncellendi!');
}

// Her saat başı çalıştır (cron job ile)
setInterval(updateSocialPosts, 3600000);
updateSocialPosts(); // İlk çalıştırma
```

**Cron Job Kurulumu:**
```bash
# Her saat başı çalıştır
0 * * * * cd /path/to/project && node update-social-posts.js
```

---

## Basit JavaScript Çözümü (Client-Side)

Eğer API token'larınızı güvenli bir şekilde saklayabilirseniz, client-side JavaScript ile de yapabilirsiniz:

```javascript
// social-posts-loader.js
(async function() {
  // API endpoint'iniz (backend'de token'ları saklayın)
  const API_ENDPOINT = 'https://your-backend.com/api/social-posts';
  
  try {
    const response = await fetch(API_ENDPOINT);
    const posts = await response.json();
    
    // Instagram gönderisini güncelle
    if (posts.instagram) {
      const instagramCard = document.querySelector('.social-post-card:first-child');
      // Instagram embed'i güncelle
      const blockquote = instagramCard.querySelector('blockquote');
      blockquote.setAttribute('data-instgrm-permalink', posts.instagram.link);
      
      // Instagram embed script'ini yeniden yükle
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }
    
    // Facebook gönderisini güncelle
    if (posts.facebook) {
      const facebookCard = document.querySelector('.social-post-card:nth-child(2)');
      // Facebook post içeriğini güncelle
      const image = facebookCard.querySelector('.static-post-image');
      const text = facebookCard.querySelector('.static-post-text');
      if (image) image.src = posts.facebook.image;
      if (text) text.textContent = posts.facebook.text;
    }
    
    // LinkedIn gönderisini güncelle
    if (posts.linkedin) {
      const linkedinCard = document.querySelector('.social-post-card:last-child');
      // LinkedIn post içeriğini güncelle
      const text = linkedinCard.querySelector('.static-post-text');
      if (text) text.textContent = posts.linkedin.text;
    }
  } catch (error) {
    console.error('Sosyal medya gönderileri yüklenirken hata:', error);
  }
})();
```

---

## Güvenlik Notları

⚠️ **ÖNEMLİ:**
- API token'larınızı **ASLA** client-side kodda saklamayın
- Token'ları backend'de saklayın ve proxy endpoint kullanın
- Rate limiting uygulayın
- Token'ları düzenli olarak yenileyin

---

## Önerilen Yaklaşım

1. **Kısa vadede:** Mevcut embed yöntemini kullanın, yeni gönderiler için sadece HTML'i manuel güncelleyin
2. **Orta vadede:** Backend script oluşturup cron job ile otomatik güncelleme yapın
3. **Uzun vadede:** Full API entegrasyonu ile gerçek zamanlı güncelleme

---

## Yardımcı Kaynaklar

- Instagram API: https://developers.facebook.com/docs/instagram-api
- Facebook Graph API: https://developers.facebook.com/docs/graph-api
- LinkedIn API: https://docs.microsoft.com/en-us/linkedin/
- Instagram Embed: https://developers.facebook.com/docs/instagram/embedding

---

## Sorularınız için

API entegrasyonu konusunda yardıma ihtiyacınız olursa, hangi platformla başlamak istediğinizi belirtin ve size detaylı adımları gösterebilirim.

