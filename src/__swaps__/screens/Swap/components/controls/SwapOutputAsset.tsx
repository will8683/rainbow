import MaskedView from '@react-native-masked-view/masked-view';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import Animated, { runOnJS, runOnUI, useAnimatedReaction, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { ScreenCornerRadius } from 'react-native-screen-corner-radius';

import { AnimatedText, Box, Column, Columns, Stack, useColorMode } from '@/design-system';
import { useTheme } from '@/theme';

import { GestureHandlerV1Button } from '@/__swaps__/screens/Swap/components/GestureHandlerV1Button';
import { SwapActionButton } from '@/__swaps__/screens/Swap/components/SwapActionButton';
import { AnimatedSwapCoinIcon } from '@/__swaps__/screens/Swap/components/SwapCoinIcon';
import { FadeMask } from '@/__swaps__/screens/Swap/components/FadeMask';
import { SwapInput } from '@/__swaps__/screens/Swap/components/SwapInput';
import { BalanceBadge } from '@/__swaps__/screens/Swap/components/BalanceBadge';
import { TokenList } from '@/__swaps__/screens/Swap/components/TokenList/TokenList';
import { BASE_INPUT_WIDTH, INPUT_INNER_WIDTH, INPUT_PADDING, THICK_BORDER_WIDTH } from '@/__swaps__/screens/Swap/constants';
import { IS_ANDROID } from '@/env';
import { useSwapContext } from '@/__swaps__/screens/Swap/providers/swap-provider';
import { ethereumUtils } from '@/utils';
import { isSameAssetWorklet } from '@/__swaps__/utils/assets';
import { useAssetsToSell } from '@/__swaps__/screens/Swap/hooks/useAssetsToSell';
import { useAccountSettings } from '@/hooks';
import { useExternalToken } from '@/resources/assets/externalAssetsQuery';
import { ParsedAsset } from '@/__swaps__/types/assets';
import { supportedCurrencies } from '@/references/supportedCurrencies';
import { TokenColors } from '@/graphql/__generated__/metadata';
import { ChainId } from '@/__swaps__/types/chains';

function SwapOutputActionButton() {
  const { isDarkMode } = useColorMode();
  const { SwapNavigation, SwapInputController } = useSwapContext();

  return (
    <SwapActionButton
      color={SwapInputController.bottomColor}
      disableShadow={isDarkMode}
      hugContent
      label={SwapInputController.assetToBuySymbol}
      onPress={runOnUI(SwapNavigation.handleOutputPress)}
      rightIcon={'􀆏'}
      small
    />
  );
}

function SwapOutputAmount() {
  const { focusedInput, SwapTextStyles, SwapInputController, AnimatedSwapStyles } = useSwapContext();

  return (
    <GestureHandlerV1Button
      disableButtonPressWrapper
      onPressStartWorklet={() => {
        'worklet';
        focusedInput.value = 'outputAmount';
      }}
    >
      <MaskedView maskElement={<FadeMask fadeEdgeInset={2} fadeWidth={8} height={36} side="right" />} style={styles.inputTextMask}>
        <AnimatedText
          ellipsizeMode="clip"
          numberOfLines={1}
          size="30pt"
          style={SwapTextStyles.outputAmountTextStyle}
          text={SwapInputController.formattedOutputAmount}
          weight="bold"
        />
        <Animated.View style={[styles.caretContainer, SwapTextStyles.outputCaretStyle]}>
          <Box as={Animated.View} borderRadius={1} style={[styles.caret, AnimatedSwapStyles.assetToBuyCaretStyle]} />
        </Animated.View>
      </MaskedView>
    </GestureHandlerV1Button>
  );
}

function SwapInputIcon() {
  const { SwapInputController } = useSwapContext();
  const theme = useTheme();
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const boxStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: SwapInputController.bottomColor.value,
    };
  });

  const colors = useDerivedValue(() => {
    return SwapInputController.assetToBuy?.value?.colors as TokenColors;
  });

  const chainId = useDerivedValue(() => {
    return SwapInputController.assetToBuy?.value?.chainId || ChainId.mainnet;
  });

  const symbol = useDerivedValue(() => {
    return SwapInputController.assetToBuy?.value?.symbol || '';
  });

  useAnimatedReaction(
    () => SwapInputController.assetToBuy?.value,
    (current, prev) => {
      if (current !== null && prev == null) {
        runOnJS(setShowPlaceholder)(false);
      }
    }
  );

  return (
    <Box paddingRight="10px">
      {showPlaceholder ? (
        <Box
          as={Animated.View}
          borderRadius={18}
          height={{ custom: 36 }}
          style={[styles.solidColorCoinIcon, boxStyles]}
          width={{ custom: 36 }}
        />
      ) : (
        <AnimatedSwapCoinIcon
          colors={colors}
          chainId={chainId}
          symbol={symbol}
          iconUrl={SwapInputController.assetToBuyIconUrl}
          fallbackColor={SwapInputController.bottomColor}
          large
          theme={theme}
        />
      )}
    </Box>
  );
}

