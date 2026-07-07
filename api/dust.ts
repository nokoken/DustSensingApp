export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "GET") {
      return Response.json(
        { message: "Method Not Allowed" },
        { status: 405 }
      );
    }

    const dustValue = Math.floor(Math.random() * 101);

    return Response.json(dustValue);
  },
};