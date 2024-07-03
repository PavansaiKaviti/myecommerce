import Oder from "@/models/odermodel/Odermodel";

export const GET = async (request) => {
  try {
    const oders = await Oder.find().populate("items");
    const sortedOders = oders.sort((a, b) => b.createdAt - a.createdAt);

    return new Response(JSON.stringify(sortedOders[0]), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
};
