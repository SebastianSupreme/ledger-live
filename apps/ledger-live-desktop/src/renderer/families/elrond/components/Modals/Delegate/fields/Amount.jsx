// @flow

import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { getAccountUnit } from "@ledgerhq/live-common/account/index";
import InputCurrency from "~/renderer/components/InputCurrency";
import Label from "~/renderer/components/Label";
import { constants } from "~/renderer/families/elrond/constants";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Check from "~/renderer/icons/Check";
import ExclamationCircle from "~/renderer/icons/ExclamationCircle";
import { denominate } from "~/renderer/families/elrond/helpers";

const Availability = styled.div`
  text-align: right;
  display: flex;
  margin-left: auto;
  align-items: center;
`;

const InputLeft = styled(Box).attrs(() => ({
  textAlign: "right",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
  horizontal: true,
  pl: 3,
}))``;

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
  horizontal: true,
}))`
  padding: ${p => p.theme.space[2]}px;
`;

const AmountButton = styled.button.attrs(() => ({
  type: "button",
}))`
  background-color: ${p =>
    p.error
      ? p.theme.colors.lightRed
      : p.active
      ? p.theme.colors.palette.primary.main
      : p.theme.colors.palette.action.hover};
  color: ${p =>
    p.error
      ? p.theme.colors.alertRed
      : p.active
      ? p.theme.colors.palette.primary.contrastText
      : p.theme.colors.palette.primary.main}!important;
  border: none;
  border-radius: 4px;
  padding: 0px ${p => p.theme.space[2]}px;
  margin: 0 2.5px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 200ms ease-out;
  &:hover {
    filter: contrast(2);
  }
`;

export default function AmountField({
  amount,
  initialAmount,
  account,
  onChange,
  status: { errors, warnings },
  label,
}) {
  const unit = getAccountUnit(account);

  const [focused, setFocused] = useState(false);

  const onAmountChange = (amount, unit) => {
    onChange(amount, unit);
  };

  const options = useMemo(
    () => [
      {
        label: "25%",
        value: initialAmount.multipliedBy(0.25).integerValue(),
      },
      {
        label: "50%",
        value: initialAmount.multipliedBy(0.5).integerValue(),
      },
      {
        label: "75%",
        value: initialAmount.multipliedBy(0.75).integerValue(),
      },
      {
        label: "100%",
        value: initialAmount,
      },
    ],
    [initialAmount],
  );

  const error = errors.amount || errors.redelegation || errors.unbonding;
  const warning = useMemo(() => focused && Object.values(warnings || {})[0], [focused, warnings]);

  const remainder = useMemo(
    () => denominate({ input: String(initialAmount.minus(amount)), showLastNonZeroDecimal: true }),
    [initialAmount, amount],
  );

  return (
    <Box my={2}>
      <Label>{label}</Label>

      <InputCurrency
        autoFocus={false}
        error={error}
        warning={warning}
        containerProps={{ grow: true }}
        unit={unit}
        value={amount}
        onChange={onAmountChange}
        onChangeFocus={() => setFocused(true)}
        renderLeft={<InputLeft>{constants.egldLabel}</InputLeft>}
        renderRight={
          <InputRight>
            {options.map(({ label, value }) => (
              <AmountButton
                active={value.eq(amount)}
                key={label}
                error={!!error}
                onClick={() => onAmountChange(value)}
              >
                {label}
              </AmountButton>
            ))}
          </InputRight>
        }
      />

      <Availability>
        {initialAmount.minus(amount).gt(0) ? (
          <Text fontSize={3} ff="Inter|Medium">
            <Trans
              i18nKey="vote.steps.castVotes.votes"
              values={{ total: `${remainder} ${constants.egldLabel}` }}
            />
          </Text>
        ) : initialAmount.isLessThan(amount) ? (
          <Box horizontal={true} color="alertRed">
            <Availability>
              <ExclamationCircle size={13} />
              <Box ml={1}>
                <Text fontSize={3} ff="Inter|Medium">
                  <Trans
                    i18nKey="vote.steps.castVotes.maxUsed"
                    values={{ total: `${remainder} ${constants.egldLabel}` }}
                  />
                </Text>
              </Box>
            </Availability>
          </Box>
        ) : (
          <Box horizontal={true} color="positiveGreen">
            <Availability>
              <Check size={13} />
              <Box ml={1}>
                <Text fontSize={3} ff="Inter|Medium">
                  <Trans i18nKey="vote.steps.castVotes.allVotesAreUsed" />
                </Text>
              </Box>
            </Availability>
          </Box>
        )}
      </Availability>
    </Box>
  );
}
