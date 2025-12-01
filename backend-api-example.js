/**
 * Backend API Örneği - Express.js ile
 * 
 * Bu dosya, sosyal medya gönderilerini güvenli bir şekilde
 * client-side'dan çekmek için backend endpoint'i sağlar.
 * 
 * Kurulum:
 * npm install express cors dotenv
 * 
 * Çalıştırma:
 * node backend-api-example.js
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS ayarları (sadece kendi domain'inizden isteklere izin verin)
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:8080',
  credentials: true
}));

app.use(express.json());

// ============================================
// API ENDPOINT'LERİ
// ============================================

// Tüm sosyal medya gönderilerini getir
app.get('/api/social-posts', async (req, res) => {
  try {
    const { fetchInstagramPost, fetchFacebookPost, fetchLinkedInPost } = require('./social-posts-updater');
    
    const [instagramPost, facebookPost, linkedInPost] = await Promise.all([
      fetchInstagramPost(),
      fetchFacebookPost(),
      fetchLinkedInPost()
    ]);
    
    res.json({
      success: true,
      data: {
        instagram: instagramPost,
        facebook: facebookPost,
        linkedin: linkedInPost
      }
    });
  } catch (error) {
    console.error('API hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Sosyal medya gönderileri yüklenirken hata oluştu'
    });
  }
});

// Sadece Instagram gönderisini getir
app.get('/api/social-posts/instagram', async (req, res) => {
  try {
    const { fetchInstagramPost } = require('./social-posts-updater');
    const post = await fetchInstagramPost();
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Instagram API hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Instagram gönderisi yüklenirken hata oluştu'
    });
  }
});

// Sadece Facebook gönderisini getir
app.get('/api/social-posts/facebook', async (req, res) => {
  try {
    const { fetchFacebookPost } = require('./social-posts-updater');
    const post = await fetchFacebookPost();
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Facebook API hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Facebook gönderisi yüklenirken hata oluştu'
    });
  }
});

// Sadece LinkedIn gönderisini getir
app.get('/api/social-posts/linkedin', async (req, res) => {
  try {
    const { fetchLinkedInPost } = require('./social-posts-updater');
    const post = await fetchLinkedInPost();
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('LinkedIn API hatası:', error);
    res.status(500).json({
      success: false,
      error: 'LinkedIn gönderisi yüklenirken hata oluştu'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// SUNUCUYU BAŞLAT
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Backend API sunucusu ${PORT} portunda çalışıyor`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/social-posts`);
});

