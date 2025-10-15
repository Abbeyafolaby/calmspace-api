import sgMail from '@sendgrid/mail';

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Verify configuration on startup
if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY is not set');
} else if (!process.env.EMAIL_FROM) {
    console.error('❌ EMAIL_FROM is not set');
} else {
    console.log('✅ SendGrid is configured and ready');
}

export const sendEmail = async (to, subject, html) => {
    try {
        const msg = {
            to,
            from: {
                email: process.env.EMAIL_FROM,
                name: 'CalmSpace'
            },
            subject,
            html,
        };

        await sgMail.send(msg);
        console.log(`✅ Email sent successfully to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
        
        // Log more details for debugging
        if (error.response) {
            console.error('SendGrid Error Details:', {
                statusCode: error.response.statusCode,
                body: error.response.body
            });
        }
        
        throw new Error("Email not sent");
    }
};

export const resendEmail = async (to, subject, html) => {
    try {
        const msg = {
            to,
            from: {
                email: process.env.EMAIL_FROM,
                name: 'CalmSpace'
            },
            subject,
            html,
        };

        await sgMail.send(msg);
        console.log(`✅ Email resent successfully to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
        
        if (error.response) {
            console.error('SendGrid Error Details:', {
                statusCode: error.response.statusCode,
                body: error.response.body
            });
        }
        
        throw new Error("Email not sent");
    }
};