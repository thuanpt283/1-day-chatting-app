import { useLazyQuery } from "@apollo/client";
import { useInfo } from "../context/common";
import { client } from "@/services/apolloClient";
import { GET_MESSAGES_LATEST, GET_MESSAGES_MORE } from "@/graphql/queries";
import { API_METHODS } from "@/graphql/types";
import type { MessageEnum } from "@/types";

export function useLoadMoreMessage() {
    const { channel } = useInfo();
    const [MessagesFetchMore, { loading: moreLoading, error: moreError, refetch }] = useLazyQuery(GET_MESSAGES_MORE, {
        onCompleted: (newData) => {
            if (!newData || !newData[API_METHODS.MessagesFetchMore]) return;
            client.cache.updateQuery(
                {
                    query: GET_MESSAGES_LATEST,
                    variables: { channelId: channel },
                },
                (existingData) => {
                    if (!existingData || !existingData[API_METHODS.MessagesFetchLatest]) return;
                    return {
                        [API_METHODS.MessagesFetchLatest]: [
                            ...existingData[API_METHODS.MessagesFetchLatest],
                            ...newData[API_METHODS.MessagesFetchMore],
                        ],
                    };
                }
            );
        },
    });

    const loadMoreMessage = async (
        msgId: string | undefined,
        isOld: boolean,
        onLoadMore?: (data: MessageEnum[]) => void
    ) => {
        if (moreLoading) return;
        if (!msgId) return [];
        return new Promise<MessageEnum[]>(async (resolve, reject) => {
            try {
                await MessagesFetchMore({
                    variables: {
                        channelId: channel,
                        messageId: msgId,
                        old: isOld,
                    },
                    fetchPolicy: "network-only",
                    onCompleted: (newData) => {
                        const arr = newData?.[API_METHODS.MessagesFetchMore] || [];
                        if (arr.length === 0 && !isOld) refetch();
                        if (onLoadMore) onLoadMore(arr);
                        resolve(arr);
                    },
                    onError: (err) => {
                        reject(err);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    };
    return { loadMoreMessage, moreLoading, moreError };
}
