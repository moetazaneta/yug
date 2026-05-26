import * as Notifications from "expo-notifications";

export async function requestReminderPermissions() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
}

export async function scheduleDailyReminder(hour: number, minute: number) {
  const granted = await requestReminderPermissions();
  if (!granted) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to write in yug",
      body: "Add a quick daily entry while it is fresh.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}
