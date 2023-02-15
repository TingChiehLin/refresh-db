import { useState } from "react";

import { FiX, FiAlignJustify } from "react-icons/fi";

interface NavBarItemPropType {
  name: string;
  href: string;
}

const MobileNavItem = ({ name, href }: NavBarItemPropType) => {
  return (
    <a href={href}>
      <li className="text-xl text-white font-bold cursor-pointer">
        <span>{name}</span>
      </li>
    </a>
  );
};

const navItems = [
  { name: "Shows", href: "#" },
  { name: "Actors", href: "#" },
  { name: "Articles", href: "#" },
];

export const MobileNavBar = () => {
  const [currentState, setCurrentState] = useState<boolean>(false);

  const toggleHandler = () => setCurrentState(!currentState);

  return (
    <>
      {currentState && (
        <div
          className={`fixed inset-0 z-10 bg-secondary
                      transition ease-in-out duration-500
                      ${currentState ? "bg-opacity-30" : "bg-opacity-0"}
                    `}
          onClick={toggleHandler}
        ></div>
      )}
      <nav
        className={`w-full h-1/2
                  fixed top-0 left-0 z-20
                  transition ease-in-out duration-500 
                  bg-primary md:hidden
                  ${currentState ? "-translate-y-1/3" : "-translate-y-[85%]"}`}
      >
        {currentState ? (
          <div className="absolute bottom-3 left-4 cursor-pointer">
            <FiX size={"2rem"} color="white" onClick={toggleHandler} />
          </div>
        ) : (
          <div className="absolute bottom-3 left-4 cursor-pointer">
            <FiAlignJustify
              size={"2rem"}
              color="white"
              onClick={toggleHandler}
            />
          </div>
        )}
        <ul className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-2/3 tracking-wider">
          <div className="flex items-center gap-4 flex-col">
            {navItems.map((n) => (
              <MobileNavItem key={n.name} name={n.name} href={n.href} />
            ))}
          </div>
        </ul>
      </nav>
    </>
  );
};
