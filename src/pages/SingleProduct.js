import { Badge, Button, Card, CardBody } from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import StockTransactionTable from "../components/StockTransactionTable";
import PageTitle from "../components/Typography/PageTitle";
import { AppDataContext } from "../context/AppDataContext";
import { HomeIcon } from "../icons";
import { ProductService } from "../service/ProductService";
import { useAuth } from "../security/Authentification";
import StarRating from "../components/StarRating";

const SingleProduct = () => {
  const { id } = useParams();
  const Auth = useAuth();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const { products, stockActions, error } = useContext(AppDataContext);
  const [product, setProduct] = useState(null);
  const [stockAction, setStockAction] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tabView, setTabView] = useState("reviews");

  useEffect(() => {
    if (products !== undefined) {
      if (products.length === 0) return;

      ProductService.getProductComments(id).then(comments => {
        setReviews(comments); // Store the actual comments
      });

      const selectedProduct = products.find((p) => p.id == id);
      setProduct(selectedProduct);
      setStockAction(stockActions.filter((sa) => sa.product.id == id));
      setLoading(false);
    }
  }, [id, products]);

  const handleTabView = (viewName) => setTabView(viewName);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
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

              <h4 className="mt-4 text-purple-600 text-2xl font-semibold">
                £{product?.price}
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-400">
                Product Quantity: {product?.quantityInStock}
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
            >{`Reviews (${reviews.length})`}</Button>
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
              <div>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="mb-4">
                      <div className="flex items-center">
                        <StarRating rating={review.rating} />
                        <p className="ml-2 text-sm text-gray-600 dark:text-gray-300">{review.author}</p>
                      </div>
                      <p className="text-gray-800 dark:text-gray-300">{review.content}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{new Date(review.createdDate).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-800 dark:text-gray-300">No reviews yet.</p>
                )}
              </div>
            ) : tabView === "description" ? (
              <div className="px-3">
                <p className="text-sm text-gray-800 dark:text-gray-300">
                  {product.description}
                </p>
              </div>
            ) : tabView === "Stock Transaction" ? (
              <StockTransactionTable response={stockAction} resultsPerPage={10} />
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
