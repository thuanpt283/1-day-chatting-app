import { useInfo } from "@/components/context/common";
import { findNameChannel, combinedData, findMessageNotError } from "@/components/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Message from "@/components/sections/Message";
import { useLazyQuery } from "@apollo/client";
import { GET_MESSAGES_LATEST } from "@/graphql/queries";
import type { InfoChat, MessageEnum } from "@/types";
import { API_METHODS } from "@/graphql/types";
import MessageForm from "@/components/sections/Message/Form";
import MoreMessages from "@/components/common/moreMessages.tsx";
import { useLoadMoreMessage } from "@/components/hook/useLoadMoreMessage";

const Chatbox = () => {
    const { channel, user } = useInfo();
    const titleChannel = useMemo(() => findNameChannel(channel), [channel]);
    const [fetchLastestMsg,{ loading: latestLoading, error: latestError}] = useLazyQuery(GET_MESSAGES_LATEST, {
        // pollInterval: 2000,
        variables: { channelId: channel },

    });
    const { loadMoreMessage} = useLoadMoreMessage();
    const [messagesList, setMessageList] = useState<MessageEnum[]>([])
    const endRef = useRef<HTMLDivElement | null>(null);
    const [infoChat, setInfoChat] = useState<InfoChat>({
        firstMsg: null,
        lastMsg: null,
    });

    const addMessage = async (msg: MessageEnum | undefined) => {
    if (!msg) return;
    const isError = msg.isError
    const LastSentMsg = findMessageNotError('l',[...messagesList])
    let result = await loadMoreMessage(LastSentMsg?.messageId, false) || [];
    if(!isError) result = result.length > 0 ? result.slice(0, -1) : result
    await onMoreMessages([...result, msg], false);
    }

    const scrollEnd = () => endRef.current?.scrollIntoView({ behavior: "auto" });

    const onMoreMessages = async (newMsg: MessageEnum[], isOld = false) => {
        if(!user) return
        const arrMerged =  await combinedData(newMsg, channel, user)
        if (arrMerged && Array.isArray(arrMerged)) {
            setMessageList(prev => isOld ? [...arrMerged, ...prev] : [...prev, ...arrMerged]);
            if(!isOld) scrollEnd()
        }
    }

    useEffect(() => {
        if(messagesList.length === 0) return
        setInfoChat(prev => ({
            firstMsg: prev.firstMsg && prev.firstMsg.datetime < findMessageNotError('f',messagesList).datetime
            ? prev.firstMsg
            : findMessageNotError('f',messagesList),
            lastMsg: prev.lastMsg && prev.lastMsg.datetime > findMessageNotError('l',messagesList).datetime
            ? prev.lastMsg
            : findMessageNotError('l',messagesList)
        }))
    }, [messagesList]);

    useEffect(() => {
        fetchLastestMsg().then(async({data}) => {
            if(!user) return
            const result = await combinedData(data?.[API_METHODS.MessagesFetchLatest], channel, user, true);
            if (result && Array.isArray(result)) {
                setMessageList(result);
            }
        })
    }, []);

    return (
        <div className="w-full md:w-2/3 px-2">
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between">
                <div className="mb-2 text-lg font-semibold text-blue-700">
                    {titleChannel}
                </div>
                <hr className="mb-2.5 border-gray-300" />
                <div className="h-[500px] overflow-y-auto">
                    {!user ? <p className="text-2xl">Please choose user</p> : (
                        <>
                            {latestLoading && <div>Loading...</div>}
                            {latestError && <div className="text-red-500">Error loading messages, try again</div>}
                            {!latestLoading && messagesList?.length === 0 ? <p>No message to display</p> : (
                                <ul className="space-y-4 flex-1 mb-4 mr-2">
                                    <li>
                                        <MoreMessages 
                                        isOld={true}
                                        msgId={infoChat.firstMsg?.messageId}
                                        onLoadMore={(newMessages) => onMoreMessages(newMessages, true)}
                                        >Previous Messages</MoreMessages>
                                    </li>
                                    {messagesList.map((msg: MessageEnum) => (
                                        <Message key={msg.messageId} msgObj={msg} isOwn={msg.userId === user} />
                                    ))}
                                    <li>
                                        <MoreMessages
                                        onLoadMore={(newMessages) => onMoreMessages(newMessages)}
                                        msgId={infoChat.lastMsg?.messageId}
                                        >Next Messages</MoreMessages>
                                    </li>
                                </ul>
                            )}
                        </>
                    )}
                    <div ref={endRef} />
                </div>
                {!latestLoading && <MessageForm onSend={addMessage} />}
            </div>
        </div>
    )
};

export default React.memo(Chatbox)