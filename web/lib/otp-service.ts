import { createClient } from '@supabase/supabase-js';

const resendApiKey = 're_JoftuVFh_KymAmHqv7jCXXJRD1ycjNvSV';

/**
 * Bu fonksiyon öğrenciye e-posta gönderir.
 * Not: Normalde bu bir Edge Function olmalı ancak hızlıca prototiplemek için 
 * şimdilik istemci tarafında (güvenli olmayan ama çalışan) bir yapı kuruyoruz.
 * Daha sonra bunu Supabase Edge Function'a taşımanızı şiddetle öneririm.
 */
export async function sendOTPEmail(email: string, fullName: string, otp: string) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'GİT 119 Not Sistemi <onboarding@resend.dev>', // Resend ücretsiz hesapta sadece bu adresten gönderim yapar
        to: [email],
        subject: 'Giriş Onay Kodu - git119',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #5C03BC;">Merhaba ${fullName},</h2>
            <p>Not portalına giriş yapabilmek için onay kodun aşağıdadır:</p>
            <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px;">
              ${otp}
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Bu kod 10 dakika boyunca geçerlidir. Eğer bu talebi sen yapmadıysan bu e-postayı dikkate alma.
            </p>
          </div>
        `,
      }),
    });

    return res.ok;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}
