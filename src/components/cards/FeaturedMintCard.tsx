import styled from '@/styled-thing';
import {
  AccentColorProvider,
  Box,
  ColorModeProvider,
  Column,
  Columns,
  Cover,
  Inline,
  Inset,
  Stack,
  Text,
  globalColors,
  useColorMode,
  useForegroundColor,
} from '@/design-system';
import React, { useEffect, useMemo, useState } from 'react';
import { ButtonPressAnimation } from '../animations';
import { useMintableCollections } from '@/resources/mintdotfun';
import { useAccountProfile, useDimensions } from '@/hooks';
import { usePersistentDominantColorFromImage } from '@/hooks/usePersistentDominantColorFromImage';
import { ImgixImage } from '../images';
import { abbreviateNumber } from '@/helpers/utilities';
import { BlurView } from '@react-native-community/blur';
import { Image, Linking, View } from 'react-native';
import { IS_IOS } from '@/env';
import c from 'chroma-js';
import { maybeSignUri } from '@/handlers/imgix';
import { Media, MimeType } from '../media';

const IMAGE_SIZE = 111;

const BlurWrapper = styled(View).attrs({
  shouldRasterizeIOS: true,
})({
  // @ts-expect-error missing theme types
  backgroundColor: ({ theme: { colors } }) => colors.trueBlack,
  height: '100%',
  left: 0,
  overflow: 'hidden',
  position: 'absolute',
  width: '100%',
});

