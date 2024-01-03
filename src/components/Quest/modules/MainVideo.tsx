import { FunctionComponent } from "react";
import { MainVideoProps } from "../types/quest.types";
import { KinoraPlayerWrapper } from "kinora-sdk";
import { Player } from "@livepeer/react";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const MainVideo: FunctionComponent<MainVideoProps> = ({
  videoPlaying,
}): JSX.Element => {
  return (
    <div
      id={videoPlaying?.pubId + videoPlaying?.profileId}
      className="relative w-full h-full object-cover rounded-sm"
    >
      <KinoraPlayerWrapper
        parentId={videoPlaying?.pubId + videoPlaying?.profileId}
        key={videoPlaying?.pubId + videoPlaying?.profileId}
        customControls={true}
        play={true}
        styles={{
          borderRadius: "0.325rem",
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex"
        }}
        fillWidthHeight
        volume={{
          id: Math.random() * 0.5,
          level: 0,
        }}
      >
        {(setMediaElement: (node: HTMLVideoElement) => void) => (
          <Player
            mediaElementRef={setMediaElement}
            playbackId={videoPlaying?.playerId}
            muted
            loop
            autoPlay
            showLoadingSpinner={false}
            objectFit="cover"
            autoUrlUpload={{
              fallback: true,
              ipfsGateway: INFURA_GATEWAY,
            }}
          />
        )}
      </KinoraPlayerWrapper>
    </div>
  );
};

export default MainVideo;
