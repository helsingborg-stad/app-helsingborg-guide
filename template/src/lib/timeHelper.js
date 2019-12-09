module.exports = () => {
  function add0(number) {
    return number < 10 ? `0${number}` : number;
  }

  function toTimeMarker(_seconds) {
    const seconds = Math.floor(_seconds);
    let m;
    let s;
    if (!seconds || seconds < 0) {
      return "00:00";
    }
    if (seconds < 60) {
      return `00:${add0(seconds)}`;
    }
    if (seconds < 3600) {
      m = parseInt(seconds / 60);
      s = seconds % 60;
      return `${add0(m)}:${add0(s)}`;
    }
    const h = parseInt(seconds / 3600);
    const r = seconds % 3600;
    m = parseInt(r / 60);
    s = r % 60;

    return `${add0(h)}:${add0(m)}:${add0(s)}`;
  }

  return {
    toTimeMarker
  };
};
