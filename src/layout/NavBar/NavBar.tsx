import { useState } from "react";

interface NavBarItemState {
  name: string;
  href: string;
  currentState: boolean;
}

interface NavBarItemPropType extends NavBarItemState {
  onClickHandler: () => void;
}

const NavBarItem = ({
  name,
  href,
  currentState,
  onClickHandler,
}: NavBarItemPropType) => {
  return (
    <a href={href}>
      <li
        className={`px-4 py-2 ${
          currentState &&
          "bg-primary text-white pointer-events-none"
        } active:bg:text-white rounded-md cursor-pointer"`}
        onClick={onClickHandler}
      >
        {name}
      </li>
    </a>
  );
};

const navItems: NavBarItemState[] = [
  { name: "Shows", href: "#", currentState: true },
  { name: "Actors", href: "#", currentState: false },
  { name: "Articles", href: "#", currentState: false },
];

export const NavBar = () => {
  const [navBarState, setNavBarState] = useState<NavBarItemState[]>(navItems);
  const currentStateHandler = (n: NavBarItemState) => {
    setNavBarState((prevState) => {
      return prevState.map((navBarState) => ({
        ...navBarState,
        currentState: navBarState.name === n.name,
      }));
    });
  };

  return (
    <>
      <nav
        className="h-full hidden md:flex justify-center items-center gap-12
                   list-none tracking-wider md:tracking-wide mt-8
                 "
      >
        {navBarState.map((n) => (
          <NavBarItem
            key={n.name}
            name={n.name}
            href={n.href}
            currentState={n.currentState}
            onClickHandler={() => currentStateHandler(n)}
          />
        ))}
      </nav>
      <hr className="mt-8 md:mt-6 hidden md:block" />
    </>
  );
};
