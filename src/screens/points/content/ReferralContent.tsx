import { ButtonPressAnimation } from '@/components/animations';
import { navbarHeight } from '@/components/navbar/Navbar';
import {
  Bleed,
  Box,
  Inline,
  Stack,
  Text,
  useForegroundColor,
  useTextStyle,
} from '@/design-system';
import { IS_IOS } from '@/env';
import { metadataPOSTClient } from '@/graphql';
import {
  useAccountAccentColor,
  useDimensions,
  useKeyboardHeight,
  useWallets,
} from '@/hooks';
import { useNavigation } from '@/navigation';
import { TAB_BAR_HEIGHT } from '@/navigation/SwipeNavigator';
import { haptics, watchingAlert } from '@/utils';
import { delay } from '@/utils/delay';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, TextInput } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { WrappedAlert as Alert } from '@/helpers/alert';
import * as i18n from '@/languages';
import Routes from '@/navigation/routesNames';
import { PointsErrorType } from '@/graphql/__generated__/metadata';
import { RainbowError, logger } from '@/logger';
import { PointsActionButton } from '@/screens/points/components/PointsActionButton';
import { PointsIconAnimation } from '../components/PointsIconAnimation';
import {
  pointsReferralCodeQueryKey,
  usePointsReferralCode,
} from '@/resources/points';
import { useTheme } from '@/theme';
import { queryClient } from '@/react-query';
import { getRawReferralCode } from '../utils';

export type ReferralContentParams = {
  walletType?: 'new' | 'existing';
  externalReferralCode?: string;
};

export type RouteParams = {
  ReferralContentParams: ReferralContentParams;
};

