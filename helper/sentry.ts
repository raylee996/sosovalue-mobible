import * as Sentry from "@sentry/nextjs";

export const setSentryUser = (user: User.UserInfo | null) => {
  Sentry.setUser(
    user ? { id: user.id, username: user.username, email: user.email } : null
  );
};
