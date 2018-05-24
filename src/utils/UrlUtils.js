// @flow
import { Linking, Alert } from "react-native";

export function getUrlsFromImages(images: Images): string[] {
  const result = [];
  if (images.large) result.push(images.large);
  if (images.medium) result.push(images.medium);
  if (images.thumbnail) result.push(images.thumbnail);
  return result;
}

export function getUrlsFromContentObject(contentObject: ContentObject): string[] {
  let urls = contentObject.images.reduce(
    (res, images) => [...res, ...getUrlsFromImages(images)],
    [],
  );
  if (contentObject.audio) {
    urls = [...urls, contentObject.audio.url];
  }
  if (contentObject.video) {
    urls = [...urls, contentObject.video.url];
  }
  return urls;
}

export function getUrlsFromGuide(guide: Guide): string[] {
  let result: string[] = getUrlsFromImages(guide.images);
  result = [...result, ...guide.contentObjects.reduce(
    (res, obj) => [...res, ...getUrlsFromContentObject(obj)],
    [],
  )];
  return result;
}

export default {
  openUrlIfValid: async (url: any, title: any, message: any, cancel: any, accept: any) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Alert.alert(
          title, message,
          [
            { text: cancel, style: "cancel" },
            { text: accept, onPress: () => Linking.openURL(url), style: "default" },
          ],
          { cancelable: true },
        );
      }
    } catch (error) {
      return null;
    }
    return null;
  },
};
