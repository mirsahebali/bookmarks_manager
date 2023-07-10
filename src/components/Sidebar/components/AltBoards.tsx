"use client";
import { Spinner } from "@chakra-ui/react";
import { Disclosure, Transition } from "@headlessui/react";
import Link from "next/link";
import { BsChevronDown } from "react-icons/bs";
import { useEffect } from "react";
import { useFetchData } from "@/functions/queries";
import { useAppSelector } from "@/store/hooks";
export default function AltBoards() {
  const wsId = useAppSelector((state) => state.workspace.id);
  const {
    data: boards,
    isLoading,
    isError,
    isSuccess,
    isFetching,
    refetch,
    error,
    isLoadingError,
    isStale,
  } = useFetchData("boards", wsId, false);
  useEffect(() => {
    refetch();
  }, [wsId, refetch]);
  if (isError || isLoadingError) {
    console.error(error);
  }
  if (isLoading ) {
    return <Spinner />;
  }
  if (isSuccess && isStale)
    return (
      <Disclosure>
        {({ open, close }) => (
          <div className="flex-col flex gap-2">
            <Disclosure.Button className={"flex justify-around items-center gap-3"}>
              <span>Boards</span>
              <BsChevronDown
                className={`${
                  open ? "rotate-180 " : "rotate-0 "
                } transform  transition-all duration-300 font-bold `}
              />
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition ease-out duration-300"
              enterFrom="transform opacity-0 "
              enterTo="transform opacity-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 "
              leaveTo="transform opacity-0 "
            >
              <Disclosure.Panel as={`div`} className={`flex flex-col text-l gap-2`}>
                {boards?.boards
                  ?.filter((x: { isDeleted: Boolean }) => !x.isDeleted)
                  ?.map((board: { id: string; name: string }) => (
                    <Link
                      key={board.id}
                      as={`/home/board/${board.id}`}
                      href={`/home/board/${board.id}`}
                    >
                      {board.name}
                    </Link>
                  ))}
              </Disclosure.Panel>
            </Transition>
          </div>
        )}
      </Disclosure>
    );
}
