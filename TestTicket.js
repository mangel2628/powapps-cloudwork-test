export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
  
      // Recibir dinámicamente los valores que cambian por botón
      const title = url.searchParams.get("title") || "Ticket de prueba";
      const description = url.searchParams.get("description") || "Revisión de ticket de prueba";
      const category_id = parseInt(url.searchParams.get("category_id")) || null;
  
      if (!category_id) {
        return new Response("Falta el category_id", { status: 400 });
      }
  
      // Valores fijos o controlados desde el Worker
      const payload = {
        title,
        description,
        type_id: 2,
        priority_id: 2,
        category_id,
        creator_id: 2,
        customer_id: 2
      };
  
      const user = env.API_USER;
      const pass = env.API_PASS;
      const basicAuth = btoa(`${user}:${pass}`);
  
      try {
        const response = await fetch("https://alseamx-staging.sd.cloud.invgate.net/api/v1/incident", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${basicAuth}`
          },
          body: JSON.stringify(payload)
        });
  
        const result = await response.text();
        return new Response(`Ticket enviado a InvGate. Respuesta: ${result}`, {
          headers: { "Content-Type": "text/plain" }
        });
  
      } catch (err) {
        return new Response(`Error al enviar: ${err}`, { status: 500 });
      }
    }
  }
