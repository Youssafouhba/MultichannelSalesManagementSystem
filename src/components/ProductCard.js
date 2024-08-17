import {
    Avatar,
    Textarea,
    Badge,
    Button,
    Card,
    Input,
    CardBody,
  } from "@windmill/react-ui";
import { Link, NavLink, useHistory } from "react-router-dom";
import { EditIcon, EyeIcon, GridViewIcon, HomeIcon, ListViewIcon, TrashIcon } from "../icons";
import React, { useState, useEffect } from 'react';
import StarRating from '../components/StarRating';
import { ProductService } from '../service/ProductService';
import { useAuth } from "../security/Authentification";

const ProductCard = ({ product, onEdit ,onDelete}) => {
    const [rating, setRating] = useState(null);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const productRating = await ProductService.fetchProductRating(product.id);
                setRating(productRating);
            } catch (error) {
                console.error('Error fetching product rating:', error);
                setRating(0);
            }
        };

        fetchRating();
    }, [product.id]);

    return (
      <div key={product.id}>
        <Card className="flex flex-col justify-between h-full">
          <div className="h-48 w-full overflow-hidden rounded-t-lg">
            <img
              className="object-cover h-full w-full"
              src={product.imageUrls[0] ? product.imageUrls[0].url : null}
              alt="product"
            />
          </div>
          <CardBody className="flex flex-col justify-between flex-1">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold truncate text-gray-600 dark:text-gray-300">
                  {product.name}
                </p>
                <Badge
                  type={product.quantityInStock > 10 ? "success" : "danger"}
                  className="whitespace-nowrap"
                >
                  {product.quantityInStock > 10 ? `In Stock` : "Out of Stock"}
                </Badge>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <p className="mb-2 text-blue-500 font-bold text-lg">£{product.price}</p>
                <p className="mb-2 text-blue-500 font-bold text-lg">
                  <StarRating rating={rating} />
                </p>
              </div>
  
              <p className="text-gray-600 dark:text-gray-400 mb-4 overflow-hidden">
                {product.description.length > 100
                  ? `${product.description.substring(0, 100)}...`
                  : product.description}
              </p>
            </div>
  
            <div className="flex items-center justify-between mt-auto">
              <Link to={`/app/product/${product.id}`}>
                <Button
                  icon={EyeIcon}
                  className="mr-3"
                  aria-label="Preview"
                  size="small"
                />
              </Link>
              <Button
                icon={EditIcon}
                className="mr-3"
                layout="outline"
                aria-label="Edit"
                size="small"
                onClick={() => onEdit(product)}
              />
              <Button
                icon={TrashIcon}
                layout="outline"
                aria-label="Delete"
                onClick={() => onDelete(product)}
                size="small"
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
};

export default ProductCard;