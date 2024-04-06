import { useState, useEffect, useContext } from "react";
import { fetchProducts } from "../../API/api.js";
import { CartContext } from "../Context/CartContextProvider.jsx";
import { useNavigate } from "react-router-dom";
import { FaEye, FaPlus } from "react-icons/fa";
import Banner from "../Banner/Banner.jsx";
import Categories from "../Categories/Categories.jsx";

export default function Products() {
  // State variables
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const { addToCart } = useContext(CartContext);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  // Effect hook to fetch products
  useEffect(() => {
    fetchProducts()
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Function to truncate the description to 100 characters
  const truncateDescription = (description) => {
    return description.length > 100
      ? description.substring(0, 100) + "..."
      : description;
  };

  // Function to sort products
  const sortProductsByName = (a, b) => {
    const opt1 = String(a[sort]).toLowerCase();
    const opt2 = String(b[sort]).toLowerCase();
    if (opt1 < opt2) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (opt1 > opt2) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  };

  // Handle sorting change
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  // Handle order change
  const handleOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    addToCart(product);
    const message = `${product.name} has been added to the cart!`;
    setNotification(message);
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <>
      {notification && (
        <p className="bg-green-500 text-white px-4 py-2 fixed top-0 right-0 m-4 z-50">
          {notification}
        </p>
      )}
      <Banner />
      <Categories />
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold my-8">Products</h2>
        <div className="flex items-center mb-4">
          <label htmlFor="sort" className="mr-2">
            Sort by:
          </label>
          <select
            value={sort}
            onChange={handleSortChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="title">Title</option>
          </select>
          <button
            onClick={handleOrderChange}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sort {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.sort(sortProductsByName).map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-lg hover:shadow-lg transition duration-300"
            >
              <img
                className="w-full h-auto mb-2 object-contain rounded-lg max-h-48"
                src={product.imageurl}
                alt={product.name}
              />
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="mb-2">
                  {truncateDescription(product.description)}
                </p>
                <div className="mb-2">$ {product.price}</div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                  >
                    <FaPlus className="mr-1" /> Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    <FaEye className="mr-1" /> View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
