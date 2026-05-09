import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
}

export async function scheduleDailyNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Missile OS',
      body: "Today's checklist is live. Lock in.",
    },
    trigger: {
      hour: 6,
      minute: 0,
      repeats: true,
      channelId: 'daily',
    } as Notifications.DailyTriggerInput,
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Missile OS',
      body: 'Halfway through. Are you on track?',
    },
    trigger: {
      hour: 12,
      minute: 0,
      repeats: true,
      channelId: 'daily',
    } as Notifications.DailyTriggerInput,
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Missile OS',
      body: 'Log your day. Close the loop.',
    },
    trigger: {
      hour: 21,
      minute: 0,
      repeats: true,
      channelId: 'daily',
    } as Notifications.DailyTriggerInput,
  });
}
