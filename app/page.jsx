import Carousel from "@/components/carousel/Carousel";
import Homeproperties from "@/components/homeproperties/Homeproperties";

export const metadata = {
  title: "Dino",
  description:
    "Discover amazing products at Dino. Shop the latest trends in electronics, fashion, and lifestyle products with fast shipping and excellent customer service.",
  keywords:
    "Dino, shopping, e-commerce, electronics, fashion, lifestyle, online store",
  openGraph: {
    title: "Dino",
    description:
      "Discover amazing products at Dino. Shop the latest trends in electronics, fashion, and lifestyle products.",
    type: "website",
    locale: "en_US",
  },
};

const page = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Carousel */}
      <section className="relative">
        <Carousel />
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products designed to
            enhance your lifestyle
          </p>
        </div>
        <Homeproperties />
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Explore More?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our complete collection of products and find exactly what
            you're looking for
          </p>
          <a
            href="/products"
            className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            View All Products
          </a>
        </div>
      </section>
    </div>
  );
};

export default page;
