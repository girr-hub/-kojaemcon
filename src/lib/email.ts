import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendAdminNotification({
  subject,
  html,
}: {
  subject: string
  html: string
}) {
  try {
    await resend.emails.send({
      from: 'KOGEMCON <noreply@kogemcon.com>',
      to: 'girr.official@gmail.com',
      subject,
      html,
    })
  } catch (err) {
    console.error('Email error:', err)
  }
}
