// Email service utility for sending verification codes
// This can be integrated with your existing email service (Brevo/Sendinblue)

export interface EmailConfig {
  to: string;
  subject: string;
  html: string;
}

// Function to send verification email with code
export const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  try {
    const emailConfig: EmailConfig = {
      to: email,
      subject: 'KOSC Spitsenspel - Verificeer je account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #059669; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">KOSC Spitsenspel</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9fafb;">
            <h2 style="color: #111827; margin-bottom: 20px;">Welkom bij KOSC Spitsenspel!</h2>
            
            <p style="color: #374151; margin-bottom: 20px;">
              Bedankt voor je registratie. Om je account te activeren, voer je de volgende verificatiecode in:
            </p>
            
            <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="font-size: 32px; margin: 0; letter-spacing: 8px;">${code}</h1>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
              Deze code is 5 minuten geldig. Voer deze in op de verificatiepagina om je account te activeren.
            </p>
            
            <p style="color: #6b7280; font-size: 14px;">
              Als je deze email niet hebt aangevraagd, kun je deze negeren.
            </p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>© 2024 KOSC Spitsenspel. Alle rechten voorbehouden.</p>
          </div>
        </div>
      `
    };

    // TODO: Integrate with your email service (Brevo/Sendinblue)
    // For now, we'll just log the email configuration
    console.log('Email would be sent with config:', emailConfig);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Function to send email with custom content
export const sendEmailWithCode = async (email: string, code: string): Promise<boolean> => {
  return sendVerificationEmail(email, code);
};

// Function to generate a simple verification code (fallback)
export const generateVerificationCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
