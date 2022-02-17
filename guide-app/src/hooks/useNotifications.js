import { requestNotifications } from "react-native-permissions";
import { Alert, Clipboard } from "react-native";
import notifee, { AndroidImportance } from "@notifee/react-native";
import firebase from "@react-native-firebase/app"
import messaging from "@react-native-firebase/messaging";
import useLocalStorage from "@hooks/useLocalStorage";

const useNotifications = () => {

  const { getLocalStorage, setLocalStorage } = useLocalStorage();



  const displayNotification = async (data) => {
    const channelId = await notifee.createChannel({
      id: "high",
      name: "High Priority",
      importance: AndroidImportance.HIGH
    });
    await notifee.displayNotification({
      title: data?.notification?.title || "Title",
      body: data?.notification?.body || "Body",
      android: {
        autoCancel: false,
        channelId,
        smallIcon: "ic_launcher",
        importance: AndroidImportance.HIGH,
      },
    });
  };

  const subscribeToNotifications = async () => {
   __DEV__ && messaging().requestPermission().then(authStatus => {
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        messaging().getToken().then(token => {
          const copyAlertMessage = async () => {
            Clipboard.setString(token)
          }
          // Alert.alert('token', token, [ {text: 'Copy message', onPress: () => copyAlertMessage(), style: 'cancel'}, ], { cancelable: true});
          setLocalStorage("notification_token", token);
        }).catch(err => console.log("err token", err));
        messaging().onTokenRefresh(new_token => {
          setLocalStorage("notification_token", new_token);
        });
      }
    });
  };

  const setBackgroundNotificationHandler = () => {
    __DEV__ && messaging()
          .setBackgroundMessageHandler(async remoteMessage => {
            // Alert.alert("A new background FCM message arrived!", JSON.stringify(remoteMessage));
            displayNotification(data);
          });
  };

  const onNotification = async () => {
    __DEV__ && messaging().onMessage(async remoteMessage => {
      displayNotification(remoteMessage);
    });
  };

  const unsubscribeToNotifications = () => {

  };

  return {
    displayNotification,
    setBackgroundNotificationHandler,
    subscribeToNotifications,
    onNotification,
    unsubscribeToNotifications,
  };

};


export default useNotifications;
