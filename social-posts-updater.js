/**
 * Sosyal Medya Gönderilerini Otomatik Güncelleme Script'i
 * 
 * Kullanım:
 * 1. API token'larınızı aşağıdaki değişkenlere ekleyin
 * 2. Bu dosyayı backend'inizde çalıştırın (Node.js gerekli)
 * 3. Cron job ile periyodik olarak çalıştırın
 * 
 * VEYA
 * 
 * Backend endpoint oluşturup bu fonksiyonları kullanın
 */

// ============================================
// YAPILANDIRMA - Token'larınızı buraya ekleyin
// ============================================
const CONFIG = {
  instagram: {
    accessToken: 'YOUR_INSTAGRAM_ACCESS_TOKEN',
    userId: 'YOUR_INSTAGRAM_USER_ID'
  },
  facebook: {
    pageId: 'YOUR_FACEBOOK_PAGE_ID',
    accessToken: 'YOUR_FACEBOOK_PAGE_ACCESS_TOKEN'
  },
  linkedin: {
    companyId: 'YOUR_LINKEDIN_COMPANY_ID',
    accessToken: 'YOUR_LINKEDIN_ACCESS_TOKEN'
  }
};

// ============================================
// INSTAGRAM API
// ============================================
async function fetchInstagramPost() {
  try {
    const url = `https://graph.instagram.com/${CONFIG.instagram.userId}/media?` +
      `fields=id,caption,media_type,media_url,permalink,timestamp&` +
      `access_token=${CONFIG.instagram.accessToken}&` +
      `limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const post = data.data[0];
      return {
        image: post.media_url,
        caption: post.caption || '',
        link: post.permalink,
        timestamp: post.timestamp,
        type: post.media_type
      };
    }
    return null;
  } catch (error) {
    console.error('Instagram API hatası:', error);
    return null;
  }
}

// ============================================
// FACEBOOK API
// ============================================
async function fetchFacebookPost() {
  try {
    const url = `https://graph.facebook.com/v18.0/${CONFIG.facebook.pageId}/posts?` +
      `fields=id,message,created_time,full_picture,permalink_url,attachments&` +
      `access_token=${CONFIG.facebook.accessToken}&` +
      `limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const post = data.data[0];
      
      // Resim varsa al, yoksa attachments'tan dene
      let image = post.full_picture || '';
      if (!image && post.attachments && post.attachments.data) {
        const attachment = post.attachments.data[0];
        if (attachment.media && attachment.media.image) {
          image = attachment.media.image.src;
        }
      }
      
      return {
        image: image,
        text: post.message || '',
        link: post.permalink_url,
        date: post.created_time,
        id: post.id
      };
    }
    return null;
  } catch (error) {
    console.error('Facebook API hatası:', error);
    return null;
  }
}

// ============================================
// LINKEDIN API
// ============================================
async function fetchLinkedInPost() {
  try {
    const url = `https://api.linkedin.com/v2/shares?` +
      `q=owners&owners=${CONFIG.linkedin.companyId}&count=1`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CONFIG.linkedin.accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    const data = await response.json();
    
    if (data.elements && data.elements.length > 0) {
      const post = data.elements[0];
      const shareContent = post.content || {};
      const text = shareContent.text?.text || '';
      
      return {
        text: text,
        link: `https://www.linkedin.com/feed/update/${post.id}`,
        timestamp: post.created?.time || Date.now(),
        id: post.id
      };
    }
    return null;
  } catch (error) {
    console.error('LinkedIn API hatası:', error);
    return null;
  }
}