function OutputAssetBalanceBadge() {
  const { SwapInputController } = useSwapContext();

  const userAssets = useAssetsToSell();

  const label = useDerivedValue(() => {
    const assetToBuy = SwapInputController.assetToBuy.value;
    if (!assetToBuy) return 'No balance';
    const userAsset = userAssets.find(userAsset => isSameAssetWorklet(userAsset, assetToBuy));
    return userAsset?.balance.display ?? 'No balance';
  });

  return <BalanceBadge label={label} />;
}

export function SwapOutputAsset() {
  const { outputProgress, inputProgress, AnimatedSwapStyles, SwapTextStyles, SwapInputController, SwapNavigation } = useSwapContext();

  return (
    <SwapInput bottomInput color={SwapInputController.bottomColor} otherInputProgress={inputProgress} progress={outputProgress}>
      <Box as={Animated.View} style={AnimatedSwapStyles.outputStyle}>
        <Stack space="16px">
          <Columns alignHorizontal="justify" alignVertical="center">
            <Column width="content">
              <SwapInputIcon />
            </Column>
            <SwapOutputAmount />
            <Column width="content">
              <SwapOutputActionButton />
            </Column>
          </Columns>
          <Columns alignHorizontal="justify" alignVertical="center" space="10px">
            <AnimatedText
              numberOfLines={1}
              size="17pt"
              style={SwapTextStyles.outputNativeValueStyle}
              text={SwapInputController.formattedOutputNativeValue}
              weight="heavy"
            />
            <Column width="content">
              <OutputAssetBalanceBadge />
            </Column>
          </Columns>
        </Stack>
      </Box>
      <Box
        as={Animated.View}
        height="full"
        padding={{ custom: INPUT_PADDING }}
        paddingBottom={{ custom: 14.5 }}
        position="absolute"
        style={AnimatedSwapStyles.outputTokenListStyle}
        width={{ custom: INPUT_INNER_WIDTH }}
      >
        <TokenList
          color={SwapInputController.bottomColor.value}
          handleExitSearch={runOnUI(SwapNavigation.handleExitSearch)}
          handleFocusSearch={runOnUI(SwapNavigation.handleFocusOutputSearch)}
          output
        />
      </Box>
    </SwapInput>
  );
}

export const styles = StyleSheet.create({
  backgroundOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
  },
  caret: {
    height: 32,
    width: 2,
  },
  caretContainer: {
    flexGrow: 100,
    flexShrink: 0,
  },
  flipButton: {
    borderRadius: 15,
    height: 30,
    width: 30,
  },
  headerButton: {
    borderRadius: 18,
    borderWidth: THICK_BORDER_WIDTH,
    height: 36,
    width: 36,
  },
  headerTextShadow: {
    padding: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  inputTextMask: { alignItems: 'center', flexDirection: 'row', height: 36, pointerEvents: 'box-only' },
  rootViewBackground: {
    backgroundColor: 'transparent',
    borderRadius: IS_ANDROID ? 20 : ScreenCornerRadius,
    flex: 1,
    overflow: 'hidden',
    marginTop: StatusBar.currentHeight ?? 0,
  },
  solidColorCoinIcon: {
    opacity: 0.4,
  },
  staticInputContainerStyles: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 9,
  },
  staticInputStyles: {
    borderCurve: 'continuous',
    borderRadius: 30,
    borderWidth: THICK_BORDER_WIDTH,
    overflow: 'hidden',
    padding: INPUT_PADDING,
    width: BASE_INPUT_WIDTH,
  },
  textIconGlow: {
    padding: 16,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
