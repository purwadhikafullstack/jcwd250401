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
  const skipProducts = pathSegments[0] === "products" || pathSegments[0] === "account";
  const segmentsToRender = skipProducts ? pathSegments.slice(1) : pathSegments;

  // Set the styles for the breadcrumb container
  const containerStyle = { display: "flex", flexWrap: "wrap" };

  // Define a media query for screen widths larger than 600px
  const isLargeScreen = window.innerWidth > 500; // You can adjust the threshold as needed

  // Define the maximum index to render based on the screen size
  const maxIndexToRender = isLargeScreen ? segmentsToRender.length : 3; // Show till the third segment in mobile view

  const unclickableSegments = ["men", "women", "unisex"];

  return (
    <Breadcrumb style={containerStyle}>
      <BreadcrumbItem>
        <BreadcrumbLink>
          <Link to={"/"}>
            <span className="hover:underline">Home</span>
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {segmentsToRender.slice(0, maxIndexToRender).map((segment, index, array) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            {index === array.length - 1 ? (
              <BreadcrumbLink isCurrentPage>
                <span>{formatSegment(segment)}</span>
              </BreadcrumbLink>
            ) : (
              <React.Fragment>
                {unclickableSegments.includes(segment.toLowerCase()) ? (
                  <span>{formatSegment(segment)}</span>
                ) : (
                  <BreadcrumbLink>
                    <Link className="hover:underline" to={`/products/${array.slice(0, index + 1).join("/")}`}>
                      {formatSegment(segment)}
                    </Link>
                  </BreadcrumbLink>
                )}
                <span style={{ margin: "0 6px" }}>/</span>
              </React.Fragment>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
