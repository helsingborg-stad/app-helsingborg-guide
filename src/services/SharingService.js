import {
  Share,
} from "react-native";
import fetchService from "../services/FetchService";

export default {
  shareImage(title, message, url, subject) {
    const mTask = fetchService.fetch(url);
    return mTask.then((res) => {
      if (res) {
        Share.share({
          title,
          message,
          url: `file://${res.path()}`,
          subject,
        });
      }
    });
  },

  shareLink(title, message, url, subject) {
    Share.share({
      title,
      message,
      url,
      subject,
    });
  },
};
