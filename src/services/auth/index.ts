import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import callbackTemplate from "./callback.template";

import { TokenType } from "@/types/sync";
import { isUndefined } from "lodash";
import { googleSignIn, openGoogleSignIn, signOut } from "./auth";

export const login = (setToken: any) => {
  // Wait for callback from tauri oauth plugin
  listen("oauth://url", async (data) => {
    let token = await googleSignIn(data.payload as string);
    if (!isUndefined(token)) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", JSON.stringify(token));
      }
      setToken(token);
    }
  });

  // Start tauri oauth plugin. When receive first request
  // When it starts, will return the server port
  // it will kill the server
  invoke("plugin:oauth|start", {
    config: {
      // Optional config, but use here to more friendly callback page
      response: callbackTemplate,
    },
  }).then((port) => {
    openGoogleSignIn(port as string);
  });
};

export const logout = () => {
  return signOut();
};

export const refreshAccessToken = async (token: TokenType, setToken: any) => {
  try {
    if (token.expiration <= Date.now()) {
      console.log("token_refresh", token?.refresh_token, token);
      const url =
        "https://oauth2.googleapis.com/token?" +
        new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          grant_type: "refresh_token",
          refresh_token: token?.refresh_token,
        });

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      });

      const refreshedTokens = await response.json();

      if (!response.ok) {
        throw refreshedTokens;
      }
      const newToken: TokenType = {
        access_token: refreshedTokens.access_token,
        expiration: Date.now() + refreshedTokens.expires_in * 1000,
        refresh_token: refreshedTokens.refresh_token ?? token.refresh_token, // Fall back to old refresh token
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("newtoken", JSON.stringify(newToken));
      }
      setToken(newToken);
    }
    console.log('ignore refreshtoken')
  } catch (error) {
    console.log(error);

    setToken({
      access_token: "",
      refresh_token: "",
      expiration: 0,
    });
  }
};
