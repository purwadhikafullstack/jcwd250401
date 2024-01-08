import { Carousel } from "flowbite-react";
import Footer from "../components/Footer";
import bagexplore from "../assets/bagexplore.jpg";
import accessoriesexplore from "../assets/accessoriesexplore.png";
import accessoriesexploremobile from "../assets/accessoriesexploremobile.jpg";
import menexplore from "../assets/menexplore.jpg";
import menexploremobile from "../assets/menexploremobile.jpg";
import womenexplore from "../assets/womenexplore.jpg";
import womenexploremobile from "../assets/womenexploremobile.jpg";
import unisexexplore from "../assets/unisexexplore.jpg";
import unisexexploremobile from "../assets/unisexexploremobile.jpg";
import exploremenpufferjackets from "../assets/exploremenpufferjackets.jpg";
import exploremenpufferjacketsmobile from "../assets/exploremenpufferjacketsmobile.jpg";
import explorewomenpufferjackets from "../assets/explorewomenpufferjackets.jpg";
import explorewomenpufferjacketsmobile from "../assets/explorewomenpufferjacketsmobile.jpg";
import exploremenrainjackets from "../assets/exploremenrainjackets.jpg";
import exploremenrainjacketsmobile from "../assets/exploremenrainjacketsmobile.jpg";
import explorewomenrainjackets from "../assets/explorewomenrainjackets.jpg";
import explorewomenrainjacketsmobile from "../assets/explorewomenrainjacketsmobile.jpg";
import explorebags from "../assets/bag.jpg";
import explorebagsmobile from "../assets/bagmobile.png";
import exploreaccessories from "../assets/accessories.jpg";
import exploreaccessoriesmobile from "../assets/accessoriesmobile.jpg";

import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import MenuListMobile from "../components/MenuListMobile";

