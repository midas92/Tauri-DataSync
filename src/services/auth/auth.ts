import { open } from "@tauri-apps/api/shell";

const openBrowserToConsent = (port: string) => {
  // Replace CLIEN_ID_FROM_FIREBASE
  // Must allow localhost as redirect_uri for CLIENT_ID on GCP: https://console.cloud.google.com/apis/credentials
  return open(
    "https://accounts.google.com/o/oauth2/auth?" +
      "response_type=code&" +
      "access_type=offline&" +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=http%3A//localhost:${port}&` +
      "scope=email%20profile%20openid%20https://www.googleapis.com/auth/drive&" +
      "prompt=consent"
  );
};

export const openGoogleSignIn = (port: string) => {
  return new Promise((resolve, reject) => {
    openBrowserToConsent(port).then(resolve).catch(reject);
  });
};

export const googleSignIn = async (payload: string) => {
  console.log("payload", payload.toString());
  // Get `access_token` from redirect_uri param
  var portPattern = /:(\d+)/;
  const codePattern = /[?&]code=([^&]+)/;
  var portMatch = portPattern.exec(payload);
  var codeMatch = codePattern.exec(payload);

  if (portMatch && portMatch[1] && codeMatch && codeMatch[1]) {
    const port = portMatch[1];
    const code = codeMatch[1];
    console.log("code", code, port);

    const getRefreshTokenURL =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `http://localhost:${port}`,
      });
    const response = await fetch(getRefreshTokenURL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
    console.log("response", response);
    const refreshedTokens = await response.json();
    return {
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token,
      expiration: Date.now() + refreshedTokens.expires_in * 1000,
    };
  }
};

export const signOut = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};
