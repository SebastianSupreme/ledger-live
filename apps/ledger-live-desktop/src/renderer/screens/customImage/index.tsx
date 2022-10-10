import React, { ComponentProps, useCallback, useEffect, useMemo, useState } from "react";
import { Flex, FlowStepper, InfiniteLoader, Text } from "@ledgerhq/react-ui";
import { ImageDownloadError } from "@ledgerhq/live-common/customImage/errors";
import { withV3StyleProvider } from "~/renderer/styles/StyleProviderV3";
import { ImageBase64Data } from "~/renderer/components/CustomImage/types";
import { CropParams } from "~/renderer/components/CustomImage/ImageCropper";
import { urlContentToDataUri } from "~/renderer/components/CustomImage/shared";
import { ProcessorResult } from "~/renderer/components/CustomImage/ImageGrayscalePreview";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import { withV2StyleProvider } from "~/renderer/styles/StyleProvider";
import { useTranslation } from "react-i18next";
import StepChooseImage from "./Step1ChooseImage";
import StepAdjustImage from "./Step2AdjustImage";
import StepChooseContrast from "./Step3ChooseContrast";
import StepTransfer from "./Step4Transfer";
import { Step } from "./types";
import StepContainer from "./StepContainer";
import StepFooter from "./StepFooter";
import { setDrawer } from "~/renderer/drawers/Provider";

type Props = {
  imageUri?: string;
  isFromNFTEntryPoint?: boolean;
  reopenPreviousDrawer?: () => void;
};

const orderedSteps: Step[] = [
  Step.chooseImage,
  Step.adjustImage,
  Step.chooseContrast,
  Step.transferImage,
];

const ErrorDisplayV2 = withV2StyleProvider(ErrorDisplay);

