import React from "react";

import loadingImg from "./assets/loading.gif";
import logo from "./assets/logo.svg";
import noPersonImg from "./assets/no-person-photo.png";
import { FiSearch, FiChevronLeft } from "react-icons/fi";

import { MobileNavBar } from "./layout/MobileNavBar";
import { NavBar } from "./layout/NavBar";
import { Footer } from "./layout/Footer";

interface IShow {
  id: string;
  name: string;
  summary: string;
  image: {
    original: string;
    medium: string;
  };
  premiered: string;
  _embedded: {
    cast: Array<ICastMember>;
  };
}

interface ICastMember {
  person: {
    name: string;
    image: {
      medium: string;
    };
  };
  character: {
    name: string;
  };
}

export default function App(): JSX.Element {
  const [query, setQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [hasSearched, setHasSearched] = React.useState<boolean>(false);
  const [shows, setShows] = React.useState<Array<IShow>>([]);
  const [show, setShow] = React.useState<IShow | null>(null);
  const [isShowSearch, setIsShowSearch] = React.useState<boolean>(true);

  function onQueryChange(nextQuery: string): void {
    setHasSearched(false);
    setQuery(nextQuery);
    setShows([]);
    setShow(null);
    setError("");
  }

  function onSearch(e: React.MouseEvent): void {
    e.preventDefault();
    setHasSearched(false);
    setIsLoading(true);
    setShows([]);
    setShow(null);
    setError("");

    fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
      .then((r: Response) => r.json())
      .then((json: Array<{ show: IShow }>) => {
        setHasSearched(true);
        setIsLoading(false);
        setShows(json.map((r) => r.show));
      })
      .catch(() => {
        setIsLoading(false);
        setError("Could not load shows.");
      });
  }

  function onSelectShow(show: IShow): void {
    setIsLoading(true);
    setError("");

    fetch(`https://api.tvmaze.com/shows/${show.id}?embed=cast`)
      .then((r: Response) => r.json())
      .then((json: IShow) => {
        setIsLoading(false);
        setShow(json);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Could not load show details.");
      });
  }

  const onToggleSearchBar = () => {
    setIsShowSearch(!isShowSearch);
  };

  return (
    <div className="relative min-h-screen">
      <main className="w-full max-w-6xl md:mx-auto py-16 px-4">
        <MobileNavBar />
        {isShowSearch && (
          <>
            <img className="w-52 md:w-72 mx-auto" alt={"logo"} src={logo} />
            <form className="relative w-full md:max-w-xl mx-auto">
              <FiSearch
                size={"1.5rem"}
                className={"absolute top-3 left-3.5 text-primary"}
              />
              <input
                type="serach"
                autoFocus
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Enter the name of a TV show..."
                className="border border-primary w-full h-12 pl-12 text-sm md:text-base outline-none rounded-md tracking-wider md:tracking-wide"
              />
              <button
                type="submit"
                className="w-20 md:w-32 h-12  rounded-tr-md rounded-br-md 
                         bg-secondary hover:bg-third 
                           absolute top-0 -right-0.5"
                onClick={onSearch}
              >
                <span className="text-sm md:text-base font-bold text-white tracking-wider md:tracking-wide">
                  Search
                </span>
              </button>
              {hasSearched && query && (
                <div className="text-sm tracking-wider md:tracking-wide pt-2">
                  <span className="text-secondary ">{shows.length}</span>
                  <span>
                    &nbsp;results for
                    <span className="text-secondary">&nbsp;"{query}"</span>
                  </span>
                </div>
              )}
            </form>
          </>
        )}
        {error && (
          <div className="text-red-500 text-sm md:text-base tracking-wider md:tracking-wide">
            {error}
          </div>
        )}

        <Loading isLoading={isLoading}>
          {show ? (
            <Show
              show={show}
              onCancel={() => {
                setShow(null);
                setIsShowSearch(!isShowSearch);
              }}
            />
          ) : (
            <ShowList
              shows={shows}
              onSelectShow={onSelectShow}
              onToggleSearchBar={onToggleSearchBar}
            />
          )}
        </Loading>
      </main>
      <Footer />
    </div>
  );
}

function Loading({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactChild;
}): JSX.Element {
  return isLoading ? (
    <img
      className="w-8 h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      alt="{Loading Image}"
      src={loadingImg}
    />
  ) : (
    <>{children}</>
  );
}

function ShowList({
  shows,
  onSelectShow,
  onToggleSearchBar,
}: {
  shows: Array<IShow>;
  onSelectShow: (show: IShow) => void;
  onToggleSearchBar: () => void;
}): JSX.Element {
  return (
    <>
      <NavBar />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-2 md:gap-12 py-8 md:py-12 md:px-12">
        {shows.map((show, index) => {
          // eslint-disable-next-line
          if (show.image === null) return;
          return (
            <div
              key={show.id}
              className={`w-40 md:w-52 
                         ${index === shows.length - 1 && ""}`}
              onClick={() => {
                onSelectShow(show);
                onToggleSearchBar();
              }}
            >
              <div className={"flex flex-col gap-4"}>
                <img
                  className="w-full hover:scale-105 transition ease-out duration-300 rounded-md"
                  src={show.image.medium}
                  alt={`Show_${show.id}`}
                />
                <span className="text-center text-sm md:text-base font-bold tracking-wider md:tracking-wide">
                  {show.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Show({
  show,
  onCancel,
}: {
  show: IShow;
  onCancel: () => void;
}): JSX.Element {
  const cast = show._embedded.cast;

  return (
    <div className="py-6 md:pt-0 pb-8">
      <button onClick={onCancel} className="flex items-center gap-2 mb-6">
        <div className="hidden md:block">
          <FiChevronLeft size={"2rem"} />
        </div>
        <div className="block md:hidden">
          <FiChevronLeft size={"1.5rem"} />
        </div>
        <span className="text-sm md:text-base tracking-wider md:tracking-wide">
          Back to list
        </span>
      </button>
      <div>
        <div className="md:flex gap-6 xl:gap-8">
          <div className="mb-6 w-full md:max-w-[350px] flex-1">
            {show.image && (
              <img
                className={"w-full"}
                src={show.image.original}
                alt="show_image"
              />
            )}
          </div>
          <div className="tracking-wider md:tracking-wide flex-1">
            <h2 className="text-2xl font-bold mb-1">{show.name}</h2>
            <div className="text-sm md:text-base font-light mb-2">
              {show.premiered
                ? "Premiered " + show.premiered
                : "Yet to premiere"}
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: show.summary }}
              className="mb-6 tracking-wider md:tracking-wide leading-6"
            />
          </div>
        </div>
        <div>
          <div className="mb-6">
            <h3 className="font-bold text-xl md:text-2xl tracking-wider md:tracking-wide">
              Cast
            </h3>
            <div className="bg-third w-11 h-1"></div>
          </div>
          <ul
            className="grid grid-cols-2 md:grid-cols-4 gap-6
                       tracking-wider md:tracking-wide"
          >
            {cast.map((member: ICastMember) => (
              <li key={member.character.name}>
                <CastMember member={member} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CastMember({ member }: { member: ICastMember }): JSX.Element {
  return (
    <div className="">
      {member.person.image === null && (
        <img
          className="w-full h-72 object-cover rounded-md"
          src={noPersonImg}
          alt="no-person-img"
        />
      )}
      {member.person.image && (
        <img
          className="w-full h-72 object-cover object-top rounded-md"
          src={member.person.image.medium}
          alt=""
        />
      )}
      <div className="text-sm md:text-base mt-2 text-center">
        <strong>{member.person.name}</strong>&nbsp;as&nbsp;
        <span>{member.character.name}</span>
      </div>
    </div>
  );
}
