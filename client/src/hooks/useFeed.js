import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '../lib/socket';

export function useFeed(school) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!school) return;
    const socket = getSocket();

    socket.emit('feed:join', school);

    function onNewListing({ listing }) {
      queryClient.setQueryData(['listings'], (old) =>
        old ? [listing, ...old] : [listing]
      );
    }

    socket.on(`feed:${school}`, onNewListing);
    return () => socket.off(`feed:${school}`, onNewListing);
  }, [school, queryClient]);
}
