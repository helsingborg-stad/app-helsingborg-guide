import { requestNotifications } from "react-native-permissions";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import useLocalStorage from "@hooks/useLocalStorage";

const useNotifications = () => {

  const { getLocalStorage, setLocalStorage } = useLocalStorage();

  const subscribeToNotifications = () => {
    requestNotifications(["alert", "sound"]).then(({ status, settings }) => {
      if (status === "granted") {
        messaging()
          .registerDeviceForRemoteMessages()
          .then((granted) => {
            if (granted) {
                messaging().getToken().then(token => {
                  setLocalStorage("notification_token", token);
                })
            }
        }).catch((err) => {
          console.log("some error", err)
        })

        messaging().onTokenRefresh(new_token => {
          setLocalStorage("notification_token", new_token);
        })
      }
    });
  };

  const onNotification = () => {

  };

  const unsubscribeToNotifications = () => {

  };

  return { subscribeToNotifications, onNotification, unsubscribeToNotifications };

};

export default useNotifications;
