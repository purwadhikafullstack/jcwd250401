import { useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from "react";

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

  // Check if the URL contains "products", and if so, skip the first segment
  const skipProducts = pathSegments[0] === "products";
  const segmentsToRender = skipProducts ? pathSegments.slice(1) : pathSegments;

  // Set the styles for the breadcrumb container
  const containerStyle = { display: 'flex', flexWrap: 'wrap' };

  // Define a media query for screen widths larger than 600px
  const isLargeScreen = window.innerWidth > 500; // You can adjust the threshold as needed

  // Define the maximum index to render based on the screen size
  const maxIndexToRender = isLargeScreen ? segmentsToRender.length : 3; // Show till the third segment in mobile view

  return (
    <Breadcrumb style={containerStyle}>
      <BreadcrumbItem>
        <BreadcrumbLink>
          <Link to={"/"} className="hover:underline">
            Home
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {segmentsToRender.slice(0, maxIndexToRender).map((segment, index, array) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link className="hover:underline" to={`/products/${array.slice(0, index + 1).join("/")}`}>
                {formatSegment(segment)}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {index < array.length - 1 && <span style={{ margin: '0 4px' }}>/</span>}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;