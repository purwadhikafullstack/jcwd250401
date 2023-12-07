import { Carousel } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTiktok } from "react-icons/bs";
import img1 from "../assets/image-1.jpg";
import img2 from "../assets/image-2.jpg";
import img3 from "../assets/image-3.jpg";
import img4 from "../assets/image-4.jpg";
import img5 from "../assets/image-5.jpg";
import img6 from "../assets/image-6.jpg";
import img7 from "../assets/image-7.jpeg";
import Footer from "../components/Footer";
import bagexplore from "../assets/bagexplore.jpg";
import accessoriesexplore2 from "../assets/accessoriesexplore2.png";
import menexplore from "../assets/menexplore.jpg";
import womenexplore from "../assets/womenexplore.jpg";

import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Homepage = () => {
  const imgListMobile = [img1, img2, img3];
  const imgListDesktop = [img4, img5, img6, img7];
  return (
    <div className="min-h-screen font-sagoe">
      <div className="h-[95vh] w-full lg:hidden">
        <Carousel indicators={false} style={{ borderRadius: 0 }} className="enabled:rounded-none">
          {imgListMobile.map((img, index) => (
            <img key={index} src={img} alt={img} className="rounded-none" />
          ))}
        </Carousel>
      </div>
      <div className="h-[95vh] w-full">
        <div className="h-[95vh] w-full">
          <Carousel indicators={false} style={{ borderRadius: 0 }} className="enabled:rounded-none">
            {imgListDesktop.map((img, index) => (
              <div key={index} style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", height: "95vh" }} className="background-image"></div>
            ))}
          </Carousel>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="w-[50vw]">
          <img src={bagexplore} alt="bagexplore" className="w-full h-[650px] object-cover" />
        </div>
        <div className="w-[50vw] flex items-center justify-center">
          <div className="flex flex-col space-y-2">
            <span className="font-bold text-3xl font-sans">Waterproof Bags</span>
            <p className="font-sanz font-medium text-lg">
              Explore waterproof bags from RAINS. The collection of bags <br />
              delivers a range of silhouettes developed for lifestyle needs.{" "}
            </p>
            <div>
              <Button className="w-36 border border-gray-600" bg="white" color="light" size="md"
              as={Link} to={"/products/unisex/bags"}>
                <span className="font-sans font-medium text-md">Explore</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="w-[50vw] flex items-center justify-center">
          <div className="flex flex-col space-y-2">
            <span className="font-bold text-3xl font-sans">Accessories</span>
            <p className="font-sanz font-medium text-lg">
              Explore accessories from RAINS. Elevate your style simple <br />
              and easy to keep your outfits looking modern and timeless.
            </p>
            <div>
              <Button className="w-36 border border-gray-600" bg="white" color="light" size="md"
              as={Link} to={"/products/unisex/accessories"}>
                <span className="font-sans font-medium text-md">Explore</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="w-[50vw]">
          <img src={accessoriesexplore2} alt="accessoriesexplore" className="w-full h-[650px] object-cover" />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="w-[50vw] flex items-end px-20 py-16" style={{ backgroundImage: `url(${menexplore})`, backgroundSize: "cover", height: "80vh" }}>
          <Button className="shadow-md shadow-gray-600 w-36 border border-gray-600" bg="white" color="light" size="md"
          as={Link} to={"/collections/men"}>
            <span className="font-sans font-medium text-md">Men's</span>
          </Button>
        </div>
        <div className="w-[50vw] flex items-end px-20 py-16" style={{ backgroundImage: `url(${womenexplore})`, backgroundSize: "cover", height: "80vh" }}>
          <Button className=" shadow-md shadow-gray-600 w-36 border border-gray-600" bg="white" color="light" size="md"
         as={Link} to={"/collections/women"}>
            <span className="font-sans font-medium text-md">Women's</span>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
