import React, { useEffect, useState } from 'react';
import { SlackSheet } from '@/components/sheet';
import { useDimensions } from '@/hooks';
import { BackgroundProvider, Box } from '@/design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RewardsContent } from '@/screens/rewards/components/RewardsContent';
import { IS_ANDROID, IS_IOS } from '@/env';
import { StatusBar } from 'react-native';
import { useRewards } from '@/resources/rewards/rewardsQuery';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';

export const RewardsSheet: React.FC = () => {
  const { height } = useDimensions();
  const { top } = useSafeAreaInsets();
  const accountAddress = useSelector(
    (state: AppState) => state.settings.accountAddress
  );
  const [isLoading, setIsLoading] = useState(true);
  const { data, isLoading: queryIsLoading, isLoadingError } = useRewards({
    address: accountAddress,
  });

  useEffect(() => {
    setIsLoading(queryIsLoading);
  }, [queryIsLoading]);

  return (
    <BackgroundProvider color="surfaceSecondary">
      {({ backgroundColor }) => (
        // @ts-expect-error JS component
        <SlackSheet
          backgroundColor={backgroundColor}
          additionalTopPadding={IS_ANDROID ? StatusBar.currentHeight : false}
          {...(IS_IOS && { height: '100%' })}
          contentHeight={height - top}
          scrollEnabled
        >
          <Box padding="20px">
            <RewardsContent
              data={data}
              isLoadingError={isLoadingError}
              isLoading={isLoading}
            />
          </Box>
        </SlackSheet>
      )}
    </BackgroundProvider>
  );
};
