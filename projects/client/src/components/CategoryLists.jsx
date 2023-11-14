import { useEffect, useState } from "react";
import api from "../api";
import { toast } from "sonner";
import { BsTrash3Fill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { ConfirmDeleteCategory } from "./ConfirmDeleteCategory";
import { EditCategoryModal } from "./EditCategoryModal";

export const CategoryLists = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const getCategories = async () => {
    try {
      const response = await api.get("/category");
      setCategories(response.data.detail);
    } catch (error) {
      if (error.response.status === 500) {
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
      } else if (error.response.status === 400) {
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
      }
    }
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setOpenDeleteModal(!openDeleteModal);
    getCategories();
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setOpenEditModal(!openEditModal);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(!openEditModal);
    setSelectedCategory(null);
    getCategories();
  };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <>
      <div className="flex w-[90vw] h-[62vh] overflow-y-scroll">
        <div className="flex flex-col gap-2 w-full h-[100%]">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Category Lists</h1>
          {categories ? (
            categories.map((category, index) => (
              <div className="flex justify-between items-center px-8 bg-white w-[100%] h-[30vh] shadow-md rounded-md" key={index}>
                <span className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700">{category.name}</span>
                <div className="flex gap-2">
                  <FiEdit className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700" onClick={() => handleEditCategory(category)} />
                  <BsTrash3Fill className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700" onClick={() => handleDeleteCategory(category)} />
                </div>
                <ConfirmDeleteCategory isOpen={openDeleteModal} onClose={handleDeleteCategory} data={selectedCategory} />
                {selectedCategory && <EditCategoryModal isOpen={openEditModal} onClose={handleCloseEditModal} data={selectedCategory} />}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-[10vh] bg-white shadow-md rounded-md">
              <p className="text-lg font-bold text-gray-900 dark:text-white">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
