// @flow
import { useEffect } from "react";
import { connect } from "react-redux";
import { initAudioFile, releaseAudioFile } from "../actions/audioActions";
import LangService from "../services/langService";

function AudioHook({ audioState, dispatchInitAudioFile, dispatchReleaseAudioFile }) {
  console.warn(audio);
  useEffect(() => { if (audioState) dispatchReleaseAudioFile(); });
  useEffect(() => { if (audioState) dispatchInitAudioFile({ ...audioState, autoplay: false }); }, [audioState]);
  return null;
}

const mapState = (state) => {
  const {
    arState: { destinationMarker },
    uiState: { currentGuide: { contentObjects = [] } },
  } = state;

  const destinationContent = contentObjects.find(object => object.id === destinationMarker);
  const { audio, title = LangService.strings.UNKNOWN_TITLE } = (destinationContent || {});
  return Object.assign({}, audio, { title });
};

const mapDispatch = dispatch => ({
  dispatchInitAudioFile: (audio: AudioState) => { dispatch(initAudioFile(audio)); },
  dispatchReleaseAudioFile: () => { dispatch(releaseAudioFile()); },
});

export default connect(mapState, mapDispatch)(AudioHook);
