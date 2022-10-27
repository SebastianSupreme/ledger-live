import { matchVersion } from "@ledgerhq/live-common/platform/filters";
import { AppManifest } from "@ledgerhq/live-common/platform/types";
import React from "react";
import { WebViewV2 } from "./v2/index";
import { WebView } from "./Player";

type Props = {
  manifest: AppManifest;
  inputs?: Record<string, any>;
};

const WebViewWrapper = ({ manifest, inputs }: Props) => {
  if (matchVersion({ version: "2.0.0" }, manifest)) {
    return <WebViewV2 manifest={manifest} inputs={inputs} />;
  }
  return <WebView manifest={manifest} inputs={inputs} />;
};

export default WebViewWrapper;
