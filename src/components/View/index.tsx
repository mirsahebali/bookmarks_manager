"use client";
import { BiGridAlt } from "@react-icons/all-files/bi/BiGridAlt";
import { MdFormatListBulleted } from "@react-icons/all-files/md/MdFormatListBulleted";
import { BsFillEyeFill } from "@react-icons/all-files/bs/BsFillEyeFill";
import { useContext, useState } from "react";
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuList,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

import { ListPrefContext } from "../context/ListPrefContext";
export default function Views() {
  const [selected, setSelected] = useState("list");
  const { listPrefs, setListPrefs } = useContext(ListPrefContext);

  return (
    <Menu>
      <MenuButton
        as={Box}
        bg={"silver"}
        textColor={"slategray.900"}
        w={"fit-content"}
        p={1}
        rounded={"md"}
      >
        <MdFormatListBulleted />
      </MenuButton>
      <MenuList p={4} h={"37vh"}>
        <MenuGroup>
          View
          <p className="text-xs">Choose any view you want</p>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <RadioGroup
            onChange={setSelected}
            defaultValue={"list"}
            value={selected}
          >
            {views.map((view, index) => {
              return (
                <div
                  key={view.value}
                  onClick={() => {
                    setListPrefs({
                      ...listPrefs,
                      view: view.value,
                    });
                    setSelected(view.value);
                  }}
                  className={`flex justify-between p-2 hover:text-[#422AFB] duration-200 ${
                    selected === view.value ? "text-[#422AFB]" : ""
                  }`}
                >
                  <Flex cursor={"pointer"} alignItems={"center"}>
                    {view.icon}
                    {view.title}
                  </Flex>{" "}
                  <Radio value={view.value} />
                </div>
              );
            })}
          </RadioGroup>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <div className="flex float-right gap-5 mt-3">
            <button className="duration-300 hover:text-red-900">Reset</button>
            <button className="bg-[#422AFB] py-2 rounded-full px-9 text-white hover:bg-blue-600 duration-300">
              Apply
            </button>
          </div>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
const views: {
  title: string;
  value: "list" | "card" | "icon";
  icon: JSX.Element;
  selected: boolean;
}[] = [
  {
    title: "List View",
    value: "list",
    icon: <MdFormatListBulleted />,
    selected: false,
  },
  {
    title: "Card View",
    value: "card",
    icon: <BiGridAlt />,
    selected: false,
  },
  {
    title: "Icon View",
    value: "icon",
    icon: <BsFillEyeFill />,
    selected: false,
  },
];
