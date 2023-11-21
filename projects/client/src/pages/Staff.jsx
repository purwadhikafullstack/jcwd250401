import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { useEffect, useState } from "react";
import api from "../api";
import { toast } from "sonner";
import { Box, Card, CardBody, Image, Stack, Text } from "@chakra-ui/react";
import { BsFillTrash3Fill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { ConfirmModal } from "../components/ConfirmModal";
import { AddEditAdminModal } from "../components/AddEditAdminModal";

export const Staff = () => {
  // Validate if user is admin or warehouse admin
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

  const getAdmins = async () => {
    try {
      let isWarehouseAdminValue = isWarehouseAdmin;

      // If "All Admin" is selected, set isWarehouseAdminValue to null
      if (isWarehouseAdmin === "") {
        isWarehouseAdminValue = null;
      }

      const response = await api.get(`/users/admin?page=${page}&size=${size}&sort=${sort}&order=${order}`, {
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
  }, [page, size, sort, order, isWarehouseAdmin]);

  return (
    <div className="flex flex-row justify-between h-screen">
      <Sidebar />
      <div className="w-[84vw] bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[16vw] right-0 z-50 bg-white">
          <Navigationadmin />
        </div>

        <div className="flex mt-16 py-4 px-4 md:p-8 justify-between">
          <div className="flex gap-2">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-black text-white py-2 px-4 rounded-md cursor-pointer focus:ring-0 focus:border-none">
              <option value={"createdAt"} disabled defaultChecked>
                Select Sort
              </option>
              <option value={"username"}>Username</option>
              <option value={"email"}>Email</option>
              <option value={"isWarehouseAdmin"}>Role</option>
            </select>

            <select value={order} onChange={(e) => setOrder(e.target.value)} className="bg-black text-white py-2 px-4 rounded-md cursor-pointer focus:ring-0 focus:border-none">
              <option value={"DESC"} disabled defaultChecked>
                Select Order
              </option>
              <option value={"ASC"}>A to Z</option>
              <option value={"DESC"}>Z to A</option>
            </select>

            {sort === "isWarehouseAdmin" && (
              <select value={isWarehouseAdmin} onChange={(e) => setIsWarehouseAdmin(e.target.value)} className="bg-black text-white py-2 px-4 rounded-md cursor-pointer focus:ring-0 focus:border-none">
                <option value={""}>All Admin</option>
                <option value={true}>Warehouse Admin</option>
                <option value={false}>Super Admin</option>
              </select>
            )}
          </div>

          <button className="bg-black text-white py-2 px-4 rounded-md" onClick={handleCreateAdminModal}>
            Create Admin
          </button>
        </div>
        {admins.length > 0 ? (
          <div className="flex flex-col px-4 md:px-8 gap-2 h-[65vh] overflow-y-auto scrollbar-hide">
            {admins.map((admin, index) => (
              <Box key={index}>
                <Card direction={{ base: "column", sm: "row" }} overflow="hidden" variant="outline" size={"sm"}>
                  <Image
                    objectFit="cover"
                    minW={{ base: "100%", sm: "150px" }}
                    maxW={{ base: "100%", sm: "150px" }}
                    src={admin.photoProfile ? `http://localhost:8000/public/${admin.photoProfile}` : "https://via.placeholder.com/150"}
                    alt={admin.photoProfile ? admin.photoProfile : "Not yet"}
                  />

                  <Stack>
                    <CardBody>
                      <Box>
                        <Box>
                          <Text>Username: {admin.username}</Text>
                          <Text>Email: {admin.email}</Text>
                          <Text>Role: {admin.isWarehouseAdmin ? "Warehouse Admin" : "Super Admin"}</Text>
                        </Box>

                        <Box display={"flex"} gap={3} mt={3}>
                          <BsFillTrash3Fill size={20} className="cursor-pointer" onClick={() => handleDeleteModal(admin)} />
                          <FiEdit size={20} className="cursor-pointer" onClick={() => handleEditModal(admin)} />
                        </Box>
                      </Box>
                    </CardBody>
                  </Stack>
                </Card>
              </Box>
            ))}
          </div>
        ) : (
          <div className="flex flex-col mt-16 py-8 px-4 md:p-8 gap-2 h-[55vh]">
            <h1 className="text-3xl font-semibold italic text-center">No Admins found</h1>
          </div>
        )}
        <div className="flex justify-between items-center px-8 mt-3">
          <button disabled={page === 1} className="bg-black text-white py-2 px-4 rounded-md" onClick={() => setPage(page - 1)}>
            Previous Page
          </button>
          <span>{page}</span>
          <button disabled={admins.length < size} className="bg-black text-white py-2 px-4 rounded-md" onClick={() => setPage(page + 1)}>
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
