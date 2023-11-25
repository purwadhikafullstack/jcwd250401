import api from "../../api";

const getProductsCountsUser = async ({
  sort,
  category,
  search,
  filterBy,
  isArchived = false,
} = {}) => {
  try {
    const url = `/product/user/?isArchived=${isArchived}` +
      (sort ? `&sort=${sort}` : '') +
      (category ? `&category=${category}` : '') +
      (search ? `&search=${search}` : '') +
      (filterBy ? `&filterBy=${filterBy}` : '');

    const response = await api.get(url);
    return response.data; 

  } catch (error) {
    console.error('Error in useGetProduct:', error);
    throw error;
  }
};

export default getProductsCountsUser;
