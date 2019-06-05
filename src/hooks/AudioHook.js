// @flow
import { useEffect } from "react";
import { connect } from "react-redux";
import { initAudioFile, releaseAudioFile } from "../actions/audioActions";
import LangService from "../services/langService";

const isValid = (currentAudio, audioState) => (audioState && (!currentAudio || !currentAudio.isPlaying));

function AudioHook({ currentAudio, audioState, dispatchInitAudioFile, dispatchReleaseAudioFile }) {
  useEffect(() => { if (isValid(currentAudio, audioState)) dispatchReleaseAudioFile(); });
  useEffect(() => { if (isValid(currentAudio, audioState)) dispatchInitAudioFile({ ...audioState, autoplay: false }); }, [audioState]);
  return null;
}

const mapState = (state) => {
  const {
    audio: { isPlaying },
    arState: { destinationMarker },
    uiState: { currentGuide: { contentObjects = [] } },
  } = state;

  const destinationContent = contentObjects.find(object => object.id === destinationMarker);
  const { audio, title = LangService.strings.UNKNOWN_TITLE } = (destinationContent || {});
  const audioState = Object.assign({}, audio, { title });
  const currentAudio = { isPlaying };
  return { audioState, currentAudio };
};

const mapDispatch = dispatch => ({
  dispatchInitAudioFile: (audio: AudioState) => { dispatch(initAudioFile(audio)); },
  dispatchReleaseAudioFile: () => { dispatch(releaseAudioFile()); },
});

export default connect(mapState, mapDispatch)(AudioHook);
