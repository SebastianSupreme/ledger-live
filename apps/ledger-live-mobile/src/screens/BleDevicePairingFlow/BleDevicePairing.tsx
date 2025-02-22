import React, { ReactNode, useCallback, useEffect } from "react";
import { useTheme } from "styled-components/native";
import { useBleDevicePairing } from "@ledgerhq/live-common/ble/hooks/useBleDevicePairing";
import { Device } from "@ledgerhq/live-common/hw/actions/types";
import { useTranslation } from "react-i18next";
import { getDeviceModel } from "@ledgerhq/devices";
import { Flex, InfiniteLoader, Text, Button } from "@ledgerhq/native-ui";
import {
  CircledCheckSolidMedium,
  CircledCrossSolidMedium,
} from "@ledgerhq/native-ui/assets/icons";

import Animation from "../../components/Animation";
import { getDeviceAnimation } from "../../helpers/getDeviceAnimation";
import DeviceSetupView from "../../components/DeviceSetupView";

const TIMEOUT_AFTER_PAIRED_MS = 2000;

export type BleDevicePairingProps = {
  onPaired: (device: Device) => void;
  onRetry: () => void;
  deviceToPair: Device;
};

export const BleDevicePairing = ({
  deviceToPair,
  onPaired,
  onRetry,
}: BleDevicePairingProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const theme = colors.type as "dark" | "light";

  const productName =
    getDeviceModel(deviceToPair.modelId).productName || deviceToPair.modelId;
  const deviceName = deviceToPair.deviceName || productName;

  const { isPaired, pairingError } = useBleDevicePairing({
    deviceId: deviceToPair.deviceId,
  });

  useEffect(() => {
    if (isPaired) {
      setTimeout(() => {
        onPaired(deviceToPair);
      }, TIMEOUT_AFTER_PAIRED_MS);
    }
  }, [isPaired, deviceToPair, onPaired]);

  const handleClose = useCallback(() => {
    if (isPaired) {
      onPaired(deviceToPair);
    } else {
      onRetry();
    }
  }, [deviceToPair, isPaired, onPaired, onRetry]);

  let content: ReactNode;

  if (isPaired) {
    content = (
      <>
        <Flex
          alignItems="center"
          justifyContent="center"
          p={1}
          borderWidth={2}
          borderRadius="9999px"
          borderColor={colors.success.c80}
          mb={9}
        >
          <CircledCheckSolidMedium color={colors.success.c80} size={48} />
        </Flex>
        <Text mb={4} textAlign="center" variant="h4" fontWeight="semiBold">
          {t("blePairingFlow.pairing.success.title", {
            deviceName,
          })}
        </Text>
        {/* Transparent text in order to have a smooth transition between loading and success */}
        <Text variant="body" textAlign="center" mb={8} color="transparent">
          {t("blePairingFlow.pairing.loading.subtitle", { productName })}
        </Text>
        <Animation
          source={getDeviceAnimation({
            device: deviceToPair,
            key: "blePaired",
            theme,
          })}
        />
      </>
    );
  } else if (pairingError) {
    content = (
      <Flex>
        <Flex flex={1} alignItems="center" justifyContent="center">
          <Flex alignItems="center" justifyContent="center" mb={8}>
            <CircledCrossSolidMedium color={colors.error.c80} size={56} />
          </Flex>
          <Text mb={4} textAlign="center" variant="h4" fontWeight="semiBold">
            {t("blePairingFlow.pairing.error.title")}
          </Text>
          <Text variant="body" mb={8} color="neutral.c80" textAlign="center">
            {t("blePairingFlow.pairing.error.subtitle", { productName })}
          </Text>
        </Flex>
        <Button type="main" onPress={onRetry} mb={8}>
          {t("blePairingFlow.pairing.error.retryCta")}
        </Button>
      </Flex>
    );
  } else {
    content = (
      <>
        <Flex mb={10}>
          <InfiniteLoader color="primary.c80" size={48} />
        </Flex>
        <Text variant="h4" fontWeight="semiBold" textAlign="center" mb={4}>
          {t("blePairingFlow.pairing.loading.title", { deviceName })}
        </Text>
        <Text variant="body" textAlign="center" mb={8} color="neutral.c80">
          {t("blePairingFlow.pairing.loading.subtitle", { productName })}
        </Text>
        <Animation
          source={getDeviceAnimation({
            device: deviceToPair,
            key: "blePairing",
            theme,
          })}
        />
      </>
    );
  }

  return (
    <DeviceSetupView onClose={handleClose}>
      <Flex flex={1} px={10} pt={36} alignItems="center">
        {content}
      </Flex>
    </DeviceSetupView>
  );
};
