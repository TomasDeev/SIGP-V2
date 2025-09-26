export function setCookie(name, value, days) {
  try {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }

    const cookieValue = value || "";
    const cookieString = `${name}=${cookieValue}${expires}; path=/; SameSite=Lax`;
    
    document.cookie = cookieString;
    
    const verification = getCookie(name);
    return verification !== null;
  } catch (error) {
    console.error('Error setting cookie:', error);
    return false;
  }
}

export const getCookie = (name) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

export function eraseCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function getCookieValue(name) {
  const cookieValue = getCookie(name);
  const decodedValue = decodeURIComponent(cookieValue);
  // Parse the JSON string
  return JSON.parse(decodedValue);
}
