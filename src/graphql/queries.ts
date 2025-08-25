
import { gql } from '@apollo/client';
import { API_METHODS } from './types';

 const GET_MESSAGES_LATEST = gql`
    query getMessage($channelId: ChannelId!) {
  ${[API_METHODS.MessagesFetchLatest]}(channelId: $channelId) {
        messageId
        text
        datetime
        userId
        isError @client
    }
    }
`;


 const GET_MESSAGES_MORE = gql`
    query MessagesFetchMore($channelId: ChannelId!, $messageId: String!, $old: Boolean!) {
        MessagesFetchMore(channelId: $channelId, messageId: $messageId, old: $old) {
            messageId
            text
            datetime
            userId
        }
    }
`;

export {
    GET_MESSAGES_LATEST,
    GET_MESSAGES_MORE,
}