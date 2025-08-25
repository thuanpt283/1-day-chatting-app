import { useInfo } from '@/components/context/common';
import { CHANNEL_LIST } from '@/enums/channel'
import type { ChannelId } from '@/types';
import classNames from 'classnames';

const Channels = () => {
    const { channel, setChannel, user } = useInfo();
    const optionClass = (channelId: ChannelId) => classNames('rounded p-2 cursor-pointer', {
        'font-semibold text-blue-700 bg-blue-100 mb-2': channelId === channel,
        'hover:bg-gray-100 ': channelId !== channel,
    });

    return (
        user && <> 
            <p className="mb-2 font-semibold">2. Choose your Channel</p>
            <ul>
                {CHANNEL_LIST.map(channel => (
                    <li className={optionClass(channel.id)} key={channel.id} onClick={() => {if(user) setChannel(channel.id)}}>
                        <span>{channel.name}</span>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Channels