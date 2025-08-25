import type { MessageEnum } from "@/types";
import { type ReactNode } from "react";
import { useLoadMoreMessage } from "../hook/useLoadMoreMessage";

interface MoreMessagesProps {
    onLoadMore: (data: MessageEnum[]) => void;
    isOld?: boolean;
    msgId: string | undefined,
    children?: ReactNode;
}

const MoreMessages = ({ isOld = false, msgId, onLoadMore, children }: MoreMessagesProps) => {
    const { loadMoreMessage, moreLoading, moreError } = useLoadMoreMessage();
    return ( msgId &&
        <div className="relative">
            <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-2"
                onClick={() => loadMoreMessage(msgId, isOld, onLoadMore)}
            >
                {children}
            </button>
            {moreLoading && <p className=" absolute top-1/2 left-1/2 -translate-1/2">...Loading</p>}
            {moreError && <p className=" absolute top-1/2 left-1/2 -translate-1/2 text-red-400">Error loading more, try again!!!</p>}
        </div>
    );
};

export default MoreMessages;