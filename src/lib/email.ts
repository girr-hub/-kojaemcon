import { Resend } from 'resend'

export async function sendAdminNotification({
  subject,
  html,
}: {
  subject: string
  html: string
}) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!)
    await resend.emails.send({
      from: 'KOGEMCON <onboarding@resend.dev>',
      to: 'girr.official@gmail.com',
      subject,
      html,
    })
  } catch (err) {
    console.error('Email error:', err)
  }
}
