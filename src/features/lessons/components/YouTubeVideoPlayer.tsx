'use client';

import YouTube from 'react-youtube';

export function YouTubeVideoPlayer({
    videoId,
    onFinishedVideo,
    className,
}: {
    videoId: string;
    onFinishedVideo?: () => void;
    className?: string;
}) {
    return (
        <YouTube
            videoId={videoId}
            className={className || 'w-full h-full'}
            opts={{ width: '100%', height: '100%' }}
            onEnd={onFinishedVideo}
        />
    );
}
