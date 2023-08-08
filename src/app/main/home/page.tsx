//The inbox page i.e. the page which is a single default board like model for a each workspace
"use client";
import { useState } from "react";
import AddClass from "@/components/Create/create";
import { useAddTabsToInbox } from "@/functions/mutations";
import { useFetchData } from "@/functions/queries";
import UserTabs from "@/components/Tabs";
import { useAppSelector } from "@/store/hooks";
import { InboxWithTabs } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Page({ params }: { params: { id: string } }) {
  const { status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  //Get's the inbox id from the custom and typesafe useSelector hook to perform get operation
  const inboxId = useAppSelector((state) => state.workspace.inboxId);
  const id = params.id;
  //Add a new tab to the inbox using the custom hook useAddTabsToInbox make using useMutation
  const {
    mutateAsync: createTab,
    isLoading: isCreateTabLoading,
    isSuccess,
  } = useAddTabsToInbox(inboxId, name);
  //Get's the inbox data from the custom useFetchData hook
  const {
    data: inbox,
    isLoading: isTabsLoading,
    isError: isTabsError,
    error: tabsError,
    isSuccess: isTabSuccess,
    isStale: isTabStale,
  } = useFetchData<InboxWithTabs>("inbox", inboxId, false);
  //Sends the user to the login page if the user is not authenticated
  if (status === "unauthenticated") {
    router.push("/user/auth/signin");
  }
  //return error on screen
  if (isTabsError) return <pre>{JSON.stringify(tabsError)}</pre>;
  //Returns this view when a board is Empty
  if (isTabSuccess && isTabStale) {
    if (inbox?.tabs?.length === 0) {
      return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div>Empty...</div>
          <AddClass
            add_edit={"Add a"}
            isLoading={isCreateTabLoading}
            category="tab"
            placeholder="Add a tab"
            buttonStyles="bg-blue-500 p-2"
            positionStyles=""
            onSubmit={createTab}
            onChange={(e) => setName(e.target.value)}
            isSuccess={isSuccess}
          />
        </div>
      );
    }

    //Returns this view when a board contains tabs with data
    return (
      <div>
        <div id="tabs">
          <UserTabs
            type="inbox"
            boardId={inboxId}
            variant="unstyled"
            key={id}
            id={id}
            tabs={inbox?.tabs}
            isTabsError={isTabsError}
            isTabSuccess={isTabSuccess}
            isTabStale={isTabStale}
            isTabsLoading={isTabsLoading}
            tabsError={tabsError}
          />
        </div>
      </div>
    );
  }
}
