import { Flex, Text } from "@ledgerhq/native-ui";
import { FlexBoxProps } from "@ledgerhq/native-ui/components/Layout/Flex";
import React from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";

export type Props = {
  id?: string;
  title: string;
  index: number;
  seen: boolean;
  iconUrl?: string;
  onPress: () => void;
  titlePosition: "bottom" | "right";
};

const Title = styled(Text).attrs({
  variant: "body",
  fontWeight: "medium",
})``;

const Touchable = styled(TouchableOpacity)<{ seen: boolean }>`
  border-color: ${p =>
    p.seen ? p.theme.colors.primary.c50 : p.theme.colors.primary.c80};
  border-width: 2px;
  padding: 3px;
  border-radius: 100px;
`;

const Illustration = styled(Image).attrs({ resizeMode: "cover" })`
  height: 56px;
  width: 56px;
  border-radius: 72px;
`;

const StoryGroup: React.FC<Props> = props => {
  const { onPress, seen, title, iconUrl, titlePosition } = props;
  const containerProps: FlexBoxProps =
    titlePosition === "bottom"
      ? {
          flexDirection: "column",
          alignItems: "center",
        }
      : {
          flexDirection: "row",
          alignItems: "center",
        };

  const titleProps =
    titlePosition === "bottom"
      ? {
          mt: 3,
        }
      : {
          ml: 6,
        };
  return (
    <Flex {...containerProps}>
      <Touchable seen={seen} onPress={onPress || undefined}>
        <Flex
          height="56px"
          width="56px"
          borderRadius="72px"
          backgroundColor="neutral.c30"
        >
          <Illustration source={{ uri: iconUrl }} />
        </Flex>
      </Touchable>
      <Title {...titleProps}>{title}</Title>
    </Flex>
  );
};

export default StoryGroup;
