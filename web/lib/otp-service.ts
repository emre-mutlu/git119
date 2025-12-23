/**
 * Bu fonksiyon Google Apps Script üzerinden Gmail köprüsünü kullanarak e-posta gönderir.
 * Statik sitelerde domain doğrulaması gerektirmeden mail göndermenin en güvenli yoludur.
 */
export async function sendOTPEmail(email: string, fullName: string, otp: string) {
  const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbzSQ7UjD2E9kuMnIqngMEUcViRD8MA644FmImUTnHefhscOoCFik4Y9wqqJA6KeCRYa/exec';

  try {
    // Google Apps Script CORS kısıtlamaları nedeniyle 'no-cors' veya form tabanlı gönderim gerektirebilir.
    // Ancak JSON tabanlı fetch çoğu zaman modern tarayıcılarda GAS ile uyumlu çalışır.
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Script Web App için no-cors gerekebilir
      headers: {
        'Content-Type': 'text/plain', // no-cors modunda text/plain hata almaz
      },
      body: JSON.stringify({
        email: email,
        fullName: fullName,
        otp: otp
      })
    });

    // no-cors modunda response.ok her zaman false döner ve body okunamaz, 
    // ancak istek Google tarafına ulaşır.
    return true; 
  } catch (error) {
    console.error('Gmail Bridge Error:', error);
    return false;
  }
}