import React from "react";
import { Platform, ScrollView } from "react-native";
import { Flex, Text } from "@ledgerhq/native-ui";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Alert from "../components/Alert";
import { storyInstancesIDsMap } from "../components/Storyly/shared";
import StoryBar from "../components/Storyly/StoryBar";
import LanguageSettingsRow from "./Settings/General/LanguageRow";

const StyledStoryBar = styled(StoryBar).attrs({
  scrollContainerStyle: {
    paddingHorizontal: 16,
    justifyContent: "center",
    flexGrow: 1,
  },
})`
  flex: 1;
  padding-vertical: 16px;
`;

const DebugStoryly = () => (
  <SafeAreaView edges={["bottom"]}>
    <ScrollView>
      <Flex backgroundColor="background.main" flex={1} p={6}>
        <Alert type="warning">
          This is a tool provided as-is for the team to validate storyly
          instances used in the app.
        </Alert>
        <LanguageSettingsRow />
        {Object.keys(storyInstancesIDsMap).map((key, index) => (
          <Flex key={index} py={5} flex={1}>
            <Text>{key}</Text>
            <StyledStoryBar
              instanceID={storyInstancesIDsMap[key]}
              onFail={() => {}}
            />
          </Flex>
        ))}
      </Flex>
    </ScrollView>
  </SafeAreaView>
);

export default DebugStoryly;
