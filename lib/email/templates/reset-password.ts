export function createResetPasswordEmail(resetUrl: string) {
  return {
    subject: "Recuperação de Senha",
    text: `
      Você solicitou a recuperação de senha.
      Clique no link abaixo para criar uma nova senha:
      ${resetUrl}
      Se você não solicitou a recuperação de senha, ignore este email.
    `,
    html: `
      <div>
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
      </div>
    `,
  }
}