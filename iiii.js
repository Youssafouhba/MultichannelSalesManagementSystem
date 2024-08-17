<div>
<PageTitle>Update Product</PageTitle>

<div className="flex text-gray-800 dark:text-gray-300">
  <div className="flex items-center text-purple-600">
    <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
    <NavLink exact to="/app/dashboard" className="mx-2">
      Dashboard
    </NavLink>
  </div>
  {">"}
  <p className="mx-2">Update Product</p>
</div>

<div className="w-full mt-8 grid gap-4 grid-col md:grid-cols-3">
  <Card className="row-span-2 md:col-span-2">
    <CardBody>
      <form onSubmit={handleSubmit}>
        <FormTitle>Product Images ({images.length} to 3)</FormTitle>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 text-gray-800 dark:text-gray-300"
        />
        {images.length > 0 && (
          <div className="mb-4">
            {images.map((item, index) => (
              <div key={index} className="flex items-center">
                <img
                  src={typeof item === "string" ? item : URL.createObjectURL(item)}
                  alt={`Product image ${index}`}
                  className="w-20 h-20 mr-2 mb-2"
                />
                <Button
                  layout="link"
                  icon={Cancel}
                  onClick={() => handleDeleteImage(index)}
                />
              </div>
            ))}
          </div>
        )}

        <FormTitle>Product Title</FormTitle>
        <Label>
          <Input
            name="name"
            className="mb-4"
            placeholder="Type product title here"
            value={product1.name}
            onChange={handleInputChange}
            required
          />
        </Label>

        <FormTitle>Product Price</FormTitle>
        <Label>
          <Input
            name="price"
            className="mb-4"
            placeholder="Enter product price here"
            value={product1.price}
            onChange={handleInputChange}
            required
          />
        </Label>

        <FormTitle>Stock Quantity</FormTitle>
        <Label>
          <Input
            name="quantityInStock"
            className="mb-4"
            placeholder="Enter product stock quantity"
            value={product1.quantityInStock}
            onChange={handleInputChange}
            required
          />
        </Label>

        <FormTitle>Description</FormTitle>
        <Label>
          <Textarea
            name="description"
            className="mb-4"
            rows="5"
            placeholder="Enter product full description here"
            value={product1.description}
            onChange={handleInputChange}
            required
          />
        </Label>

        <FormTitle>Select Product Category</FormTitle>
        <Label>
          <Select
            name="category"
            value={product1.category}
            onChange={handleInputChange}
            className="mb-4"
            required
          >
            <option value="" disabled>Select category</option>
            <option value="LED Ceiling Panel">LED Ceiling Panel</option>
            <option value="LED Strip Lighting">LED Strip Lighting</option>
            <option value="Led Profiles">Led Profiles</option>
            <option value="Suspended Ceiling & Metal Grid">Suspended Ceiling & Metal Grid</option>
          </Select>
        </Label>

        <FormTitle>Product Type</FormTitle>
        <div className="flex mb-4">
          <Label radio className="flex items-center mr-4">
            <Input
              type="radio"
              name="productType"
              value="newDesign"
              checked={selectedOption === "newDesign"}
              onChange={handleOptionChange}
              className="text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">New Design</span>
          </Label>

          <Label radio className="flex items-center">
            <Input
              type="radio"
              name="productType"
              value="bestSeller"
              checked={selectedOption === "bestSeller"}
              onChange={handleOptionChange}
              className="text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Best Seller</span>
          </Label>
        </div>

        <div className="w-full">
          <Button type="submit" size="large" iconLeft={AddIcon} disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </div>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </form>
    </CardBody>
  </Card>
</div>
</div>