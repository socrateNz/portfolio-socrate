// app/api/contact/route.ts
import nodemailer from "nodemailer"

export async function POST(req: Request) {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
        return Response.json({ error: "Champs manquants" }, { status: 400 })
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_TO,
            subject: "Nouveau message via le formulaire de contact",
            text: message,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                    <div style="background-color: #0d9488; color: white; padding: 20px;">
                    <h2 style="margin: 0;">📩 Nouveau message reçu</h2>
                    </div>
                    <div style="padding: 20px; color: #333333;">
                    <p style="font-size: 16px;">Vous avez reçu un message depuis le formulaire de contact :</p>

                    <table style="width: 100%; font-size: 16px; margin-top: 20px;">
                        <tr>
                        <td style="font-weight: bold; padding: 8px 0;">👤 Nom :</td>
                        <td>${name}</td>
                        </tr>
                        <tr>
                        <td style="font-weight: bold; padding: 8px 0;">✉️ Email :</td>
                        <td>${email}</td>
                        </tr>
                        <tr>
                        <td style="font-weight: bold; padding: 8px 0; vertical-align: top;">📝 Message :</td>
                        <td style="white-space: pre-line;">${message}</td>
                        </tr>
                    </table>
                    </div>
                    <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #999;">
                    Ce message a été généré automatiquement depuis votre portfolio.
                    </div>
                </div>
                `
        })

        return Response.json({ success: true })
    } catch (error) {
        console.error("Erreur d'envoi :", error)
        return Response.json({ error: "Erreur d'envoi de l'email" }, { status: 500 })
    }
}
