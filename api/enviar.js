
export async function POST(request) {
  try {
    const datos = await request.formData();

    const nombre = datos.get("nombre");
    const email = datos.get("email");
    const asunto = datos.get("asunto");
    const mensaje = datos.get("mensaje");
    const archivo = datos.get("archivo");

if (!nombre || !email || !asunto || !mensaje) {      return Response.json(
        { error: "Completa todos los campos obligatorios." },
        { status: 400 }
      );
    }

    const adjuntos = [];

    if (archivo && archivo.size > 0) {
      const tiposPermitidos = [
        "application/pdf",
        "image/jpeg",
        "image/png"
      ];

      if (!tiposPermitidos.includes(archivo.type)) {
        return Response.json(
          { error: "Solo se permiten PDF, JPG y PNG." },
          { status: 400 }
        );
      }

      if (archivo.size > 3 * 1024 * 1024) {
        return Response.json(
          { error: "El archivo no puede superar los 3 MB." },
          { status: 400 }
        );
      }

      const contenido = Buffer.from(
        await archivo.arrayBuffer()
      ).toString("base64");

      adjuntos.push({
        filename: archivo.name,
        content: contenido
      });
    }

    const respuesta = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Gardenias <onboarding@resend.dev>",
          to: ["amvelezr@ut.edu.co"],
subject: `Gardenias - ${asunto}`,          text:
            `Nombre: ${nombre}\n` +
            `Correo: ${email}\n\n` +
            `Asunto: ${asunto}\n\n` +
            `Mensaje:\n${mensaje}`,
          attachments: adjuntos
        })
      }
    );

    if (!respuesta.ok) {
      console.error("Error de Resend:", respuesta.status);
      return Response.json(
        { error: "No se pudo enviar el correo." },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      mensaje: "Formulario enviado correctamente."
    });

  } catch (error) {
    console.error("Error al procesar formulario:", error);

    return Response.json(
      { error: "Ocurrió un error al enviar el formulario." },
      { status: 500 }
    );
  }
}
