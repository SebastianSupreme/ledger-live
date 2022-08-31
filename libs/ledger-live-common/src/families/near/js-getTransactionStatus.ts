import { BigNumber } from "bignumber.js";
import {
  NotEnoughBalance,
  RecipientRequired,
  InvalidAddress,
  FeeNotLoaded,
  AmountRequired,
  InvalidAddressBecauseDestinationIsAlsoSource,
} from "@ledgerhq/errors";
import { formatCurrencyUnit, getCryptoCurrencyById } from "../../currencies";
import type {
  Transaction,
  StatusErrorMap,
  NearAccount,
  TransactionStatus,
} from "./types";
import {
  isValidAddress,
  NEW_ACCOUNT_SIZE,
  isImplicitAccount,
  getMaxAmount,
  getTotalSpent,
  getYoctoThreshold,
} from "./logic";
import { fetchAccountDetails } from "./api";
import { getCurrentNearPreloadData } from "./preload";
import {
  NearNewAccountWarning,
  NearActivationFeeNotCovered,
  NearNewNamedAccountError,
  NearUseAllAmountStakeWarning,
  NearNotEnoughStaked,
  NearNotEnoughAvailable,
  NearRecommendUnstake,
  NearStakingThresholdNotMet,
} from "./errors";

const getTransactionStatus = async (
  a: NearAccount,
  t: Transaction
): Promise<TransactionStatus> => {
  if (t.mode === "send") {
    return await getSendTransactionStatus(a, t);
  }

  const errors: StatusErrorMap = {};
  const warnings: StatusErrorMap = {};
  const useAllAmount = !!t.useAllAmount;

  if (!t.fees) {
    errors.fees = new FeeNotLoaded();
  }

  const estimatedFees = t.fees || new BigNumber(0);

  const totalSpent = getTotalSpent(a, t, estimatedFees);

  const amount = useAllAmount
    ? getMaxAmount(a, t, estimatedFees)
    : new BigNumber(t.amount);

  const stakingPosition = a.nearResources?.stakingPositions?.find(
    (p) => p.validatorId === t.recipient
  );

  const stakingThreshold = getYoctoThreshold();

  if (
    totalSpent.gt(a.spendableBalance) ||
    a.spendableBalance.lt(estimatedFees)
  ) {
    errors.amount = new NotEnoughBalance();
  } else if (
    ["stake", "unstake", "withdraw"].includes(t.mode) &&
    amount.lt(stakingThreshold)
  ) {
    const currency = getCryptoCurrencyById("near");
    const formattedStakingThreshold = formatCurrencyUnit(
      currency.units[0],
      stakingThreshold.plus("1"),
      {
        showCode: true,
      }
    );
    errors.amount = new NearStakingThresholdNotMet(undefined, {
      threshold: formattedStakingThreshold,
    });
  } else if (
    t.mode === "unstake" &&
    stakingPosition &&
    amount.gt(stakingPosition?.staked)
  ) {
    errors.amount = new NearNotEnoughStaked();
  } else if (
    t.mode === "withdraw" &&
    stakingPosition &&
    amount.gt(stakingPosition?.available)
  ) {
    errors.amount = new NearNotEnoughAvailable();
  } else if (amount.lte(0) && !t.useAllAmount) {
    errors.amount = new AmountRequired();
  }

  if (t.mode === "stake" && !errors.amount && t.useAllAmount) {
    warnings.amount = new NearUseAllAmountStakeWarning();
  }

  return Promise.resolve({
    errors,
    warnings,
    estimatedFees,
    amount,
    totalSpent,
  });
};

const getSendTransactionStatus = async (
  a: NearAccount,
  t: Transaction
): Promise<TransactionStatus> => {
  const errors: StatusErrorMap = {};
  const warnings: StatusErrorMap = {};
  const useAllAmount = !!t.useAllAmount;

  const { storageCost } = getCurrentNearPreloadData();

  const newAccountStorageCost = storageCost.multipliedBy(NEW_ACCOUNT_SIZE);
  const currency = getCryptoCurrencyById("near");
  const formattedNewAccountStorageCost = formatCurrencyUnit(
    currency.units[0],
    newAccountStorageCost,
    {
      showCode: true,
    }
  );

  let recipientIsNewAccount;
  if (!t.recipient) {
    errors.recipient = new RecipientRequired();
  } else if (!isValidAddress(t.recipient)) {
    errors.recipient = new InvalidAddress();
  } else {
    const accountDetails = await fetchAccountDetails(t.recipient);

    if (!accountDetails) {
      recipientIsNewAccount = true;

      if (isImplicitAccount(t.recipient)) {
        warnings.recipient = new NearNewAccountWarning(undefined, {
          formattedNewAccountStorageCost,
        });
      } else {
        errors.recipient = new NearNewNamedAccountError();
      }
    }
  }

  if (a.freshAddress === t.recipient) {
    warnings.recipient = new InvalidAddressBecauseDestinationIsAlsoSource();
  }

  if (!t.fees) {
    errors.fees = new FeeNotLoaded();
  }

  const estimatedFees = t.fees || new BigNumber(0);

  const totalSpent = getTotalSpent(a, t, estimatedFees);

  const amount = useAllAmount
    ? getMaxAmount(a, t, estimatedFees)
    : new BigNumber(t.amount);

  if (
    totalSpent.gt(a.spendableBalance) ||
    a.spendableBalance.lt(estimatedFees)
  ) {
    errors.amount = new NotEnoughBalance();
  } else if (amount.lte(0) && !t.useAllAmount) {
    errors.amount = new AmountRequired();
  } else if (recipientIsNewAccount && amount.lt(newAccountStorageCost)) {
    errors.amount = new NearActivationFeeNotCovered(undefined, {
      formattedNewAccountStorageCost,
    });
  }

  if (
    a.nearResources?.stakingPositions &&
    a.nearResources.stakingPositions.length > 0 &&
    useAllAmount
  ) {
    warnings.amount = new NearRecommendUnstake();
  }

  return Promise.resolve({
    errors,
    warnings,
    estimatedFees,
    amount,
    totalSpent,
  });
};

export default getTransactionStatus;
