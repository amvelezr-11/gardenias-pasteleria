
export async function GET() {
  return Response.json({
    mensaje: "La API de Gardenias funciona correctamente",
    resendConfigurado: Boolean(process.env.RESEND_API_KEY)
  });
}
