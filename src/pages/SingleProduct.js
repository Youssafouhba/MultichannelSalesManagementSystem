import { Badge, Button, Card, CardBody } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import StockTransactionTable from "../components/StockTransactionTable";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon } from "../icons";
import { useAuth } from "../security/Authentification";
import { ProductService } from "../service/ProductService";
import { genRating } from "../utils/genarateRating";

const SingleProduct = () => {
  const { id } = useParams();
  const Auth = useAuth();
  const token = Auth.getToken();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const response = await ProductService.getProductDetails(id, token);
        setProduct(response.data);
        const totalRating = response.data.comments.reduce((sum, item) => sum + item.rating, 0);
        const averageRating = response.data.comments.length > 0 ? totalRating / response.data.comments.length : 0;
        setRating(averageRating);
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, token]);

  const [tabView, setTabView] = useState("reviews");

  const handleTabView = (viewName) => setTabView(viewName);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <PageTitle>Product Details</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <NavLink exact to="/app/all-products" className="mx-2 text-purple-600">
          All Products
        </NavLink>
        {">"}
        <p className="mx-2">{product.name}</p>
      </div>

      {/* Product overview  */}
      <Card className="my-8 shadow-md">
        <CardBody>
          <div className="grid grid-col items-center md:grid-cols-2 lg:grid-cols-2">
            <div>
              <img src={product?.imageUrls[0].url} alt="" className="w-full rounded-lg" />
            </div>

            <div className="mx-8 pt-5 md:pt-0">
              <h1 className="text-3xl mb-4 font-semibold text-gray-700 dark:text-gray-200">
                {product?.name}
              </h1>

              <Badge type={product?.quantityInStock > 0 ? "success" : "danger"} className="mb-2">
                <p className="break-normal">
                  {product?.quantityInStock > 0 ? `In Stock` : "Out of Stock"}
                </p>
              </Badge>

              <p className="mb-2 text-sm text-gray-800 dark:text-gray-300">
                {product?.description}
              </p>

              <p className="text-sm text-gray-900 dark:text-gray-400">Product Rating</p>
              <div>{genRating(rating, product?.comments.length, 6)}</div>

              <h4 className="mt-4 text-purple-600 text-2xl font-semibold">
                {product?.price}
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-400">
                Product Quantity : {product?.quantityInStock}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Product Reviews and Description */}
      <Card className="my-8 shadow-md">
        <CardBody>
          {/* Navigation Area */}
          <div className="flex items-center">
            <Button
              className="mx-5"
              layout="link"
              onClick={() => handleTabView("reviews")}
            >{`Reviews (${product?.comments.length})`}</Button>
            <Button layout="link" onClick={() => handleTabView("description")}>
              Description
            </Button>
            <Button layout="link" onClick={() => handleTabView("Stock Transaction")}>
            Stock Transaction
            </Button>
          </div>

          {/* Divider */}
          <hr className="mx-3 my-2 customeDivider" />

          {/* Component area */}
          <div className="mx-3 mt-4">
            {tabView === "reviews" ? (
              <>
                <p className="text-5xl text-gray-700 dark:text-gray-200">
                  {rating.toFixed(1)}
                </p>
                {genRating(rating, product?.comments.length, 6)}

                <div className="mt-4">
                  {product?.comments.map((review, i) => (
                    <div className="flex py-3" key={i}>
                      <div>
                        <p className="font-medium text-lg text-gray-800 dark:text-gray-300">
                          {review.author}
                        </p>
                        {genRating(review.rating, product?.comments.length, 6)}
                        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                          {review.review}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : tabView === "description" ? (
              <>
                <div className="px-3">
                  <p className="text-sm text-gray-800 dark:text-gray-300">
                    {product.description}
                  </p>
                </div>
              </>
            ) : tabView === "Stock Transaction" ? (


              <>
                  <StockTransactionTable response={product.stockActions}  resultsPerPage={10}/>
                
                
                </>
            ) : (
              <></>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SingleProduct;
