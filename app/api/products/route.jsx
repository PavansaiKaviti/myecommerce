import connectdb from "@/config/mongoose/Mongoosedb";
import Product from "@/models/products/Productmodel";

// export const GET = async (request) => {
//   try {
//     await connectdb();
//     const url = new URL(request.url);
//     const pagesize = 6;
//     const pages = Math.ceil((await Product.countDocuments()) / pagesize);
//     const page =
//       url.searchParams.get("page") > pages ? 1 : url.searchParams.get("page");
//     const skip = (page - 1) * pagesize;

//     const products = await Product.find({}).limit(pagesize).skip(skip);

//     if (!products) {
//       return new Response(JSON.stringify({ message: "no products found" }), {
//         status: 204,
//       }); // 204 stands for no content status was successfull
//     }
//     return new Response(JSON.stringify({ products, pages }), { status: 200 });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};

export const GET = async (request) => {
  try {
    await connectdb();
    const url = new URL(request.url);
    const pagesize = 6;

    // Get search parameter
    const searchQuery = url.searchParams.get("search") || "";

    // Build search filter
    let searchFilter = {};
    if (searchQuery.trim()) {
      searchFilter = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { brand: { $regex: searchQuery, $options: "i" } },
          { category: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    const totalProducts = await Product.countDocuments(searchFilter);
    const pages = Math.ceil(totalProducts / pagesize);

    let page = parseInt(url.searchParams.get("page")) || 1;
    if (page > pages) page = 1;
    if (page < 1) page = 1;

    const skip = (page - 1) * pagesize;

    const products = await Product.find(searchFilter)
      .limit(pagesize)
      .skip(skip);

    if (products.length === 0) {
      return new Response(JSON.stringify({ message: "no products found" }), {
        status: 204,
      });
    }

    return new Response(JSON.stringify({ products, pages, searchQuery }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
};

// export const GET = async (request) => {
//   try {
//     // Connect to the database
//     await connectdb();

//     // Get query parameters from request
//     const { searchParams } = new URL(request.url);
//     const pagesize = 6;
//     const totalProducts = await Product.countDocuments();
//     const pages = Math.ceil(totalProducts / pagesize);

//     // Get the page query parameter and ensure it's valid
//     let page = parseInt(searchParams.get("page")) || 1;
//     if (page > pages) page = 1;
//     if (page < 1) page = 1;

//     const skip = (page - 1) * pagesize;

//     // Retrieve products from the database
//     const products = await Product.find({}).limit(pagesize).skip(skip);

//     if (!products.length) {
//       return new Response(JSON.stringify({ message: "No products found" }), {
//         status: 204,
//       });
//     }

//     // Return the list of products along with pagination info
//     return new Response(JSON.stringify({ products, pages }), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// };
