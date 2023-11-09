import Navigationbar from "../components/Navigationbar";
import { Carousel, Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsTiktok } from "react-icons/bs";
import img1 from "../assets/image-1.jpg";
import img2 from "../assets/image-2.jpg";
import img3 from "../assets/image-3.jpg";
import img4 from "../assets/image-4.jpg";
import img5 from "../assets/image-5.jpg";
import img6 from "../assets/image-6.jpg";
import img7 from "../assets/image-7.jpeg";

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

      <Footer>
        <div className="w-full">
          <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
            <div>
              <Footer.Title title="Service" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Help Center</Footer.Link>
                <Footer.Link href="#">Contact</Footer.Link>
                <Footer.Link href="#">Shipping</Footer.Link>
                <Footer.Link href="#">Returns</Footer.Link>
                <Footer.Link href="#">Warranty</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Company" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">About</Footer.Link>
                <Footer.Link href="#">Careers</Footer.Link>
                <Footer.Link href="#">Press</Footer.Link>
                <Footer.Link href="#">Image bank</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Social" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://www.instagram.com/rains/">Instagram</Footer.Link>
                <Footer.Link href="https://www.facebook.com/Rainsjournal/">Facebook</Footer.Link>
                <Footer.Link href="https://www.tiktok.com/@rains">TikTok</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Shipping to" />
              <Footer.LinkGroup col>
                <p>Rest of the world</p>
              </Footer.LinkGroup>
            </div>
          </div>
          <div className="w-full bg-gray-700 px-4 py-6 sm:flex sm:items-center sm:justify-between">
            <div className="flex text-sm">
              <Footer.Copyright href="#" by="Rains 2023.All rights reserved" />
              <p className="text-gray-500 cursor-pointer mr-5 ml-5">Terms &amp; Conditions</p>
              <p className="text-gray-500 cursor-pointer mr-5">Privacy Policy</p>
              <p className="text-gray-500 cursor-pointer">Cookie Policy</p>
            </div>
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <Footer.Icon href="#" icon={BsFacebook} />
              <Footer.Icon href="https://www.instagram.com/rains/" icon={BsInstagram} />
              <Footer.Icon href="#" icon={BsTiktok} />
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
};
