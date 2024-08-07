import React, { useEffect, useRef, useState } from 'react';
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from '../utils';
import gsap from 'gsap';

const VideoCarousel = () => {
    const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
    const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
    const videoDivRef = useRef<(HTMLDivElement | null)[]>([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });
    const [loadedData, setLoadedData] = useState([]);
    const { isEnd, isPlaying, isLastVideo, videoId, startPlay } = video;

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId]?.pause();
            } else {
                startPlay && videoRef.current[videoId]?.play();
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData]);

    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;
        if (span[videoId]) {
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    // Update logic here
                },
                onComplete: () => {
                    // Complete logic here
                },
            });
        }
    }, [videoId, startPlay]);

    const handleProcess = (type: string) => {
        switch (type) {
            case "video-end":
                setVideo((prev) => ({ ...prev, isEnd: true, videoId: videoId + 1 }));
                break;

            case "video-last":
                setVideo((prev) => ({ ...prev, isLastVideo: true }));
                break;

            case "video-reset":
                setVideo((prev) => ({ ...prev, videoId: 0, isLastVideo: false }));
                videoRef.current.forEach(video => video?.pause());
                break;

            case "pause":
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
                break;

            case "play":
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
                break;

            default:
                return video;
        }
    };

    return (
        <>
            <div className='flex items-center'>
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id='slider' className='sm:pr-20 pr-10'>
                        <div className='video-carousel_container'>
                            <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                                <video
                                    id='video'
                                    muted
                                    playsInline={true}
                                    preload='auto'
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onPlay={() =>
                                        setVideo((prev) => ({ ...prev, isPlaying: true }))
                                    }
                                >
                                    <source src={list.video} type='video/mp4' />
                                </video>
                            </div>
                            <div className='absolute top-12 left-[5%] z-10'>
                                {list.textLists.map((text) => (
                                    <p key={text} className='md:text-2xl text-xl font-medium'>
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='relative flex-center mt-10'>
                <div className='flex-center py-5 px-7 rounded-full bg-gray-300 backdrop-blur'>
                    {hightlightsSlides.map((_, i) => (
                        <div
                            key={i}
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                            ref={(el) => (videoDivRef.current[i] = el)}
                        >
                            <span
                                className="absolute h-full w-full rounded-full"
                                ref={(el) => (videoSpanRef.current[i] = el)}
                            />
                        </div>
                    ))}
                </div>

                <button className="control-btn">
                    <img
                        src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                        alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                        onClick={
                            isLastVideo
                                ? () => handleProcess("video-reset")
                                : !isPlaying
                                    ? () => handleProcess("play")
                                    : () => handleProcess("pause")
                        }
                    />
                </button>
            </div>
        </>
    );
}

export default VideoCarousel;
