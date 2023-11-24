import { useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatSegment = (segment) => {
  const words = segment.split("-");
  const capitalizedWords = words.map((word) => capitalize(word));
  return capitalizedWords.join(" ");
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter((segment) => segment !== "");

  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link to={"/"} className="hover:underline">
          Home
        </Link>
      </BreadcrumbItem>
      {pathSegments.map((segment, index, array) => (
        <BreadcrumbItem key={index} isCurrentPage={index === array.length - 1}>
          {index === 0 ? (
            <span>{formatSegment(segment)}</span>
          ) : (
            <BreadcrumbItem>
              <Link className="hover:underline" to={`/${array.slice(0, index + 1).join("/")}`}>
                {formatSegment(segment)}
              </Link>
            </BreadcrumbItem>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
