const crypto = require('crypto');
const { SmsLog } = require('../models');

const API_URL = 'https://api.iletimerkezi.com/v1/send-sms/json';

/**
 * İleti Merkezi üzerinden tek numaraya SMS gönderir.
 * SMS_ENABLED=true değilse SMS göndermez, mesajı konsola yazar (geliştirme için).
 * logText: sms_logs tablosuna yazılacak metin (doğrulama kodunu gizlemek için).
 */
const sendSms = async (phone, text, { logText } = {}) => {
  let status = 'sent';
  try {
    if (process.env.SMS_ENABLED !== 'true') {
      status = 'dev';
      console.log(`[SMS-DEV] ${phone} -> ${text}`);
      return { ok: true };
    }

    const key = process.env.ILETIMERKEZI_KEY;
    const secret = process.env.ILETIMERKEZI_SECRET;
    const sender = process.env.ILETIMERKEZI_SENDER;
    if (!key || !secret || !sender) throw new Error('İleti Merkezi ortam değişkenleri eksik');

    const hash = crypto.createHmac('sha256', secret).update(key).digest('hex');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        request: {
          authentication: { key, hash },
          order: {
            sender,
            sendDateTime: [],
            iys: '0', // Doğrulama kodu ticari ileti değildir, İYS kontrolü kapalı
            message: {
              text,
              receipents: { number: [phone] },
            },
          },
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json().catch(() => null);
    const apiStatus = data?.response?.status;
    if (String(apiStatus?.code) !== '200') {
      status = 'failed';
      console.error('[SMS] İleti Merkezi hatası:', apiStatus || response.status);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    status = 'failed';
    console.error('[SMS] Gönderim hatası:', err.message);
    return { ok: false };
  } finally {
    SmsLog.create({ phone, message: logText || text, status }).catch(() => {});
  }
};

module.exports = { sendSms };