import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Divider, Flex, Switch, Tag, Text } from "@ledgerhq/native-ui";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Alert from "../components/Alert";
import { StorylyInstanceID } from "../components/Storyly/shared";
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

const DebugStoryly = () => {
  const [verticalLayout, setVerticalLayout] = useState(false);
  const [keepOriginalOrder, setKeepOriginalOrder] = useState(false);
  return (
    <SafeAreaView edges={["bottom"]}>
      <ScrollView>
        <Flex backgroundColor="background.main" flex={1} p={6}>
          <Alert type="warning">
            This is a tool provided as-is for the team to validate storyly
            instances used in the app.
          </Alert>
          <LanguageSettingsRow compact />
          <Flex height={4} />
          <Switch
            label="Vertical layout"
            checked={verticalLayout}
            onChange={setVerticalLayout}
          />
          <Flex height={4} />
          <Switch
            label="Keep stories of a group in their initial order"
            checked={keepOriginalOrder}
            onChange={setKeepOriginalOrder}
          />

          {Object.entries(StorylyInstanceID).map(([key, value], index) => (
            <Flex key={index} flex={1}>
              <Divider />
              <Tag type="color" alignSelf="flex-start" uppercase={false} mb={3}>
                {key}
              </Tag>
              <StoryBar
                vertical={verticalLayout}
                instanceID={value}
                keepOriginalOrder={keepOriginalOrder}
                onFail={() => {}}
              />
            </Flex>
          ))}
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DebugStoryly;
