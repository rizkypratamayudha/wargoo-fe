import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Fragment } from "react";

export default function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  const breadcrumbMap = {
    master: "Master",
    user: "User",
    account: "Account",
  };

  return (
    <Breadcrumb className={"mb-4"}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Main Menu</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.map((path, index) => (
          <Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === paths.length - 1 ? (
                <BreadcrumbPage>{breadcrumbMap[path] || path}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={`/${paths.slice(0, index + 1).join("/")}`}>
                    {breadcrumbMap[path] || path}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
