export function buildContactEmail(name: string, email: string, subject: string, message: string): string {
  const year = new Date().getFullYear()

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Novo Contato · Anti-Tédio</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding:40px 32px;text-align:center;border-bottom:1px solid #f1f1f4;">
              <p style="margin:0;color:#000000;font-size:24px;font-weight:900;letter-spacing:-0.5px;">Anti-Tédio</p>
              <p style="margin:4px 0 0;color:#71717a;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Mensagem de Suporte</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;color:#71717a;font-size:13px;width:100px;"><strong>De:</strong></td>
                  <td style="padding:8px 0;font-size:14px;color:#18181b;">${name} (${email})</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#71717a;font-size:13px;"><strong>Assunto:</strong></td>
                  <td style="padding:8px 0;font-size:14px;color:#18181b;font-weight:600;">${subject}</td>
                </tr>
              </table>
              
              <div style="background-color:#f8fafc;border-radius:12px;padding:20px;border:1px solid #e2e8f0;">
                <p style="margin:0;color:#334155;font-size:15px;line-height:1.6;white-space:pre-wrap;">${message}</p>
              </div>

              <p style="margin:24px 0 0;color:#a1a1aa;font-size:12px;text-align:center;">
                Para responder ao usuário, basta responder a este e-mail diretamente.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;background-color:#fafafa;text-align:center;">
              <p style="margin:0;color:#c4c4c4;font-size:11px;">© ${year} Anti Tédio · Sistema de Suporte</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
}