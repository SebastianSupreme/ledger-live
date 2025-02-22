import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";
import { Button, Flex, InfiniteLoader, Text } from "@ledgerhq/native-ui";
import {
  ImageErrorEventData,
  NativeSyntheticEvent,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImagePreviewError } from "@ledgerhq/live-common/customImage/errors";
import useResizedImage, {
  Params as ImageResizerParams,
  ResizeResult,
} from "../../components/CustomImage/useResizedImage";
import ImageProcessor, {
  Props as ImageProcessorProps,
  ProcessorPreviewResult,
  ProcessorRawResult,
} from "../../components/CustomImage/ImageProcessor";
import { targetDimensions } from "./shared";
import BottomButtonsContainer from "../../components/CustomImage/BottomButtonsContainer";
import ContrastChoice from "../../components/CustomImage/ContrastChoice";
import { ScreenName } from "../../const";
import FramedImage from "../../components/CustomImage/FramedImage";
import { CustomImageNavigatorParamList } from "../../components/RootNavigator/types/CustomImageNavigator";
import {
  BaseComposite,
  StackNavigatorProps,
} from "../../components/RootNavigator/types/helpers";

export const PreviewImage = styled.Image.attrs({
  resizeMode: "contain",
})`
  align-self: center;
  width: 200px;
  height: 200px;
`;

const contrasts = [
  { val: 1, color: "neutral.c70" },
  { val: 1.5, color: "neutral.c50" },
  { val: 2, color: "neutral.c40" },
  { val: 3, color: "neutral.c30" },
];

type NavigationProps = BaseComposite<
  StackNavigatorProps<
    CustomImageNavigatorParamList,
    ScreenName.CustomImageStep2Preview
  >
>;

/**
 * UI component that loads the input image (from the route params) &
 * displays it in a preview UI with some contrast options & a confirm button at
 * the bottom.
 * Then on confirmation it navigates to the transfer step with the raw hex data
 * of the image & the preview base 64 data URI of the image as params.
 */
const Step2Preview = ({ navigation, route }: NavigationProps) => {
  const imageProcessorRef = useRef<ImageProcessor>(null);
  const [loading, setLoading] = useState(true);
  const [resizedImage, setResizedImage] = useState<ResizeResult | null>(null);
  const [contrast, setContrast] = useState(1);
  const [processorPreviewImage, setProcessorPreviewImage] =
    useState<ProcessorPreviewResult | null>(null);
  const [rawResultLoading, setRawResultLoading] = useState(false);

  const { t } = useTranslation();

  const { params } = route;

  const { cropResult: croppedImage, device } = params;

  const handleError = useCallback(
    (error: Error) => {
      console.error(error);
      navigation.navigate(ScreenName.CustomImageErrorScreen, { error, device });
    },
    [navigation, device],
  );

  /** IMAGE RESIZING */

  const handleResizeResult: ImageResizerParams["onResult"] = useCallback(
    (res: ResizeResult) => {
      setResizedImage(res);
    },
    [setResizedImage],
  );

  useResizedImage({
    targetDimensions,
    imageFileUri: croppedImage?.imageFileUri,
    onError: handleError,
    onResult: handleResizeResult,
  });

  /** RESULT IMAGE HANDLING */

  const handlePreviewResult: ImageProcessorProps["onPreviewResult"] =
    useCallback(
      data => {
        setProcessorPreviewImage(data);
        setLoading(false);
      },
      [setProcessorPreviewImage],
    );

  const handleRawResult: ImageProcessorProps["onRawResult"] = useCallback(
    (data: ProcessorRawResult) => {
      if (!processorPreviewImage) {
        /**
         * this should not happen as the "request raw result" button is only
         * visible once the preview is there
         * */
        throw new ImagePreviewError();
      }
      navigation.navigate(ScreenName.CustomImageStep3Transfer, {
        rawData: data,
        previewData: processorPreviewImage,
        device,
      });
      setRawResultLoading(false);
    },
    [navigation, setRawResultLoading, processorPreviewImage, device],
  );

  const handlePreviewImageError = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<ImageErrorEventData>) => {
      console.error(nativeEvent.error);
      handleError(new ImagePreviewError());
    },
    [handleError],
  );

  const requestRawResult = useCallback(() => {
    imageProcessorRef?.current?.requestRawResult();
    setRawResultLoading(true);
  }, [imageProcessorRef, setRawResultLoading]);

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      {resizedImage?.imageBase64DataUri && (
        <ImageProcessor
          ref={imageProcessorRef}
          imageBase64DataUri={resizedImage?.imageBase64DataUri}
          onPreviewResult={handlePreviewResult}
          onError={handleError}
          onRawResult={handleRawResult}
          contrast={contrast}
        />
      )}
      <Flex
        flex={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {processorPreviewImage?.imageBase64DataUri ? (
          <FramedImage
            onError={handlePreviewImageError}
            fadeDuration={0}
            source={{ uri: processorPreviewImage.imageBase64DataUri }}
          />
        ) : (
          <InfiniteLoader />
        )}
      </Flex>
      <BottomButtonsContainer>
        <Text fontSize="14px" lineHeight="17px">
          {t("customImage.selectContrast")}
        </Text>
        {resizedImage?.imageBase64DataUri && (
          <Flex flexDirection="row" my={6} justifyContent="space-between">
            {contrasts.map(({ val, color }) => (
              <Pressable
                disabled={loading}
                key={val}
                onPress={() => {
                  if (contrast !== val) {
                    setLoading(true);
                    setContrast(val);
                  }
                }}
              >
                <ContrastChoice
                  selected={contrast === val}
                  loading={loading}
                  color={color}
                />
              </Pressable>
            ))}
          </Flex>
        )}
        <Button
          disabled={!processorPreviewImage?.imageBase64DataUri}
          mt={6}
          size="large"
          type="main"
          outline={false}
          onPress={requestRawResult}
          pending={rawResultLoading}
          displayContentWhenPending
        >
          {t("common.confirm")}
        </Button>
      </BottomButtonsContainer>
    </SafeAreaView>
  );
};

export default Step2Preview;
