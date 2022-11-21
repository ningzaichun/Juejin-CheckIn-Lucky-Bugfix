import { getUserIdFromPathName } from "./router";

const user = {
  id: "",
};

export function getUserId() {
  return user.id;
}

export function setUserId(userId: string) {
  user.id = userId;
}

export function updateUserId() {
  const userProfileEl = document.querySelector(
    "#juejin > div.view-container > main > div.view.user-view > div.major-area > a[href]"
  );

  const userId = getUserIdFromPathName(
    userProfileEl?.getAttribute("href") ?? ""
  );

  if (!userId) {
    return;
  }

  setUserId(userId);
}
