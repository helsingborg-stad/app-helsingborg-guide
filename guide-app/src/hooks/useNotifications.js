import { requestNotifications } from "react-native-permissions";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import useLocalStorage from "@hooks/useLocalStorage";

const useNotifications = () => {

  const { getLocalStorage, setLocalStorage } = useLocalStorage();


  const displayNotification = async (data) => {
        console.log("data", data)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      },
    });
  }

  const subscribeToNotifications = () => {
    requestNotifications(["alert", "sound"]).then(({ status, settings }) => {
      if (status === "granted") {
        messaging()
          .registerDeviceForRemoteMessages()
          .then((granted) => {
            if (granted) {
              messaging().getToken().then(token => {
                setLocalStorage("notification_token", token);
              });
            }
          }).catch((err) => {
          console.log("some error", err);
        });
        messaging().onTokenRefresh(new_token => {
          setLocalStorage("notification_token", new_token);
        });
      }
    });
  };

  const setBackgroundNotificationHandler = () => {
    requestNotifications(["alert", "sound"]).then(({ status, settings }) => {
      if (status === "granted") {
        messaging()
          .setBackgroundMessageHandler(async data => {
            console.log("data!", data)
            alert("data", data)
            displayNotification(data)
          });
      }
    });
  };

  const onNotification = () => {
    messaging().onMessage(data => {
      console.log("data!", data)
      alert("data", data)
      displayNotification(data)
    });
  };

  const unsubscribeToNotifications = () => {

  };

  return { displayNotification, setBackgroundNotificationHandler, subscribeToNotifications, onNotification, unsubscribeToNotifications };

};


export default useNotifications;
