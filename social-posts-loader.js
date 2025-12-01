/**
 * Sosyal Medya Gönderilerini Otomatik Yükleme (Client-Side)
 * 
 * Bu dosyayı index.html'in sonuna ekleyin:
 * <script src="./social-posts-loader.js"></script>
 * 
 * Backend API endpoint'inizi aşağıdaki API_ENDPOINT değişkenine ekleyin
 */

(function() {
  'use strict';
  
  // ============================================
  // YAPILANDIRMA
  // ============================================
  const CONFIG = {
    // Backend API endpoint'iniz (örnek: 'https://api.yoursite.com/api/social-posts')
    API_ENDPOINT: 'http://localhost:3000/api/social-posts',
    
    // Otomatik yenileme süresi (milisaniye) - 1 saat = 3600000
    AUTO_REFRESH_INTERVAL: 3600000,
    
    // Sayfa yüklendiğinde otomatik yükle
    AUTO_LOAD_ON_PAGE_LOAD: true
  };
  
  // ============================================
  // INSTAGRAM GÖNDERİSİNİ GÜNCELLE
  // ============================================
  function updateInstagramPost(post) {
    if (!post) return;
    
    const instagramCard = document.querySelector('.social-post-card:first-child');
    if (!instagramCard) return;
    
    // Instagram embed blockquote'u güncelle
    const blockquote = instagramCard.querySelector('blockquote.instagram-media');
    if (blockquote && post.link) {
      blockquote.setAttribute('data-instgrm-permalink', post.link);
      
      // Instagram embed script'ini yeniden yükle
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      } else {
        // Script henüz yüklenmemişse yükle
        loadInstagramEmbedScript();
      }
    }
    
    // "Instagram'da Görüntüle" linkini güncelle
    const instagramLink = instagramCard.querySelector('a[href*="instagram.com/p/"]');
    if (instagramLink && post.link) {
      instagramLink.href = post.link;
    }
  }
  
  // ============================================
  // FACEBOOK GÖNDERİSİNİ GÜNCELLE
  // ============================================
  function updateFacebookPost(post) {
    if (!post) return;
    
    const facebookCard = document.querySelector('.social-post-card:nth-child(2)');
    if (!facebookCard) return;
    
    // Görseli güncelle
    const image = facebookCard.querySelector('.static-post-image');
    if (image && post.image) {
      image.src = post.image;
      image.alt = 'Facebook Gönderisi';
    }
    
    // Metni güncelle
    const textContainer = facebookCard.querySelector('.static-post-body .static-post-text');
    if (textContainer && post.text) {
      // Metni HTML'e dönüştür (satır sonlarını <br> ile değiştir)
      const formattedText = post.text
        .replace(/\n/g, '<br>')
        .replace(/\r/g, '');
      textContainer.innerHTML = formattedText;
    }
    
    // Tarihi güncelle
    const dateContainer = facebookCard.querySelector('.static-post-date');
    if (dateContainer && post.date) {
      dateContainer.textContent = formatRelativeDate(post.date);
    }
    
    // Linki güncelle
    const facebookLink = facebookCard.querySelector('a[href*="facebook.com"]');
    if (facebookLink && post.link) {
      facebookLink.href = post.link;
    }
  }
  
  // ============================================
  // LINKEDIN GÖNDERİSİNİ GÜNCELLE
  // ============================================
  function updateLinkedInPost(post) {
    if (!post) return;
    
    const linkedinCard = document.querySelector('.social-post-card:last-child');
    if (!linkedinCard) return;
    
    // Metni güncelle
    const textContainer = linkedinCard.querySelector('.static-post-body .static-post-text');
    if (textContainer && post.text) {
      // Metni HTML'e dönüştür
      const formattedText = post.text
        .replace(/\n/g, '<br>')
        .replace(/\r/g, '');
      textContainer.innerHTML = formattedText;
    }
    
    // Görseli güncelle (eğer varsa)
    const image = linkedinCard.querySelector('.static-post-image');
    if (image && post.image) {
      image.src = post.image;
      image.alt = 'LinkedIn Gönderisi';
    }
    
    // Tarihi güncelle
    const dateContainer = linkedinCard.querySelector('.static-post-date');
    if (dateContainer && post.timestamp) {
      dateContainer.textContent = formatRelativeDate(new Date(post.timestamp));
    }
    
    // Linki güncelle
    const linkedinLink = linkedinCard.querySelector('a[href*="linkedin.com"]');
    if (linkedinLink && post.link) {
      linkedinLink.href = post.link;
    }
  }
  
  // ============================================
  // YARDIMCI FONKSİYONLAR
  // ============================================
  
  // Göreceli tarih formatla (örn: "2 saat önce")
  function formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
      return 'Az önce';
    } else if (diffMins < 60) {
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
  
  // Instagram embed script'ini yükle
  function loadInstagramEmbedScript() {
    if (document.querySelector('script[src*="instagram.com/embed.js"]')) {
      return; // Zaten yüklenmiş
    }
    
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = function() {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };
    document.body.appendChild(script);
  }
  
  // Loading state göster
  function showLoading() {
    const cards = document.querySelectorAll('.social-post-card');
    cards.forEach(card => {
      const content = card.querySelector('.social-post-content');
      if (content) {
        content.style.opacity = '0.5';
      }
    });
  }
  
  // Loading state'i kaldır
  function hideLoading() {
    const cards = document.querySelectorAll('.social-post-card');
    cards.forEach(card => {
      const content = card.querySelector('.social-post-content');
      if (content) {
        content.style.opacity = '1';
      }
    });
  }
  
  // ============================================
  // ANA FONKSİYON - API'DEN VERİ ÇEK
  // ============================================
  async function loadSocialPosts() {
    if (!CONFIG.API_ENDPOINT) {
      console.warn('⚠️ API endpoint tanımlanmamış. Lütfen CONFIG.API_ENDPOINT değerini ayarlayın.');
      return;
    }
    
    showLoading();
    
    try {
      const response = await fetch(CONFIG.API_ENDPOINT);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Gönderileri güncelle
        if (result.data.instagram) {
          updateInstagramPost(result.data.instagram);
        }
        
        if (result.data.facebook) {
          updateFacebookPost(result.data.facebook);
        }
        
        if (result.data.linkedin) {
          updateLinkedInPost(result.data.linkedin);
        }
        
        console.log('✅ Sosyal medya gönderileri güncellendi');
      } else {
        throw new Error(result.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      console.error('❌ Sosyal medya gönderileri yüklenirken hata:', error);
      // Hata durumunda mevcut içeriği koru
    } finally {
      hideLoading();
    }
  }
  
  // ============================================
  // SAYFA YÜKLENDİĞİNDE ÇALIŞTIR
  // ============================================
  if (CONFIG.AUTO_LOAD_ON_PAGE_LOAD) {
    // DOM yüklendiğinde çalıştır
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadSocialPosts);
    } else {
      // DOM zaten yüklenmişse hemen çalıştır
      loadSocialPosts();
    }
  }
  
  // ============================================
  // OTOMATIK YENİLEME
  // ============================================
  if (CONFIG.AUTO_REFRESH_INTERVAL > 0) {
    setInterval(loadSocialPosts, CONFIG.AUTO_REFRESH_INTERVAL);
  }
  
  // ============================================
  // GLOBAL ERİŞİM (Manuel çağrı için)
  // ============================================
  window.loadSocialPosts = loadSocialPosts;
  
})();

