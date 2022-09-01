import React, { ReactNode } from "react";

import TimelineItem from "./TimelineItem";
import { Flex } from "../..";
import { BaseStyledProps } from "src/components/styled";

export type ItemStatus = "inactive" | "active" | "completed";

export type Item = {
  status: ItemStatus;
  title: string;
  estimatedTime?: number;
  renderBody?: (isDisplayed?: boolean) => ReactNode;
};

export type Props = BaseStyledProps & {
  steps?: Item[];
  formatEstimatedTime?: (_: number) => string;
};

export default function VerticalTimeline({ steps, formatEstimatedTime, ...props }: Props) {
  return (
    <Flex {...props} flexDirection="column">
      {steps?.map((step, index) => (
        <TimelineItem
          key={step.title}
          item={step}
          formatEstimatedTime={formatEstimatedTime}
          isFirstItem={index === 0}
          isLastItem={index === steps.length - 1}
        />
      ))}
    </Flex>
  );
}
