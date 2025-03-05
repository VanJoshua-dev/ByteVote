import React from "react";
import { Link } from "react-router-dom"; // Use Link if using React Router

const BreadCrumb = ({ items = [] }) => {
  return (
    <nav
      className="flex px-5 py-3  border-none w-60  rounded-lg"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index !== 0 && (
              <svg
                className="rtl:rotate-180 block w-3 h-3 mx-1 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            )}
            {item.path ? (
              <Link
                to={item.path}
                className="text-sm font-medium text-white hover:text-blue-600"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-white ">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
