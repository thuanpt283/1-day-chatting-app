import { POST_MESSAGE } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInfo } from "@/components/context/common";
import { API_METHODS } from "@/graphql/types";
import type { ChannelId, ErrMessageRecord, MessageEnum, UserId } from "@/types";
import { db } from "@/services/dexie";
import { debounce, getCurrentTimeUTC } from "@/components/utils";

interface MessageFormProps {
    onSend?: (args: MessageEnum) => void;
}

const MessageForm = ({ onSend }: MessageFormProps) => {
    const [message, setMessage] = useState('');
    const { channel, user } = useInfo();
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const [postMessage, { loading, data }] = useMutation(POST_MESSAGE);

    const saveDraft = useCallback(
        debounce(async (channelId: ChannelId, text: string, userId: UserId) => {
            await db.table("drafts").put({text, userId, channelId });
        }, 600), // debounce 600ms
        []
    );

    const handleSubmitMessage = async () => {
        if (!message.trim() || !channel || !user) return;
        try {
            await postMessage({
                variables: {
                    channelId: channel,
                    text: message,
                    userId: user,
                },
            });
        } catch (e) {
            // Optionally handle error
            if (e instanceof Error) {
                console.log(e.message)
            } else {
                console.log(e)
            }
            const msgObj = {
                messageId: crypto.randomUUID(),
                userId: user,
                text: message,
                datetime: getCurrentTimeUTC(),
                isError: true,
                channel
            }
            if (onSend) {
                onSend(msgObj)
                addErrorMessage(msgObj)
            }
        }
        setMessage('');
        textAreaRef.current?.focus()
        await db.table("drafts").delete(user);
    }

    const addErrorMessage = async (msgObj: ErrMessageRecord) => {
        try {
            await db.messages.add(msgObj);
        } catch (error) {
            console.error("Failed to add user:", error);
        }
    };

    useEffect(() => {
        if (onSend && data) {
            onSend(data && data[API_METHODS.MessagePost] || undefined);
        }
    }, [data]);

    useEffect(() => {
        if(!user) return
        if (message.trim() !== "") {
            saveDraft(channel, message, user);
        }
    }, [message, channel, saveDraft]);

    useEffect(() => {
        if (user) {
            db.table("drafts").get(user).then((draft) => {
                if (!draft) return;
                const { channelId, text } = draft;
                if (channelId === channel && typeof text === "string") setMessage(text);
            });
        }
    }, [user]);

    return (
        <div className="mt-3 flex gap-2">
            <textarea
                ref={textAreaRef}
                id='input-message'
                name='input-message'
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                rows={3}
                placeholder="Type your message here..."
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const msg= e.target.value
                    setMessage(msg)
                    if(msg.length === 0 && user) {
                        db.table("drafts").delete(user);
                    }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === "Enter" && e.shiftKey) {
                        e.preventDefault();
                        handleSubmitMessage();
                    }
                }}
                disabled={loading}
            ></textarea>
            <button
                type="button"
                onClick={handleSubmitMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
                disabled={loading || !message.trim()}
            >
                {loading ? 'Sending...' : 'Send Message'} <i className="fa fa-send"></i>
            </button>
        </div>
    )
}

export default MessageForm