export const Homepage = () => {
  document.title = "RAINS - Homepage";

  useEffect(() => {
    // Scroll to the top when the component is first rendered
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sagoe">
      <div className="flex px-4 lg:hidden ">
        <MenuListMobile />
      </div>

      {/* Mobile */}
      <div className="h-[95vh] w-full lg:hidden">
        <Carousel slideInterval={5000} indicators={false} style={{ borderRadius: 0 }} className="enabled:rounded-none">
          <div style={{ backgroundImage: `url(${exploremenpufferjacketsmobile})`, backgroundSize: "cover", height: "100vh" }} className="flex items-end px-10 py-44 background-image">
            <div className=" ml-4 w-[50vw] text-white text-xl font-sans font-light">
              <p className="bg-black text-md bg-opacity-40 p-4">
                Explore a diverse collection of Men's Puffer Jackets that strike the perfect balance between style and practicality. RAINS Puffer Jackets are crafted with modern designs and high-quality materials, ensuring not only a
                fashion-forward look but also providing excellent weather resistance.
              </p>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/men/jackets/puffer-jackets"}>
                <span className="font-sans text-black font-medium text-md">Explore Men's Puffer Jackets</span>
              </Button>
            </div>
          </div>
          <div style={{ backgroundImage: `url(${explorewomenpufferjacketsmobile})`, backgroundSize: "cover", height: "100vh" }} className="flex items-end px-10 py-44 background-image">
            <div className=" ml-4 w-[50vw] text-white text-xl font-sans font-light">
              <p className="bg-black text-md bg-opacity-40 p-4">
                Delve into a diverse collection of Women's Puffer Jackets, where style meets functionality seamlessly. RAINS presents jackets that marry fashion and comfort, boasting contemporary designs and top-tier materials. These puffer
                jackets not only embody the latest trends but also offer resilience against a range of weather conditions.
              </p>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/women/jackets/puffer-jackets"}>
                <span className="font-sans text-black font-medium text-md">Explore Women's Puffer Jackets</span>
              </Button>
            </div>
          </div>
          <div style={{ backgroundImage: `url(${exploremenrainjacketsmobile})`, backgroundSize: "cover", height: "100vh" }} className="flex items-end px-10 py-44 background-image">
            <div className=" ml-4 w-[50vw] text-white text-xl font-sans font-light">
              <p className="bg-black text-md bg-opacity-40 p-4">
                Stay stylish in any storm with RAINS Men's Rain Jackets. Modern designs meet superior weather resistance, ensuring you stay dry and on-trend. Embrace urban fashion without compromising on protection - RAINS has you covered,
                rain or shine.
              </p>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/men/jackets/rain-jackets"}>
                <span className="font-sans text-black font-medium text-md">Explore Men's Rain Jackets</span>
              </Button>
            </div>
          </div>
          <div style={{ backgroundImage: `url(${explorewomenrainjacketsmobile})`, backgroundSize: "cover", height: "100vh" }} className="flex items-end px-10 py-44 background-image">
            <div className=" ml-4 w-[50vw] text-white text-xl font-sans font-light">
              <p className="bg-black text-md bg-opacity-40 p-4">
                Embrace the rain in style with RAINS Women's Rain Jackets. Modern designs, premium materials, and weather resistance come together to keep you chic and dry. RAINS redefines rainy-day fashion, ensuring you make a statement,
                rain or shine.
              </p>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/women/jackets/rain-jackets"}>
                <span className="font-sans text-black font-medium text-md">Explore Women's Rain Jackets</span>
              </Button>
            </div>
          </div>
          <div style={{ backgroundImage: `url(${explorebagsmobile})`, backgroundSize: "cover", height: "100vh" }} className="flex items-end px-10 py-44 background-image">
            <div className=" ml-4 w-[50vw] text-white text-xl font-sans font-light">
              <p className="bg-black text-md bg-opacity-40 p-4">
                Upgrade your style and stay ready with RAINS Bags. Modern design, reliable functionality from waterproof backpacks to sleek essentials. Redefine your everyday with RAINS, where fashion meets practicality seamlessly.
              </p>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/unisex/bags"}>
                <span className="font-sans text-black font-medium text-md">Explore RAINS Bags</span>
              </Button>
            </div>
          </div>
          <div style={{ backgroundImage: `url(${exploreaccessoriesmobile})`, backgroundSize: "cover", height: "100vh" }} className="flex items-end px-10 py-44 background-image">
            <div className=" ml-4 w-[50vw] text-white text-xl font-sans font-light">
              <p className="bg-black text-md bg-opacity-40 p-4">
                Elevate your fashion game with the refined details of RAINS Accessories. Explore a curated selection of modern essentials, from trendsetting hats to versatile scarves, designed to effortlessly enhance your everyday style.
              </p>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/unisex/accessories"}>
                <span className="font-sans text-black font-medium text-md">Explore RAINS Accessories</span>
              </Button>
            </div>
          </div>
        </Carousel>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block h-[95vh] w-full">
        <div className="h-[95vh] w-full">
          <Carousel slideInterval={5000} indicators={false} style={{ borderRadius: 0 }} className="enabled:rounded-none">
            <div style={{ backgroundImage: `url(${exploremenpufferjackets})`, backgroundSize: "cover", height: "100vh" }} className="flex justify-between items-end px-20 py-24 background-image">
              <div className="w-[60vw] text-white text-xl font-sans font-light">
                <p className="bg-black text-md bg-opacity-40 p-4">
                  Explore a diverse collection of Men's Puffer Jackets that strike the perfect balance between style and practicality. RAINS Puffer Jackets are crafted with modern designs and high-quality materials, ensuring not only a
                  fashion-forward look but also providing excellent weather resistance.
                </p>
              </div>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/men/jackets/puffer-jackets"}>
                <span className="font-sans font-medium text-md">Explore Men's Puffer Jackets</span>
              </Button>
            </div>
            <div style={{ backgroundImage: `url(${explorewomenpufferjackets})`, backgroundSize: "cover", height: "100vh" }} className="flex justify-between items-end px-20 py-24 background-image">
              <div className="w-[60vw] text-white text-xl font-sans font-light">
                <p className="bg-black text-md bg-opacity-40 p-4">
                  Delve into a diverse collection of Women's Puffer Jackets, where style meets functionality seamlessly. RAINS presents jackets that marry fashion and comfort, boasting contemporary designs and top-tier materials. These
                  puffer jackets not only embody the latest trends but also offer resilience against a range of weather conditions.
                </p>
              </div>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/women/jackets/puffer-jackets"}>
                <span className="font-sans font-medium text-md">Explore Women's Puffer Jackets</span>
              </Button>
            </div>
            <div style={{ backgroundImage: `url(${exploremenrainjackets})`, backgroundSize: "cover", height: "100vh" }} className="flex justify-between items-end px-20 py-24 background-image">
              <div className="w-[60vw] text-white text-xl font-sans font-light">
                <p className="bg-black text-md bg-opacity-40 p-4">
                  Stay stylish in any storm with RAINS Men's Rain Jackets. Modern designs meet superior weather resistance, ensuring you stay dry and on-trend. Embrace urban fashion without compromising on protection - RAINS has you
                  covered, rain or shine.
                </p>
              </div>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/men/jackets/rain-jackets"}>
                <span className="font-sans font-medium text-md">Explore Men's Rain Jackets</span>
              </Button>
            </div>
            <div style={{ backgroundImage: `url(${explorewomenrainjackets})`, backgroundSize: "cover", height: "100vh" }} className="flex justify-between items-end px-20 py-24 background-image">
              <div className="w-[60vw] text-white text-xl font-sans font-light">
                <p className="bg-black text-md bg-opacity-40 p-4">
                  Embrace the rain in style with RAINS Women's Rain Jackets. Modern designs, premium materials, and weather resistance come together to keep you chic and dry. RAINS redefines rainy-day fashion, ensuring you make a statement,
                  rain or shine.
                </p>
              </div>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/women/jackets/rain-jackets"}>
                <span className="font-sans font-medium text-md">Explore Women's Rain Jackets</span>
              </Button>
            </div>
            <div style={{ backgroundImage: `url(${explorebags})`, backgroundSize: "cover", height: "100vh" }} className="flex justify-between items-end px-20 py-24 background-image">
              <div className="w-[60vw] text-white text-xl font-sans font-light">
                <p className="bg-black text-md bg-opacity-40 p-4">
                  Upgrade your style and stay ready with RAINS Bags. Modern design, reliable functionality from waterproof backpacks to sleek essentials. Redefine your everyday with RAINS, where fashion meets practicality seamlessly.
                </p>
              </div>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/unisex/bags"}>
                <span className="font-sans font-medium text-md">Explore RAINS Bags</span>
              </Button>
            </div>
            <div style={{ backgroundImage: `url(${exploreaccessories})`, backgroundSize: "cover", height: "100vh" }} className="flex justify-between items-end px-20 py-24 background-image">
              <div className="w-[60vw] text-white text-xl font-sans font-light">
                <p className="bg-black text-md bg-opacity-40 p-4">
                  Explore a diverse collection of Men's Puffer Jackets that strike the perfect balance between style and practicality. RAINS Puffer Jackets are crafted with modern designs and high-quality materials, ensuring not only a
                  fashion-forward look but also providing excellent weather resistance.
                </p>
              </div>
              <Button className="px-10 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/unisex/accessories"}>
                <span className="font-sans font-medium text-md">Explore RAINS Accessories</span>
              </Button>
            </div>
          </Carousel>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="w-[50vw]">
          <img src={bagexplore} alt="bagexplore" className="w-full h-[450px] lg:h-[650px] object-cover" />
        </div>
        <div className="w-[50vw] flex items-center justify-center lg:p-0 p-6">
          <div className="flex flex-col space-y-4 lg:space-y-2">
            <span className="font-bold text-3xl font-sans">Waterproof Bags</span>
            <p className="font-sanz font-medium lg:text-lg">
              Explore waterproof bags from RAINS. The collection of bags <br />
              delivers a range of silhouettes developed for lifestyle needs.{" "}
            </p>
            <div>
              <Button className="w-36 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/unisex/bags"}>
                <span className="font-sans font-medium text-md">Explore</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="w-[50vw] flex items-center justify-center lg:p-0 p-6">
          <div className="flex flex-col space-y-4 lg:space-y-2">
            <span className="font-bold text-3xl font-sans">Accessories</span>
            <p className="font-sanz font-medium lg:text-lg ">
              Explore accessories from RAINS. Elevate your style simple <br />
              and easy to keep your outfits looking modern and timeless.
            </p>
            <div>
              <Button className="w-36 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/unisex/accessories"}>
                <span className="font-sans font-medium text-md">Explore</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:block hidden w-[50vw]">
          <img src={accessoriesexplore} alt="accessoriesexplore" className="w-full h-[450px] lg:h-[650px] object-cover" />
        </div>
        <div className="block lg:hidden w-[50vw]">
          <img src={accessoriesexploremobile} alt="accessoriesexplore" className="w-full h-[450px] lg:h-[650px] object-cover" />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="w-[50vw] hidden lg:flex items-end px-20 py-10" style={{ backgroundImage: `url(${menexplore})`, backgroundSize: "cover", height: "90vh" }}>
          <Button className="shadow-md shadow-gray-600 w-44 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/collections/men"}>
            <span className="font-sans font-medium text-md">Men Collections</span>
          </Button>
        </div>
        <div className="w-[50vw] hidden lg:flex items-end px-20 py-10" style={{ backgroundImage: `url(${womenexplore})`, backgroundSize: "cover", height: "90vh" }}>
          <Button className="shadow-md shadow-gray-600 w-44 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/collections/women"}>
            <span className="font-sans font-medium text-md">Women Collections</span>
          </Button>
        </div>
        {/* Mobile */}
        <div className="w-[50vw] lg:hidden flex items-end px-4 py-8" style={{ backgroundImage: `url(${menexploremobile})`, backgroundSize: "cover", height: "50vh" }}>
          <Button className=" shadow-md shadow-gray-600 w-44 p-2 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/collections/men"}>
            <span className="font-sans font-medium text-sm">Men Collections</span>
          </Button>
        </div>
        <div className="w-[50vw] lg:hidden flex items-end px-4 py-8" style={{ backgroundImage: `url(${womenexploremobile})`, backgroundSize: "cover", height: "50vh" }}>
          <Button className=" shadow-md shadow-gray-600 w-44 p-2 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/collections/women"}>
            <span className="font-sans font-medium text-sm">Women Collections</span>
          </Button>
        </div>
      </div>
      <div className="w-full hidden lg:flex items-end px-20 py-10" style={{ backgroundImage: `url(${unisexexplore})`, backgroundSize: "cover", height: "80vh" }}>
        <Button className=" shadow-md shadow-gray-600 w-44 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/collections/unisex"}>
          <span className="font-sans font-medium text-md">Unisex Collections</span>
        </Button>
      </div>
      {/* Mobile */}
      <div className="w-full lg:hidden flex items-end px-4 py-10" style={{ backgroundImage: `url(${unisexexploremobile})`, backgroundSize: "cover", height: "80vh" }}>
        <Button className=" shadow-md shadow-gray-600 w-44 p-2 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/collections/unisex"}>
          <span className="font-sans font-medium text-sm">Unisex Collections</span>
        </Button>
      </div>
      <Footer />
    </div>
  );
};