// ============================================
// HTML GÜNCELLEME FONKSİYONU
// ============================================
function updateHTMLFile(instagramPost, facebookPost, linkedInPost) {
  const fs = require('fs');
  const path = require('path');
  
  const htmlPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Instagram gönderisini güncelle
  if (instagramPost) {
    // Instagram embed blockquote'u güncelle
    const instagramRegex = /data-instgrm-permalink="[^"]*"/;
    if (instagramRegex.test(html)) {
      html = html.replace(
        instagramRegex,
        `data-instgrm-permalink="${instagramPost.link}"`
      );
      
      // "Instagram'da Görüntüle" linkini güncelle
      const instagramLinkRegex = /href="https:\/\/www\.instagram\.com\/p\/[^"]*"/;
      if (instagramLinkRegex.test(html)) {
        html = html.replace(
          instagramLinkRegex,
          `href="${instagramPost.link}"`
        );
      }
    }
  }
  
  // Facebook gönderisini güncelle
  if (facebookPost) {
    // Facebook post görselini güncelle
    const facebookImageRegex = /<img src="\.\/proj2\.jpeg" alt="Facebook Gönderisi"/;
    if (facebookImageRegex.test(html) && facebookPost.image) {
      html = html.replace(
        facebookImageRegex,
        `<img src="${facebookPost.image}" alt="Facebook Gönderisi"`
      );
    }
    
    // Facebook post metnini güncelle
    const facebookTextRegex = /<div class="static-post-text">[\s\S]*?<\/div>/;
    if (facebookTextRegex.test(html)) {
      const newText = `<div class="static-post-text">${facebookPost.text.replace(/\n/g, '<br>')}</div>`;
      // İlk eşleşmeyi bul ve değiştir (Facebook post'u)
      const matches = html.match(facebookTextRegex);
      if (matches && matches[0].includes('Koytaş Yapı olarak')) {
        html = html.replace(matches[0], newText);
      }
    }
    
    // Facebook linkini güncelle
    const facebookLinkRegex = /href="https:\/\/www\.facebook\.com\/[^"]*"/;
    if (facebookLinkRegex.test(html)) {
      html = html.replace(
        facebookLinkRegex,
        `href="${facebookPost.link}"`
      );
    }
    
    // Tarihi güncelle
    const facebookDateRegex = /<div class="static-post-date">[^<]*<\/div>/;
    if (facebookDateRegex.test(html)) {
      const dateStr = formatDate(facebookPost.date);
      html = html.replace(
        /<div class="static-post-date">[^<]*<\/div>/,
        `<div class="static-post-date">${dateStr}</div>`
      );
    }
  }
  
  // LinkedIn gönderisini güncelle
  if (linkedInPost) {
    // LinkedIn post görselini güncelle (eğer varsa)
    // LinkedIn post metnini güncelle
    const linkedinTextRegex = /<div class="static-post-text">[\s\S]*?<\/div>/;
    if (linkedinTextRegex.test(html)) {
      const matches = html.match(linkedinTextRegex);
      // LinkedIn post'unu bul (içinde "#İnşaatMühendisliği" geçen)
      for (let match of matches) {
        if (match.includes('#İnşaatMühendisliği') || match.includes('LinkedIn')) {
          const newText = `<div class="static-post-text">${linkedInPost.text.replace(/\n/g, '<br>')}</div>`;
          html = html.replace(match, newText);
          break;
        }
      }
    }
    
    // LinkedIn linkini güncelle
    const linkedinLinkRegex = /href="https:\/\/www\.linkedin\.com\/company\/[^"]*"/;
    if (linkedinLinkRegex.test(html)) {
      html = html.replace(
        linkedinLinkRegex,
        `href="${linkedInPost.link}"`
      );
    }
    
    // Tarihi güncelle
    const linkedinDateRegex = /<div class="static-post-date">1 hafta önce<\/div>/;
    if (linkedinDateRegex.test(html)) {
      const dateStr = formatDate(new Date(linkedInPost.timestamp));
      html = html.replace(
        linkedinDateRegex,
        `<div class="static-post-date">${dateStr}</div>`
      );
    }
  }
  
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('✅ HTML dosyası güncellendi!');
}

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) {
    return `${diffMins} dakika önce`;
  } else if (diffHours < 24) {
    return `${diffHours} saat önce`;
  } else if (diffDays < 7) {
    return `${diffDays} gün önce`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} hafta önce`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ay önce`;
  }
}

// ============================================
// ANA FONKSİYON
// ============================================
async function updateSocialPosts() {
  console.log('🔄 Sosyal medya gönderileri güncelleniyor...');
  
  const [instagramPost, facebookPost, linkedInPost] = await Promise.all([
    fetchInstagramPost(),
    fetchFacebookPost(),
    fetchLinkedInPost()
  ]);
  
  console.log('📱 Instagram:', instagramPost ? '✅' : '❌');
  console.log('📘 Facebook:', facebookPost ? '✅' : '❌');
  console.log('💼 LinkedIn:', linkedInPost ? '✅' : '❌');
  
  // HTML'i güncelle (Node.js ortamında)
  if (typeof require !== 'undefined') {
    updateHTMLFile(instagramPost, facebookPost, linkedInPost);
  } else {
    // Browser ortamında, sadece veriyi döndür
    return { instagramPost, facebookPost, linkedInPost };
  }
}

// ============================================
// ÇALIŞTIRMA
// ============================================
// Node.js ortamında çalıştırılıyorsa
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    updateSocialPosts,
    fetchInstagramPost,
    fetchFacebookPost,
    fetchLinkedInPost
  };
  
  // Doğrudan çalıştırılıyorsa
  if (require.main === module) {
    updateSocialPosts()
      .then(() => {
        console.log('✨ Güncelleme tamamlandı!');
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Hata:', error);
        process.exit(1);
      });
  }
}

// Browser ortamında kullanım için
if (typeof window !== 'undefined') {
  window.updateSocialPosts = updateSocialPosts;
}

