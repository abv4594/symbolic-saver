// symbolic-saver/src/app/api/preview/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return Response.json({ error: "Missing URL" }, { status: 400 });
  }

  try {
   const res = await fetch(`https://jsonlink.io/api/extract?url=${encodeURIComponent(url)}`, {
    headers: {
        "Accept": "application/json",
  },
});

    const data = await res.json();

    return Response.json({
      title: data.title || "",
      image: (data.images && data.images[0]) || "",
    });
  } catch (e) {
    return Response.json({ error: "Failed to fetch preview" }, { status: 500 });
  }
}
