import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { useEffect, useState } from "react";
import api from "../api";
import { toast } from "sonner";
import { Input, InputGroup, InputLeftElement, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { ConfirmModal } from "../components/ConfirmModal";
import { AddEditAdminModal } from "../components/AddEditAdminModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useDebounceValue from "../hooks/useDebounceValue";
import { SearchIcon } from "@chakra-ui/icons";

export const Staff = () => {
  const isWarehouseAdminAcc = useSelector((state) => state?.account?.isWarehouseAdmin);
  const [admins, setAdmins] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [createAdminModal, setCreateAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [page, setPage] = useState(1);
  const size = 5;
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("DESC");
  const [isWarehouseAdmin, setIsWarehouseAdmin] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounceValue(searchInput, 300);
  const navigate = useNavigate();

  const handleSearchInputChange = (e) => setSearchInput(e.target.value);

  const getAdmins = async () => {
    try {
      let isWarehouseAdminValue = isWarehouseAdmin;

      // If "All Admin" is selected, set isWarehouseAdminValue to null
      if (isWarehouseAdmin === "" || isWarehouseAdmin === undefined || isWarehouseAdmin === null) {
        isWarehouseAdminValue = "";
      }

      const response = await api.admin.get(`/users/admin?page=${page}&size=${size}&sort=${sort}&order=${order}&search=${debouncedSearchInput}`, {
        params: {
          isWarehouseAdmin: isWarehouseAdminValue,
        },
      });
      setAdmins(response.data.detail);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
      } else if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        toast.error(error.response.data.message, {
          description: error.response.data.detail,
        });
        if (error.response.status === 403) navigate("/adminlogin");
        if (error.response.status === 401) navigate("/dashboard");
      }
    }
  };

  const handleDeleteModal = (data) => {
    setDeleteModal(true);
    setSelectedAdmin(data);
  };

  const handleEditModal = (data) => {
    setEditModal(true);
    setSelectedAdmin(data);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
    setSelectedAdmin(null);
    getAdmins();
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    setSelectedAdmin(null);
    getAdmins();
  };

  const handleCreateAdminModal = () => setCreateAdminModal(!createAdminModal);
  const handleCloseCreateAdminModal = () => {
    setCreateAdminModal(false);
    getAdmins();
  };

  useEffect(() => {
    getAdmins();
  }, [page, size, sort, order, isWarehouseAdmin, debouncedSearchInput]);

  return (
    <div className="flex flex-row justify-between h-screen">
      <Sidebar />
      <div className="w-[84vw] bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[16vw] right-0 z-50 bg-white">
          <Navigationadmin />
        </div>

        <div className="flex flex-col md:flex-row mt-16 py-6 px-4 md:p-8 justify-between gap-2">
          <InputGroup className="self-end">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="#40403F" />
            </InputLeftElement>
            <Input type="text" placeholder="Search staff name" value={searchInput} onChange={handleSearchInputChange} bgColor={"white"} borderColor={"#40403F"} w={{ base: "100%", md: "300px" }} _hover={{ borderColor: "#40403F" }} />
          </InputGroup>

          <div className="flex flex-col gap-2">
            <button className="bg-[#40403F] text-white font-semibold py-2 px-4 rounded-md" onClick={handleCreateAdminModal}>
              Add New Staff
            </button>

            <div className="flex gap-2">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white text-[#40403F] border boder-[#40403F]-1 py-2 px-4 rounded-md cursor-pointer focus:ring-0 focus:border-none">
                <option value={"createdAt"} disabled defaultChecked>
                  Select Sort
                </option>
                <option value={"username"}>Username</option>
                <option value={"email"}>Email</option>
                <option value={"isWarehouseAdmin"}>Role</option>
              </select>

              <select value={order} onChange={(e) => setOrder(e.target.value)} className="bg-white text-[#40403F] border boder-[#40403F]-1 py-2 px-4 rounded-md cursor-pointer focus:ring-0 focus:border-none">
                <option value={""} disabled defaultChecked>
                  Select Order
                </option>
                <option value={"ASC"}>A to Z</option>
                <option value={"DESC"}>Z to A</option>
              </select>

              {sort === "isWarehouseAdmin" && (
                <select value={isWarehouseAdmin} onChange={(e) => setIsWarehouseAdmin(e.target.value)} className="bg-white text-[#40403F] border boder-[#40403F]-1 py-2 px-4 rounded-md cursor-pointer focus:ring-0 focus:border-none">
                  <option value={""}>All Admin</option>
                  <option value={true}>Warehouse Admin</option>
                  <option value={false}>Super Admin</option>
                </select>
              )}
            </div>
          </div>
        </div>
        {admins.length > 0 ? (
          <div className="flex flex-col px-4 md:px-8 gap-2 min-h-[50vh] md:h-[58vh] overflow-y-auto scrollbar-hide">
            <TableContainer>
              <Table variant="striped" colorScheme="blackAlpha">
                <Thead>
                  <Tr textColor={"#40403F"} fontWeight={"bold"}>
                    <Th>Username</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Warehouse</Th>
                    {isWarehouseAdminAcc ? null : <Th>Action</Th>}
                  </Tr>
                </Thead>
                <Tbody>
                  {admins.map((admin, index) => (
                    <Tr key={index}>
                      <Td>{admin.username}</Td>
                      <Td>{admin.email}</Td>
                      <Td>{admin.isWarehouseAdmin ? "Warehouse Admin" : "Super Admin"}</Td>
                      <Td>{admin.warehouse?.name ? admin.warehouse?.name : "Not yet"}</Td>
                      {isWarehouseAdminAcc ? null : (
                        <Td>
                          <select
                            className="bg-white text-[#40403F] border boder-[#40403F]-1 rounded-md cursor-pointer focus:ring-0 focus:border-none w-[100px] h-[40px]"
                            onChange={(e) => {
                              if (e.target.value === "Delete") {
                                handleDeleteModal(admin);
                              } else if (e.target.value === "Edit") {
                                handleEditModal(admin);
                              }
                            }}>
                            <option value="Select">Select</option>
                            <option value="Edit">Edit</option>
                            <option value="Delete">Delete</option>
                          </select>
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div className="flex flex-col mt-16 py-8 px-4 md:p-8 gap-2 h-[55vh]">
            <h1 className="text-3xl font-semibold italic text-center">No data matches</h1>
          </div>
        )}
        <div className="flex justify-between items-center px-8 mt-3">
          <button disabled={page === 1} className="bg-[#40403F] text-white py-2 px-4 rounded-md font-bold" onClick={() => setPage(page - 1)}>
            Prev Page
          </button>
          <span className="text-[#40403F] font-bold">{page}</span>
          <button disabled={admins.length < size} className="bg-[#40403F] text-white py-2 px-4 rounded-md font-bold" onClick={() => setPage(page + 1)}>
            Next Page
          </button>
        </div>
      </div>
      <ConfirmModal isOpen={deleteModal} onClose={handleCloseDeleteModal} data={selectedAdmin} userId={selectedAdmin?.id} deleteFor="admin" />
      {selectedAdmin && <AddEditAdminModal isOpen={editModal} onClose={handleCloseEditModal} data={selectedAdmin} modalFor={"Edit"} />}
      <AddEditAdminModal isOpen={createAdminModal} onClose={handleCloseCreateAdminModal} data={null} modalFor={"Create"} />
    </div>
  );
};
