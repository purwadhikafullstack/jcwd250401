import { useEffect, useState } from "react";
import api from "../api";
import { toast } from "sonner";
import { BsTrash3Fill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { ConfirmDeleteCategory } from "./ConfirmDeleteCategory";
import { EditCategoryModal } from "./EditCategoryModal";
import { useSelector } from "react-redux";

export const CategoryLists = () => {
  const isWarehouseAdmin = useSelector((state) => state?.account?.profile?.data.profile?.isWarehouseAdmin);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState("All");
  const filteredSubCategories = subcategories.filter((category) => category.parentCategoryId === selectedMainCategory?.id);
  const categoryLists = useSelector((state) => state?.category?.categoryLists);

  const getCategories = async () => {
    try {
      const response = await api.get("/category");
      const categories = response.data.detail.filter((category) => category.id <= 5);
      const subCategories = response.data.detail.filter((category) => category.id > 5);
      setCategories(categories);
      setSubcategories(subCategories);
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

  const handleSelectMainCategory = (category) => setSelectedMainCategory(category);
  const handleOptionChange = (e) => {
    if (e.target.value === "All") setSelectedMainCategory("All");
    else setSelectedMainCategory(categories.find((category) => category.id === Number(e.target.value)));
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
  }, [categoryLists]);

  return (
    <>
      <div className="flex w-[90vw] h-[60vh] md:h-[62vh] overflow-y-auto">
        <div className="flex flex-col gap-2 w-full h-auto">
          <h1 className="hidden md:flex text-2xl font-bold text-gray-900 dark:text-white">Category Lists</h1>

          <h2 className="md:flex text-sm font-semibold text-gray-900 dark:text-white">Main Categories</h2>
          <div className="hidden md:flex gap-2 flex-wrap">
            {categories ? (
              <>
                <div className="flex items-center justify-center bg-white w-[150px] h-[5vh] shadow-md rounded-md cursor-pointer hover:bg-gray-100" onClick={() => handleSelectMainCategory("All")}>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">All</span>
                </div>
                {categories.map((category, index) => (
                  <div className="flex items-center justify-center bg-white w-[150px] h-[5vh] shadow-md rounded-md cursor-pointer hover:bg-gray-100" key={index} onClick={() => handleSelectMainCategory(category)}>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{category.name}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex justify-center items-center w-full h-[10vh] bg-white shadow-md rounded-md">
                <p className="text-lg font-bold text-gray-900 dark:text-white">No categories found</p>
              </div>
            )}
          </div>

          <div className="flex md:hidden gap-2 flex-wrap">
            <select className="text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700 w-[150px] rounded-md" onChange={handleOptionChange}>
              <option value="All">All</option>
              {categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mt-2">Sub Categories</h2>
          <div className="h-auto w-full overflow-y-auto flex flex-col gap-2 py-2">
            {selectedMainCategory === "All" ? (
              subcategories ? (
                subcategories.map((category, index) => (
                  <div className="flex justify-between items-center px-8 py-2 bg-white w-full h-[7vh] shadow-md rounded-md" key={index}>
                    <span className="text-lg font-bold text-gray-900 dark:text-white hover:text-gray-700">{category.name}</span>
                    {isWarehouseAdmin ? (
                      ""
                    ) : (
                      <div className="flex gap-2">
                        <FiEdit className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700" onClick={() => handleEditCategory(category)} />
                        <BsTrash3Fill className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700" onClick={() => handleDeleteCategory(category)} />
                      </div>
                    )}
                    <ConfirmDeleteCategory isOpen={openDeleteModal} onClose={handleDeleteCategory} data={selectedCategory} mainCategories={categories} />
                    {selectedCategory && <EditCategoryModal isOpen={openEditModal} onClose={handleCloseEditModal} data={selectedCategory} mainCategories={categories}/>}
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center w-full h-[10vh] bg-white shadow-md rounded-md">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">No Sub Categories Found</p>
                </div>
              )
            ) : filteredSubCategories ? (
              filteredSubCategories.map((category, index) => (
                <div className="flex justify-between items-center px-8 py-2 bg-white w-full h-[7vh] shadow-md rounded-md" key={index}>
                  <span className="text-lg font-bold text-gray-900 dark:text-white hover:text-gray-700">{category.name}</span>
                  {isWarehouseAdmin ? (
                    ""
                  ) : (
                    <div className="flex gap-2">
                      <FiEdit className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700" onClick={() => handleEditCategory(category)} />
                      <BsTrash3Fill className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-gray-700" onClick={() => handleDeleteCategory(category)} />
                    </div>
                  )}
                  <ConfirmDeleteCategory isOpen={openDeleteModal} onClose={handleDeleteCategory} data={selectedCategory} mainCategories={categories} />
                  {selectedCategory && <EditCategoryModal isOpen={openEditModal} onClose={handleCloseEditModal} data={selectedCategory} />}
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center w-full h-[10vh] bg-white shadow-md rounded-md">
                <p className="text-lg font-bold text-gray-900 dark:text-white">No Sub Categories Found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
