import { Category } from "../models/category.model.js";
// Create Category
export const createCategory = async (data) => {
    return await Category.create(data);
};
// Get all categories
export const getAllCategories = async () => {
    return await Category.find();
};
// Get a category by ID
export const getCategoryById = async (id) => {
    return await Category.findById(id);
};
// Update a category
export const updateCategory = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, { new: true });
};
// Delete a category
export const deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};
//# sourceMappingURL=category.repositry.js.map