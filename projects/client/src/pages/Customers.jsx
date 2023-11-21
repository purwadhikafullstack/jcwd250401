import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { useEffect, useRef, useState } from "react";
import api from "../api";
import { Box, Card, CardBody, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { toast } from "sonner";

export const Customers = () => {
  const isMounted = useRef(true); // useRef to track whether the component is mounted
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const size = 5;
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("DESC");

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const response = await api.get(`/users?page=${page}&size=${size}&sort=${sort}&order=${order}`);
        setCustomers(response.data.detail);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          toast.error(error.response.data.message, {
            description: error.response.data.detail,
          });
        }
      }
    };

    // if (isMounted.current) {
    //   getCustomers();
    // }
    // return () => {
    //   isMounted.current = false;
    // };
    getCustomers();
  }, [page, size, sort, order]);
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
            </select>

            <select value={order} onChange={(e) => setOrder(e.target.value)} className="bg-black text-white py-2 px-4 rounded-md cursor-pointer focus:ring-0 focus:border-none">
              <option value={""} disabled defaultChecked>
                Select Order
              </option>
              <option value={"ASC"}>A to Z</option>
              <option value={"DESC"}>Z to A</option>
            </select>
          </div>
        </div>
        {customers.length > 0 ? (
          <div className="flex flex-col px-4 md:px-8 gap-2 h-[65vh] overflow-y-auto scrollbar-hide">
            {customers.map((customer, index) => (
              <Box key={index}>
                <Card direction={{ base: "column", sm: "row" }} overflow="hidden" variant="outline" size={"sm"}>
                  <Image
                    objectFit="cover"
                    minW={{ base: "100%", sm: "150px" }}
                    maxW={{ base: "100%", sm: "150px" }}
                    src={customer.photoProfile ? `http://localhost:8000/public/${customer.photoProfile}` : "https://via.placeholder.com/150"}
                    alt={customer.photoProfile ? customer.photoProfile : "Not yet"}
                  />

                  <Stack>
                    <CardBody>
                      <Heading size="md">{customer.firstName ? customer.firstName : "First name is not set"}</Heading>

                      <Text>Username: {customer.username}</Text>
                      <Text>Email: {customer.email}</Text>
                      <Text>Status: {customer.isVerify ? "Verified" : "Not Verified"}</Text>
                    </CardBody>
                  </Stack>
                </Card>
              </Box>
            ))}
          </div>
        ) : (
          <div className="flex flex-col mt-16 py-8 px-4 md:p-8 gap-2 h-[85vh]">
            <h1 className="text-3xl font-semibold italic text-center">No customers found</h1>
          </div>
        )}
        <div className="flex justify-between items-center px-8 mt-3">
          <button disabled={page === 1} className="bg-black text-white py-2 px-4 rounded-md" onClick={() => setPage(page - 1)}>
            Previous Page
          </button>
          <span>{page}</span>
          <button disabled={customers.length < size} className="bg-black text-white py-2 px-4 rounded-md" onClick={() => setPage(page + 1)}>
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};
