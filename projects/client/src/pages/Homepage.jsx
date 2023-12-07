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
      <Footer />
    </div>
  );
};
