import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Input, InputGroup, InputLeftElement, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useDebounceValue from "../hooks/useDebounceValue";
import { SearchIcon } from "@chakra-ui/icons";
import getCustomers from "../api/users/getCustomers";

export const Customers = () => {
  const isMounted = useRef(true); // useRef to track whether the component is mounted
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const size = 5;
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("DESC");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounceValue(searchInput, 300);
  const navigate = useNavigate();

  const handleSearchInputChange = (e) => setSearchInput(e.target.value);
  const fetchCustomers = useCallback( async () => {
    try {
      const response = await getCustomers({
        page,
        size,
        sort,
        order,
        search: debouncedSearchInput
      })
      setCustomers(response.detail);
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
  },[page, size, sort, order, debouncedSearchInput]);
  
  useEffect(() => {

    // if (isMounted.current) {
    //   fetchCustomers();
    // }
    // return () => {
    //   isMounted.current = false;
    // };
    fetchCustomers();
  }, [fetchCustomers]);
  return (
    <div className="flex flex-row justify-between h-screen">
      <Sidebar />
      <div className="w-[82vw] lg:w-[84vw] bg-[#f0f0f0] overflow-hidden flex flex-col">
        <div className="shadow-md fixed top-0 left-[18vw] lg:left-[16vw] right-0 z-50 bg-white">
          <Navigationadmin />
        </div>

        <div className="flex flex-col md:flex-row mt-16 py-8 px-4 md:p-8 justify-between gap-2">
          <InputGroup className="self-end">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="#40403F" />
            </InputLeftElement>
            <Input type="text" placeholder="Search customers name" value={searchInput} onChange={handleSearchInputChange} bgColor={"white"} borderColor={"#40403F"} w={{ base: "100%", md: "300px" }} _hover={{ borderColor: "#40403F" }} />
          </InputGroup>

          <div className="flex gap-2">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white text-[#40403F] py-2 px-4 rounded-md cursor-pointer focus:ring-0 focus:border-none">
              <option value={"createdAt"} disabled defaultChecked>
                Select Sort
              </option>
              <option value={"username"}>Username</option>
              <option value={"email"}>Email</option>
            </select>

            <select value={order} onChange={(e) => setOrder(e.target.value)} className="bg-white text-[#40403F] py-2 px-4 rounded-md cursor-pointer focus:ring-0 focus:border-none">
              <option value={""} disabled defaultChecked>
                Select Order
              </option>
              <option value={"ASC"}>A to Z</option>
              <option value={"DESC"}>Z to A</option>
            </select>
          </div>
        </div>
        {customers.length > 0 ? (
          <div className="flex flex-col px-4 md:px-8 gap-2 min-h-[57vh] md:min-h-[65vh] overflow-y-auto scrollbar-hide">
            <TableContainer>
              <Table variant="striped" colorScheme="blackAlpha">
                <Thead>
                  <Tr>
                    <Th>PhotoProfile</Th>
                    <Th>Username</Th>
                    <Th>First Name</Th>
                    <Th>Last Name</Th>
                    <Th>Email</Th>
                    <Th>Sign up date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {customers.map((customer, index) => (
                    <Tr key={index}>
                      <Td>
                        <Image borderRadius="full" boxSize="40px" src={customer.photoProfile ? `http://localhost:8000/public/${customer.photoProfile}` : "https://via.placeholder.com/150"} alt={customer.photoProfile} />
                      </Td>
                      <Td>{customer.username}</Td>
                      <Td>{customer.firstName ? customer.firstName : "-"}</Td>
                      <Td>{customer.lastName ? customer.lastName : "-"}</Td>
                      <Td>{customer.email}</Td>
                      <Td>{customer.createdAt.slice(0, 10)}</Td>
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
        <div className="flex justify-between items-center px-8 mt-3 font-bold">
          <button disabled={page === 1} className="bg-[#40403F] text-white py-2 px-4 rounded-md" onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span className="text-[#40403F]">Page {page}</span>
          <button disabled={customers.length < size} className="bg-[#40403F] text-white py-2 px-4 rounded-md" onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
