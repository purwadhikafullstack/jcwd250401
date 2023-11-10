import Sidebar from "../components/Sidebar";
import Navigationadmin from "../components/Navigationadmin";

function Product() {
  return (
    <div className="flex flex-row justify-start">
      <Sidebar />
      <div className="w-full">
        <Navigationadmin />
      </div>
    </div>
  );
}

export default Product;
