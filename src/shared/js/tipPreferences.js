import Cookies from 'js-cookie';

export const FIXTURE_TIPS_COOKIE = 'ppFixtureTipsEnabled';
export const COOKIE_OPTIONS = { expires: 3650, path: '/' };

export const areFixtureTipsEnabled = () => Cookies.get(FIXTURE_TIPS_COOKIE) !== 'false';

export const setFixtureTipsEnabled = (enabled) => {
  Cookies.set(FIXTURE_TIPS_COOKIE, enabled ? 'true' : 'false', COOKIE_OPTIONS);
};
