import { formatTime } from "@/components/utils";
import type { MessageEnum } from "@/types";
import classNames from "classnames";
import React from "react";

interface ChatType {
  msgObj: MessageEnum & { isError?: boolean };
  isOwn?: boolean;
}

const Message = ({ msgObj, isOwn }: ChatType) => {
  return (
    <li className={classNames("flex", { "flex-row-reverse": isOwn })}>
      <div className={classNames({ "ml-3": isOwn, "mr-3": !isOwn })}>
        <img
          src={`src/assets/img/${msgObj.userId}.png`}
          alt="User"
          className="w-10 h-10 rounded-full"
        />
        <div className={classNames("text-xs text-center", { "ml-1": isOwn })}>
          {msgObj.userId}
        </div>
      </div>
      <div>
        <div
          className={classNames(
            "rounded px-3 py-2 shadow border whitespace-pre-line",
            {
              "bg-blue-500 text-white border-blue-500": isOwn && !msgObj?.isError,
              "bg-white border-gray-200": !isOwn && !msgObj?.isError,
              "bg-red-100 text-red-700 border-red-300": msgObj?.isError
            }
          )}
        >
          {msgObj.text}
        </div>
        <div
          className={classNames("text-xs text-gray-500", {
            "text-right mb-1": isOwn,
          })}
        >
          {formatTime(msgObj.datetime)}
          {isOwn && (
              <span className="ml-1"> {msgObj.isError ? "Error" : "Sent"}</span>
          )}
        </div>
      </div>
    </li>
  );
};

export default React.memo(Message);
