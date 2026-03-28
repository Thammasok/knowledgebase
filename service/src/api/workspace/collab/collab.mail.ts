import { sendMail } from '../../../libs/mail'
import mailConfig from '../../../config/mail'

interface InvitationEmailParams {
  to: string
  inviterName: string
  workspaceName: string
  inviteUrl: string
  role: string
  expiresAt: Date
}

export const sendInvitationEmail = async (params: InvitationEmailParams) => {
  const roleLabel = params.role === 'viewer' ? 'Viewer' : 'Member'
  const expiryStr = params.expiresAt.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return sendMail({
    to: [{ email: params.to }],
    from: {
      email: mailConfig.MAIL.MAIL_DEFAULT_FROM_EMAIL,
      name: mailConfig.MAIL.MAIL_DEFAULT_FROM_NANE,
    },
    subject: `${params.inviterName} invited you to join ${params.workspaceName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="margin: 0 0 8px; font-size: 20px;">You're invited to collaborate</h2>
        <p style="color: #555; margin: 0 0 24px;">
          <strong>${params.inviterName}</strong> has invited you to join
          <strong>${params.workspaceName}</strong> as a <strong>${roleLabel}</strong>.
        </p>
        <a href="${params.inviteUrl}"
           style="display: inline-block; background: #18181b; color: #fff;
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;
                  font-weight: 600; font-size: 14px;">
          Accept invitation
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          This invitation expires on ${expiryStr}.
          If you weren't expecting this, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}
