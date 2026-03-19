const { docClient } = require("../config/dynamodb");
const {
  ScanCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE_NAME = "Products";

class Product {
  // Get all products
  static async getAll(search = "") {
    const result = await docClient.send(
      new ScanCommand({ TableName: TABLE_NAME })
    );
    let items = result.Items || [];

    if (search) {
      const keyword = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          (p.description && p.description.toLowerCase().includes(keyword))
      );
    }

    // Sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }

  // Get product by ID
  static async getById(id) {
    const result = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { id } })
    );
    return result.Item || null;
  }

  // Create new product
  static async create(data) {
    const product = {
      id: uuidv4(),
      name: data.name,
      price: parseFloat(data.price) || 0,
      unit_in_stock: parseInt(data.unit_in_stock) || 0,
      url_image: data.url_image || "",
      description: data.description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({ TableName: TABLE_NAME, Item: product })
    );
    return product;
  }

  // Update product
  static async update(id, data) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    if (data.name !== undefined) {
      updateExpression.push("#name = :name");
      expressionAttributeNames["#name"] = "name";
      expressionAttributeValues[":name"] = data.name;
    }
    if (data.price !== undefined) {
      updateExpression.push("price = :price");
      expressionAttributeValues[":price"] = parseFloat(data.price) || 0;
    }
    if (data.unit_in_stock !== undefined) {
      updateExpression.push("unit_in_stock = :unit_in_stock");
      expressionAttributeValues[":unit_in_stock"] =
        parseInt(data.unit_in_stock) || 0;
    }
    if (data.url_image !== undefined) {
      updateExpression.push("url_image = :url_image");
      expressionAttributeValues[":url_image"] = data.url_image;
    }
    if (data.description !== undefined) {
      updateExpression.push("description = :description");
      expressionAttributeValues[":description"] = data.description || "";
    }

    updateExpression.push("updatedAt = :updatedAt");
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: "SET " + updateExpression.join(", "),
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };

    if (Object.keys(expressionAttributeNames).length > 0) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }

    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  // Delete product
  static async delete(id) {
    // Get product first to return image path
    const product = await Product.getById(id);
    await docClient.send(
      new DeleteCommand({ TableName: TABLE_NAME, Key: { id } })
    );
    return product;
  }

  // Validate product data
  static validate(data) {
    const errors = [];

    if (!data.name || data.name.trim() === "") {
      errors.push("Tên sản phẩm không được để trống.");
    } else if (data.name.trim().length < 2) {
      errors.push("Tên sản phẩm phải có ít nhất 2 ký tự.");
    }

    if (data.price === undefined || data.price === "") {
      errors.push("Giá sản phẩm không được để trống.");
    } else if (isNaN(parseFloat(data.price)) || parseFloat(data.price) < 0) {
      errors.push("Giá sản phẩm phải là số không âm.");
    }

    if (data.unit_in_stock === undefined || data.unit_in_stock === "") {
      errors.push("Số lượng tồn kho không được để trống.");
    } else if (
      isNaN(parseInt(data.unit_in_stock)) ||
      parseInt(data.unit_in_stock) < 0
    ) {
      errors.push("Số lượng tồn kho phải là số nguyên không âm.");
    }

    return errors;
  }
}

module.exports = Product;
