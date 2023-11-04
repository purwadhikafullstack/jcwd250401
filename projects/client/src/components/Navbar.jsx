import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { BsCart, BsSearch } from "react-icons/bs";
import { MdFavoriteBorder } from "react-icons/md";

export const Navigationbar = () => {
  const userData = [
    {
      id: 1,
      name: "Bonnie Green",
      email: "Bonnie@mail.com",
    },
  ];
  const isLogin = false;
  return (
    <div className="flex items-center md:justify-evenly">
      <Navbar
        className="w-[100vw] mx-5"
        theme={{
          theme: {
            root: {
              rounded: "rounded-none",
            },
          },
        }}>
        <Navbar.Brand href="#">
          {/* <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Warehouse Logo" /> */}
          <span className="self-center whitespace-nowrap text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold dark:text-white">RAINS</span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          {isLogin ? (
            <>
              <Dropdown arrowIcon={false} inline label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}>
                <Dropdown.Header>
                  {userData.map((user) => (
                    <div key={user.id}>
                      <p>{user.name}</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  ))}
                </Dropdown.Header>
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item>Address Book</Dropdown.Item>
                <Dropdown.Item>My Order </Dropdown.Item>
                <Dropdown.Item>Change my password</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>Sign out</Dropdown.Item>
              </Dropdown>
            </>
          ) : (
            <div className="flex items-center sm:w-full md:w-auto">
              <Button rounded className="ml-3 bg-black text-white hover:bg-Grey-4 hover:text-black">
                Sign up
              </Button>
              <Button rounded className="ml-3 bg-black text-white hover:bg-Grey-4 hover:text-black">
                Sign in
              </Button>
            </div>
          )}
          <div className="flex items-center">
            <BsSearch className="text-xl mr-3 ml-3 cursor-pointer" />
            <BsCart className="text-xl mr-3 cursor-pointer" />
            <MdFavoriteBorder className="text-xl mr-3 cursor-pointer" />
            <Navbar.Toggle />
          </div>
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="#" active className="md:text-md lg:text-lg font-semibold">
            HOME
          </Navbar.Link>
          <Navbar.Link href="#" className="md:text-md lg:text-lg font-semibold">
            MEN
          </Navbar.Link>
          <Navbar.Link href="#" className="md:text-md lg:text-lg font-semibold">
            WOMEN
          </Navbar.Link>
          <Navbar.Link href="#" className="md:text-md lg:text-lg font-semibold">
            BAGS
          </Navbar.Link>
          <Navbar.Link href="#" className="md:text-md lg:text-lg font-semibold">
            ACCESSORIES
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