const CustomImage: React.FC<Props> = props => {
  const { imageUri, isFromNFTEntryPoint, reopenPreviousDrawer } = props;
  const { t } = useTranslation();

  const [stepError, setStepError] = useState<{ [key in Step]?: Error }>({});

  const [sourceLoading, setSourceLoading] = useState<boolean>(false);

  const [loadedImage, setLoadedImage] = useState<ImageBase64Data>();
  const [croppedImage, setCroppedImage] = useState<ImageBase64Data>();
  const [finalResult, setFinalResult] = useState<ProcessorResult>();

  /**
   * Keeping a record of the crop params of a given image so that the cropping
   * state is not lost when unmounting the cropping step component.
   * */
  const [initialCropParams, setInitialCropParams] = useState<CropParams>();

  const [step, setStep] = useState<Step>(Step.chooseImage);

  const setStepWrapper = useCallback(
    (newStep: Step) => {
      if (step === Step.adjustImage && newStep === Step.chooseImage && isFromNFTEntryPoint) {
        setDrawer();
        if (reopenPreviousDrawer) reopenPreviousDrawer();
        return;
      }
      setStepError({});
      setStep(newStep);
    },
    [step, isFromNFTEntryPoint, reopenPreviousDrawer],
  );

  const initialUri = imageUri;

  useEffect(() => {
    let dead = false;
    if (initialUri) {
      setSourceLoading(true);
      urlContentToDataUri(initialUri)
        .then(res => {
          if (dead) return;
          setLoadedImage({ imageBase64DataUri: res });
          setStepWrapper(Step.adjustImage);
        })
        .catch(e => {
          console.error(e);
          if (dead) return;
          setStepError({ [Step.chooseImage]: new ImageDownloadError() });
        });
    }
    return () => {
      dead = true;
    };
  }, [setLoadedImage, initialUri, setStepWrapper]);

  useEffect(() => {
    if (loadedImage) setSourceLoading(false);
  }, [loadedImage]);

  const handleStepChooseImageResult: ComponentProps<
    typeof StepChooseImage
  >["onResult"] = useCallback(res => {
    setLoadedImage(res);
    setStepWrapper(Step.adjustImage);
  }, []);

  const handleStepAdjustImageResult: ComponentProps<
    typeof StepAdjustImage
  >["onResult"] = useCallback(res => {
    setCroppedImage(res);
  }, []);

  const handleStepChooseContrastResult: ComponentProps<
    typeof StepChooseContrast
  >["onResult"] = useCallback(res => {
    setFinalResult(res);
  }, []);

  const handleErrorRetryClicked = useCallback(() => {
    setStepWrapper(Step.chooseImage);
  }, [setStepWrapper]);

  const handleError = useCallback(
    (step: Step, error: Error) => {
      setStepError({ [step]: error });
    },
    [setStepError],
  );

  /** just avoiding creating a new ref (and rerendering) for each step's onError */
  const errorHandlers: { [key in Step]: (error: Error) => void } = useMemo(
    () => ({
      [Step.adjustImage]: (...args) => handleError(Step.adjustImage, ...args),
      [Step.chooseContrast]: (...args) => handleError(Step.chooseContrast, ...args),
      [Step.chooseImage]: (...args) => handleError(Step.chooseImage, ...args),
      [Step.transferImage]: (...args) => handleError(Step.transferImage, ...args),
    }),
    [handleError],
  );

  const error = stepError[step];

  const previousStep: Step | undefined = orderedSteps[orderedSteps.findIndex(s => s === step) - 1];

  const renderError = useMemo(
    () =>
      error
        ? () => {
            return (
              <StepContainer
                footer={
                  <StepFooter
                    previousStep={previousStep}
                    previousLabel={t("common.previous")}
                    setStep={setStepWrapper}
                  />
                }
              >
                <ErrorDisplayV2 error={error} onRetry={handleErrorRetryClicked} />
              </StepContainer>
            );
          }
        : undefined,
    [error, previousStep, t, setStepWrapper, handleErrorRetryClicked],
  );

  return (
    <Flex
      flexDirection="column"
      position="relative"
      rowGap={5}
      height="100%"
      width="100%"
      flex={1}
      px={12}
      alignSelf="stretch"
      data-test-id="custom-image-container"
    >
      <Text alignSelf="center" variant="h3">
        {t("customImage.title")}
      </Text>
      <FlowStepper.Indexed
        activeKey={step}
        extraStepperProps={{ errored: !!error }}
        renderChildren={renderError}
      >
        <FlowStepper.Indexed.Step
          itemKey={Step.chooseImage}
          label={t("customImage.steps.choose.stepLabel")}
        >
          {sourceLoading ? (
            <Flex flex={1} justifyContent="center" alignItems="center">
              <InfiniteLoader />
            </Flex>
          ) : (
            <StepChooseImage
              onError={errorHandlers[Step.chooseImage]}
              onResult={handleStepChooseImageResult}
              setStep={setStepWrapper}
              setLoading={setSourceLoading}
            />
          )}
        </FlowStepper.Indexed.Step>
        <FlowStepper.Indexed.Step
          itemKey={Step.adjustImage}
          label={t("customImage.steps.adjust.stepLabel")}
        >
          <StepAdjustImage
            src={loadedImage}
            onError={errorHandlers[Step.adjustImage]}
            onResult={handleStepAdjustImageResult}
            setStep={setStepWrapper}
            initialCropParams={initialCropParams}
            setCropParams={setInitialCropParams}
          />
        </FlowStepper.Indexed.Step>
        <FlowStepper.Indexed.Step
          itemKey={Step.chooseContrast}
          label={t("customImage.steps.contrast.stepLabel")}
        >
          <StepChooseContrast
            src={croppedImage}
            onResult={handleStepChooseContrastResult}
            onError={errorHandlers[Step.chooseContrast]}
            setStep={setStepWrapper}
          />
        </FlowStepper.Indexed.Step>
        <FlowStepper.Indexed.Step
          itemKey={Step.transferImage}
          label={t("customImage.steps.transfer.stepLabel")}
        >
          <StepTransfer
            result={finalResult}
            onError={errorHandlers[Step.transferImage]}
            setStep={setStepWrapper}
          />
        </FlowStepper.Indexed.Step>
      </FlowStepper.Indexed>
    </Flex>
  );
};

export default withV3StyleProvider(CustomImage);
