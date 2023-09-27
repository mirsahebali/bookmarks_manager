"use client";

import { WorkspaceAndBoards } from "@/schema/workspace";
import { Board } from "@/schema/board";
import { useCreate } from "./mutations";
import { useFetch } from "./queries";
import { useEffect, useState } from "react";

export function useSidebarDataHandle() {
  const workspaceData = useFetch<WorkspaceAndBoards[]>("read", "workspace");
  const defaultId = window.localStorage.getItem("defaultWs");
  const [defaultWorkspace, setDefaultWorkspace] = useState(
    workspaceData.data?.find((workspace) => workspace.id === defaultId) ||
      workspaceData.data?.at(0),
  );

  const boardData = useFetch<Board[]>(defaultWorkspace?.id!, "board", false);
  const [board, setBoard] = useState({ name: "", icon: "🔖" });
  // const [boards, setBoards] = useState(
  //   boardData.data ||
  //     workspaceData.data?.find((workspace) => workspace.id === defaultId)
  //       ?.boards,
  // );
  const [boards, setBoards] = useState(boardData.data);
  const createBoard = useCreate<
    Board,
    { name: string; icon: string; workspaceId: string }
  >(
    "board",
    {
      name: board.name,
      icon: board.icon,
      workspaceId: defaultWorkspace?.id!,
    },
    "create",
    { parentType: "board", id: defaultWorkspace?.id },
    boardData.data,
  );

  useEffect(() => {
    setDefaultWorkspace(
      workspaceData.data?.find((workspace) => workspace.id === defaultId),
    );
    // if (createBoard.isSuccess) {
    //   const b = Array.from(boardData.data!);
    //   setBoards([...b, createBoard.data!]);
    // }
    // if (boardData.isSuccess) {
    //   setBoards(boardData.data!);
    // }
    setBoards(boardData.data);
  }, [
    defaultWorkspace,
    defaultId,
    workspaceData.data,
    boardData.data,
    createBoard,
  ]);

  return {
    defaultWorkspace,
    setDefaultWorkspace,
    board,
    setBoard,
    createBoard,
    boardData,
    workspaceData,
    boards,
  };
}
