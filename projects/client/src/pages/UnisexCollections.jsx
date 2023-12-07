import { Button } from "flowbite-react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function UnisexCollections() {
  useEffect(() => {
    // Scroll to the top when the component is first rendered
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full">
      <div className="flex items-end px-10 py-36 unisexparallax unisexbags">
        <Button className=" w-56 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/unisex/bags"}>
          <span className="font-sans font-medium text-md">Explore Bags</span>
        </Button>
        <div className="cta"></div>
      </div>
      <div className="flex items-end justify-end px-10 py-36 unisexparallax unisexaccessories">
        <Button className=" w-56 border border-gray-600" bg="white" color="light" size="md" as={Link} to={"/products/unisex/accessories"}>
          <span className="font-sans font-medium text-md">Explore Accessories</span>
        </Button>
        <div className="cta"></div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default UnisexCollections;