export function FeaturedMintCard() {
  const { accountAddress } = useAccountProfile();
  const {
    data: {
      getMintableCollections: { featuredCollection },
    },
  } = useMintableCollections({
    walletAddress: accountAddress,
  });
  const { width: deviceWidth } = useDimensions();
  const [loaded, setLoaded] = useState(false);
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';

  const labelSecondary = useForegroundColor('labelSecondary');
  const imageUrl =
    'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/alphachannel.svg' ??
    featuredCollection?.imageURL ??
    featuredCollection?.recentMints.find(m => m.imageURI)?.imageURI;
  const accentColor = usePersistentDominantColorFromImage(imageUrl);
  const secondaryTextColor = imageUrl ? 'accent' : 'labelSecondary';

  useEffect(() => setLoaded(false), [imageUrl]);

  return featuredCollection ? (
    <Inset vertical="10px">
      <ColorModeProvider value="darkTinted">
        <AccentColorProvider color={accentColor ?? labelSecondary}>
          <View
            style={
              IS_IOS
                ? {
                    shadowColor: globalColors.grey100,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.02,
                    shadowRadius: 3,
                  }
                : {}
            }
          >
            <View
              style={
                IS_IOS
                  ? {
                      shadowColor: globalColors.grey100,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: isDarkMode ? 0.24 : 0.08,
                      shadowRadius: 9,
                    }
                  : {
                      shadowColor: globalColors.grey100,
                      elevation: 12,
                      shadowOpacity: 1,
                    }
              }
            >
              <ButtonPressAnimation
                style={{
                  borderRadius: 24,
                  // borderWidth: 1,
                  // borderColor: 'rgba(245, 248, 255, 0.08)',
                  overflow: 'hidden',
                  padding: 12,
                }}
                onPress={() => Linking.openURL(featuredCollection.externalURL)}
                scaleTo={0.96}
              >
                <Cover>
                  <BlurWrapper>
                    {!!imageUrl && (
                      <Cover>
                        <ImgixImage
                          resizeMode="cover"
                          style={{
                            borderRadius: 24,
                            height: '100%',
                            width: '100%',
                          }}
                          source={{ uri: imageUrl }}
                          size={deviceWidth - 40}
                          fm="png"
                        />
                      </Cover>
                    )}
                    <Cover>
                      <BlurView
                        blurAmount={100}
                        blurType="light"
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </Cover>
                    <Cover>
                      <View
                        style={{
                          height: '100%',
                          width: '100%',
                          backgroundColor: `rgba(22, 22, 22, ${ios ? 0.5 : 1})`,
                        }}
                      />
                    </Cover>
                  </BlurWrapper>
                </Cover>
                <Columns>
                  <Column>
                    <Box
                      alignItems="flex-start"
                      justifyContent="space-between"
                      flexGrow={1}
                      flexBasis={0}
                      padding="8px"
                    >
                      <Stack space="10px">
                        <Inline space="6px" alignVertical="center">
                          <Text
                            size="11pt"
                            align="center"
                            weight="heavy"
                            color={secondaryTextColor}
                          >
                            􀫸
                          </Text>
                          <Text
                            size="13pt"
                            weight="heavy"
                            color={secondaryTextColor}
                          >
                            Featured Mint
                          </Text>
                        </Inline>
                        <Text
                          size="20pt"
                          weight="heavy"
                          color="label"
                          numberOfLines={1}
                        >
                          {featuredCollection.name}
                        </Text>
                      </Stack>
                      <Stack space={{ custom: 14 }}>
                        <Inline space="6px" alignVertical="center">
                          <Text
                            size="11pt"
                            align="center"
                            weight="heavy"
                            color={secondaryTextColor}
                          >
                            􀋥
                          </Text>
                          <Text size="13pt" weight="heavy" color="label">
                            {`${abbreviateNumber(
                              featuredCollection.totalMints
                            )} mint${
                              featuredCollection.totalMints === 1 ? '' : 's'
                            }`}
                          </Text>
                        </Inline>
                        <Inline space="6px" alignVertical="center">
                          <Text
                            size="11pt"
                            align="center"
                            weight="heavy"
                            color={secondaryTextColor}
                          >
                            􀐫
                          </Text>
                          <Text size="13pt" weight="heavy" color="label">
                            {`${abbreviateNumber(
                              featuredCollection.mintsLastHour
                            )} past hour`}
                          </Text>
                        </Inline>
                      </Stack>
                    </Box>
                  </Column>
                  <Column width="content">
                    {!loaded ? (
                      <Box
                        background="fillSecondary"
                        width={{ custom: IMAGE_SIZE }}
                        height={{ custom: IMAGE_SIZE }}
                        borderRadius={12}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Text
                          size="20pt"
                          weight="semibold"
                          color="labelQuaternary"
                          align="center"
                        >
                          􀣵
                        </Text>
                      </Box>
                    ) : (
                      <Box
                        width={{ custom: IMAGE_SIZE }}
                        height={{ custom: IMAGE_SIZE }}
                      />
                    )}
                    <Cover>
                      {!!imageUrl && (
                        <View
                          style={
                            IS_IOS
                              ? {
                                  shadowColor: globalColors.grey100,
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.02,
                                  shadowRadius: 3,
                                }
                              : {}
                          }
                        >
                          <View
                            style={
                              IS_IOS
                                ? {
                                    shadowColor:
                                      isDarkMode || !accentColor
                                        ? globalColors.grey100
                                        : accentColor,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.16,
                                    shadowRadius: 6,
                                  }
                                : {
                                    shadowColor:
                                      isDarkMode || !accentColor
                                        ? globalColors.grey100
                                        : accentColor,
                                    elevation: 8,
                                    opacity: 1,
                                  }
                            }
                          >
                            {/* <Image
                              source={{
                                uri: maybeSignUri(imageUrl, {
                                  w: IMAGE_SIZE,
                                }),
                              }}
                              style={{
                                width: IMAGE_SIZE,
                                height: IMAGE_SIZE,
                                borderRadius: 12,
                              }}
                              onLoad={() => setLoaded(true)}
                            /> */}
                            <Media
                              url={imageUrl}
                              mimeType={MimeType.SVG}
                              style={{
                                width: IMAGE_SIZE,
                                height: IMAGE_SIZE,
                                borderRadius: 12,
                              }}
                              size={IMAGE_SIZE}
                            />
                          </View>
                        </View>
                      )}
                    </Cover>
                  </Column>
                </Columns>
              </ButtonPressAnimation>
            </View>
          </View>
        </AccentColorProvider>
      </ColorModeProvider>
    </Inset>
  ) : (
    <></>
  );
}
