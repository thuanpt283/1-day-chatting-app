import { API_METHODS } from '@/graphql/types';

import { gql } from "@apollo/client";

export const POST_MESSAGE = gql`
	mutation PostMessage($channelId: ChannelId!, $text: String!, $userId: UserId!) {
		${API_METHODS.MessagePost}(channelId: $channelId, text: $text, userId: $userId) {
			messageId
			text
			datetime
			userId
		}
	}
`;
