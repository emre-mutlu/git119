/**
 * Bu fonksiyon Google Apps Script üzerinden Gmail köprüsünü kullanarak e-posta gönderir.
 */
export async function sendOTPEmail(email: string, fullName: string, otp: string) {
  const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbx9fk49_h330Qqc7xIEsT6lgEm0ajF7M_WiNgRDT2u9o3FamJ7vyNt5-nD5P9r5cNi1/exec';

  try {
    // Google Script'e veri gönderimi
    // Not: no-cors modunda body gider ancak sonucun ulaşıp ulaşmadığı anlaşılamaz.
    await fetch(googleScriptUrl, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        email: email,
        fullName: fullName,
        otp: otp
      })
    });

    return true; 
  } catch (error) {
    console.error('Gmail Bridge Error:', error);
    return false;
  }
}