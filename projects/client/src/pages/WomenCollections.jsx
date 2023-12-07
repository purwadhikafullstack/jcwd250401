import { Button } from "flowbite-react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function WomenCollections() {
  useEffect(() => {
    // Scroll to the top when the component is first rendered
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full">
      <div className="flex items-end px-10 py-36 womenparallax womenjackets">
        <Button className=" w-56 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/women/jackets"}>
          <span className="font-sans font-medium text-md">Explore Women's Jackets</span>
        </Button>
        <div className="cta"></div>
      </div>
      <div className="flex items-end justify-end px-10 py-36 womenparallax womentops">
        <Button className=" w-56 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/women/tops"}>
          <span className="font-sans font-medium text-md">Explore Women's Tops</span>
        </Button>
        <div className="cta"></div>
      </div>
      <div className="flex items-end px-10 py-36 womenparallax womenbottom">
        <Button className=" w-56 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/women/bottom"}>
          <span className="font-sans font-medium text-md">Explore Women's Bottoms</span>
        </Button>
        <div className="cta"></div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default WomenCollections;