export default function ReferralContent() {
  const { params } = useRoute<
    RouteProp<RouteParams, 'ReferralContentParams'>
  >();
  const { colors } = useTheme();
  const { accentColor = colors.appleBlue } = useAccountAccentColor();
  const {
    getState: dangerouslyGetState,
    goBack,
    navigate,
    // @ts-expect-error Navigation types
    replace,
  } = useNavigation();
  const { isReadOnlyWallet } = useWallets();
  const { height: deviceHeight } = useDimensions();
  const keyboardHeight = useKeyboardHeight();
  const { data: externalReferralCode } = usePointsReferralCode();

  const [referralCode, setReferralCode] = useState('');
  const [status, setStatus] = useState<'incomplete' | 'valid' | 'invalid'>(
    'incomplete'
  );

  const isFromWelcomeScreen = !!params?.walletType;

  const textInputRef = React.useRef<TextInput>(null);

  const validateReferralCode = useCallback(async (code: string) => {
    const res = await metadataPOSTClient.validateReferral({
      code: getRawReferralCode(code),
    });
    if (!res?.validateReferral?.valid) {
      if (
        res.validateReferral?.error?.type ===
        PointsErrorType.InvalidReferralCode
      ) {
        setStatus('invalid');
        haptics.notificationError();
      } else {
        logger.error(new RainbowError('Error validating referral code'), {
          referralCode: code,
        });
        Alert.alert(i18n.t(i18n.l.points.referral.error));
      }
    } else {
      setStatus('valid');
      textInputRef.current?.blur();
      haptics.notificationSuccess();
    }
  }, []);

  useEffect(() => {
    if (externalReferralCode) {
      setReferralCode(externalReferralCode);
      validateReferralCode(externalReferralCode);
    }
  }, [externalReferralCode, validateReferralCode]);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isKeyboardOpening, setIsKeyboardOpening] = useState(false);

  const hasKeyboard = IS_IOS ? isKeyboardOpening : isKeyboardVisible;

  const contentBottom =
    (hasKeyboard ? keyboardHeight : TAB_BAR_HEIGHT) +
    (deviceHeight - (hasKeyboard ? keyboardHeight : 0) - navbarHeight - 270) /
      2 -
    (isFromWelcomeScreen && IS_IOS ? 50 : 0);

  const contentBottomSharedValue = useSharedValue(contentBottom);

  useEffect(() => {
    contentBottomSharedValue.value = withTiming(contentBottom);
  }, [contentBottom, contentBottomSharedValue]);

  useFocusEffect(
    useCallback(() => {
      delay(400).then(() => textInputRef.current?.focus());
    }, [])
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setIsKeyboardOpening(true);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setIsKeyboardOpening(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      bottom: contentBottomSharedValue.value,
    };
  });

  const red = useForegroundColor('red');
  const statusColor = status === 'invalid' ? red : accentColor;
  const inputTextStyle = useTextStyle({
    align: 'left',
    color: 'label',
    size: '20pt',
    weight: 'heavy',
  });

  const onChangeText = useCallback(
    (code: string) => {
      let formattedCode = getRawReferralCode(code);

      // If the user backspaces over the hyphen, remove the character before the hyphen
      if (referralCode.length === 4 && code.length === 3) {
        formattedCode = formattedCode.slice(0, -1);
      }

      // Insert "-" after the 3rd character if the length is 4 or more
      if (formattedCode.length >= 3) {
        formattedCode =
          formattedCode.slice(0, 3) + '-' + formattedCode.slice(3, 7);
      }

      // Update the state and the input
      setReferralCode(formattedCode); // Limit to 6 characters + '-'

      if (formattedCode.length !== 7) {
        setStatus('incomplete');
      } else {
        validateReferralCode(formattedCode);
      }
    },
    [referralCode.length, validateReferralCode]
  );

  return (
    <Box
      background={
        params?.walletType === 'existing'
          ? 'surfaceSecondary'
          : 'surfacePrimary'
      }
      height="full"
      justifyContent="flex-end"
      alignItems="center"
      paddingBottom={{ custom: 134 }}
    >
      <Box
        as={Animated.View}
        position="absolute"
        paddingHorizontal="60px"
        style={animatedStyle}
      >
        <Stack space="24px">
          <Stack space="16px">
            <Stack space="32px" alignHorizontal="center">
              <Stack space="20px" alignHorizontal="center">
                <Stack space="28px" alignHorizontal="center">
                  <PointsIconAnimation />
                  <Text size="22pt" weight="heavy" align="center" color="label">
                    {i18n.t(i18n.l.points.referral.title)}
                  </Text>
                </Stack>
                <Text
                  size="15pt"
                  weight="semibold"
                  align="center"
                  color="labelTertiary"
                >
                  {i18n.t(i18n.l.points.referral.subtitle)}
                </Text>
              </Stack>

              <Box
                background={
                  params?.walletType === 'existing'
                    ? 'surfaceSecondary'
                    : 'surfacePrimary'
                }
                style={{
                  borderRadius: 18,
                  borderWidth: 2,
                  borderColor: statusColor,
                  height: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                  minWidth: IS_IOS ? 140 : undefined,
                  shadowOffset: {
                    width: 0,
                    height: 13,
                  },
                  shadowRadius: 26,
                  shadowColor: statusColor,
                  shadowOpacity: 0.1,
                  elevation: 26,
                }}
              >
                <Inline alignVertical="center" space="6px">
                  <TextInput
                    ref={textInputRef}
                    value={referralCode}
                    style={{
                      height: 48,
                      ...(IS_IOS ? inputTextStyle : {}),
                    }}
                    autoFocus={false}
                    maxLength={7}
                    selectionColor={statusColor}
                    textAlign="left"
                    autoCapitalize="characters"
                    placeholder="XXX-XXX"
                    onChangeText={onChangeText}
                  />
                  {status === 'valid' && (
                    <Bleed horizontal="2px">
                      <Text
                        weight="heavy"
                        size="17pt"
                        align="center"
                        color={{ custom: accentColor }}
                      >
                        􀁣
                      </Text>
                    </Bleed>
                  )}
                </Inline>
              </Box>
            </Stack>
            <Text
              size="13pt"
              weight="heavy"
              align="center"
              color={{ custom: status === 'invalid' ? red : 'transparent' }}
            >
              {i18n.t(i18n.l.points.referral.invalid_code)}
            </Text>
          </Stack>
          {isFromWelcomeScreen && (
            <PointsActionButton
              color={accentColor}
              outline={status !== 'valid'}
              label={
                status === 'valid'
                  ? i18n.t(i18n.l.points.referral.continue)
                  : i18n.t(i18n.l.points.referral.skip)
              }
              onPress={() => {
                if (params?.walletType === 'new') {
                  goBack();
                  const operation =
                    dangerouslyGetState().index === 1 ? navigate : replace;
                  operation(Routes.SWIPE_LAYOUT, {
                    params: { emptyWallet: true },
                    screen: Routes.WALLET_SCREEN,
                  });
                } else if (params?.walletType === 'existing') {
                  navigate(Routes.ADD_WALLET_SHEET);
                } else {
                  return;
                }
                if (status === 'valid') {
                  queryClient.setQueryData(
                    pointsReferralCodeQueryKey,
                    referralCode
                  );
                }
              }}
            />
          )}
        </Stack>
      </Box>
      {hasKeyboard && !isFromWelcomeScreen && (
        <Box
          position="absolute"
          bottom={{
            custom: keyboardHeight + 28,
          }}
          left={{ custom: 20 }}
        >
          <ButtonPressAnimation
            onPress={() => {
              goBack();
              setReferralCode('');
              setStatus('incomplete');
            }}
          >
            <Text color={{ custom: accentColor }} size="20pt" weight="bold">
              {`􀆉 ${i18n.t(i18n.l.points.referral.back)}`}
            </Text>
          </ButtonPressAnimation>
        </Box>
      )}
      {!hasKeyboard && status === 'valid' && !isFromWelcomeScreen && (
        <PointsActionButton
          color={accentColor}
          label={i18n.t(i18n.l.points.referral.get_started)}
          onPress={() =>
            isReadOnlyWallet
              ? watchingAlert()
              : navigate(Routes.CONSOLE_SHEET, {
                  referralCode,
                })
          }
        />
      )}
    </Box>
  );
}
