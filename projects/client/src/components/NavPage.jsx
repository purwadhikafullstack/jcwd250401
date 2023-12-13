import React from "react";
import Navigationbar from "./Navigationbar";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const NavPage = ({ pageName }) => {
  const joinnedPageName = pageName.toLowerCase().replace(/\s/g, "-");
  const listsMenu = ["Profile", "Address Book", "My Order", "Change Password"];
  const navigate = useNavigate();
  const handleSelectChange = (e) => {
    const selectedList = e.target.value.toLowerCase().replace(/\s/g, "-");
    navigate(`/account/${selectedList}`);
  };
  const location = useLocation();
  const currentPage = location.pathname
    .split("/")[2]
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return (
    <>
      <div className="h-[17vh] w-full mb-5 sm:mb-0">
        <div className="flex justify-center">
          <div className="w-[90vw] lg:w-[76vw] mt-4">
            <p className="flex gap-3 ml-1">
              <Link to="/">Home</Link> /<Link to="/account/profile">Account</Link> /<Link to={`/account/${joinnedPageName}`}><b>{pageName}</b></Link>
            </p>
            <h1 className="font-bold text-3xl mt-7 hidden lg:flex">Account</h1>
            <div className="flex gap-4 items-center lg:hidden mt-7">
              <h1 className="font-bold text-3xl">Account</h1>
              <select className="border border-gray-300 rounded-md px-2 py-1 cursor-pointer" defaultValue={currentPage} onChange={handleSelectChange}>
                {listsMenu.map((list, index) => {
                  return (
                    <option key={index} value={list}>
                      {list}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
