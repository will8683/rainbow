import { IS_IOS } from '@/env';

const Routes = {
  ADD_CASH_SCREEN_NAVIGATOR: 'AddCashSheetNavigator',
  ADD_CASH_SHEET: 'AddCashSheet',
  ADD_TOKEN_SHEET: 'AddTokenSheet',
  ADD_WALLET_NAVIGATOR: 'AddWalletNavigator',
  ADD_WALLET_SHEET: 'AddWalletSheet',
  AVATAR_BUILDER: 'AvatarBuilder',
  AVATAR_BUILDER_WALLET: 'AvatarBuilderWallet',
  BACKUP_SCREEN: 'BackupScreen',
  BACKUP_SHEET: 'BackupSheet',
  CHANGE_WALLET_SHEET: 'ChangeWalletSheet',
  CHANGE_WALLET_SHEET_NAVIGATOR: 'ChangeWalletSheetNavigator',
  HARDWARE_WALLET_TX_NAVIGATOR: 'HardwareWalletTxNavigator',
  CONFIRM_REQUEST: 'ConfirmRequest',
  CONNECTED_DAPPS: 'ConnectedDapps',
  CURRENCY_SELECT_SCREEN: 'CurrencySelectScreen',
  CUSTOM_GAS_SHEET: 'CustomGasSheet',
  DISCOVER_SCREEN: 'DiscoverScreen',
  ENS_ADDITIONAL_RECORDS_SHEET: 'ENSAdditionalRecordsSheet',
  ENS_ASSIGN_RECORDS_SHEET: 'ENSAssignRecordsSheet',
  ENS_CONFIRM_REGISTER_SHEET: 'ENSConfirmRegisterSheet',
  ENS_INTRO_SHEET: 'ENSIntroSheet',
  ENS_SEARCH_SHEET: 'ENSSearchSheet',
  EXCHANGE_MODAL: 'ExchangeModal',
  EXPANDED_ASSET_SCREEN: 'ExpandedAssetScreen',
  EXPANDED_ASSET_SHEET: 'ExpandedAssetSheet',
  EXPANDED_ASSET_SHEET_POOLS: 'ExpandedAssetSheetPools',
  EXPLAIN_SHEET: 'ExplainSheet',
  PORTAL: 'Portal',
  EXTERNAL_LINK_WARNING_SHEET: 'ExternalLinkWarningSheet',
  IMPORT_SCREEN: 'ImportScreen',
  IMPORT_OR_WATCH_WALLET_SHEET: 'ImportOrWatchWalletSheet',
  LEARN_WEB_VIEW_SCREEN: 'LearnWebViewScreen',
  MAIN_EXCHANGE_NAVIGATOR: 'MainExchangeNavigator',
  MAIN_EXCHANGE_SCREEN: 'MainExchangeScreen',
  MAIN_NATIVE_BOTTOM_SHEET_NAVIGATOR: 'MainNativeBottomSheetNavigation',
  MAIN_NAVIGATOR: 'MainNavigator',
  MAIN_NAVIGATOR_WRAPPER: 'MainNavigatorWrapper',
  MODAL_SCREEN: 'ModalScreen',
  NATIVE_STACK: 'NativeStack',
  NETWORK_SWITCHER: 'NetworkSection',
  NFT_OFFERS_SHEET: 'NFTOffersSheet',
  NOTIFICATIONS_PROMO_SHEET: 'NotificationsPromoSheet',
  OP_REWARDS_SHEET: 'OpRewardsSheet',
  PAIR_HARDWARE_WALLET_AGAIN_SHEET: 'PairHardwareWalletAgainSheet',
  PAIR_HARDWARE_WALLET_ERROR_SHEET: 'PairHardwareWalletErrorSheet',
  PAIR_HARDWARE_WALLET_INTRO_SHEET: 'PairHardwareWalletIntroSheet',
  PAIR_HARDWARE_WALLET_NAVIGATOR: 'PairHardwareWalletNavigator',
  PAIR_HARDWARE_WALLET_SEARCH_SHEET: 'PairHardwareWalletSearchSheet',
  PAIR_HARDWARE_WALLET_SIGNING_SHEET: 'PairHardwareWalletSigningSheet',
  PAIR_HARDWARE_WALLET_SUCCESS_SHEET: 'PairHardwareWalletSuccessSheet',
  PIN_AUTHENTICATION_SCREEN: 'PinAuthenticationScreen',
  PROFILE_PREVIEW_SHEET: 'ProfilePreviewSheet',
  PROFILE_SCREEN: 'ProfileScreen',
  PROFILE_SHEET: 'ProfileSheet',
  QR_SCANNER_SCREEN: 'QRScannerScreen',
  RECEIVE_MODAL: 'ReceiveModal',
  REGISTER_ENS_NAVIGATOR: 'RegisterEnsNavigator',
  RESTORE_SHEET: 'RestoreSheet',
  SAVINGS_DEPOSIT_MODAL: 'SavingsDepositModal',
  SAVINGS_SHEET: 'SavingsSheet',
  SAVINGS_WITHDRAW_MODAL: 'SavingsWithdrawModal',
  SELECT_ENS_SHEET: 'SelectENSSheet',
  SELECT_UNIQUE_TOKEN_SHEET: 'SelectUniqueTokenSheet',
  SEND_CONFIRMATION_SHEET: 'SendConfirmationSheet',
  SEND_SHEET: 'SendSheet',
  SEND_SHEET_NAVIGATOR: 'SendSheetNavigator',
  SETTINGS_SHEET: 'SettingsSheet',
  SHOWCASE_SHEET: 'ShowcaseSheet',
  SPEED_UP_AND_CANCEL_BOTTOM_SHEET: 'SpeedUpAndCancelBootomSheet',
  SPEED_UP_AND_CANCEL_SHEET: 'SpeedUpAndCancelSheet',
  STACK: 'Stack',
  SWAPS_PROMO_SHEET: 'SwapsPromoSheet',
  SWAP_DETAILS_SHEET: 'SwapDetailsSheet',
  SWAP_SETTINGS_SHEET: 'SwapSettingsSheet',
  SWIPE_LAYOUT: 'SwipeLayout',
  TOKEN_INDEX_SCREEN: 'TokenIndexScreen',
  TOKEN_INDEX_SHEET: 'TokenIndexSheet',
  TRANSACTION_DETAILS: 'TransactionDetails',
  WALLET_CONNECT_APPROVAL_SHEET: 'WalletConnectApprovalSheet',
  WALLET_CONNECT_REDIRECT_SHEET: 'WalletConnectRedirectSheet',
  WALLET_DIAGNOSTICS_SHEET: 'WalletDiagnosticsSheet',
  WALLET_NOTIFICATIONS_SETTINGS: 'WalletNotificationsSettings',
  WALLET_SCREEN: 'WalletScreen',
  WELCOME_SCREEN: 'WelcomeScreen',
};

export const NATIVE_ROUTES = [
  Routes.RECEIVE_MODAL,
  Routes.SETTINGS_SHEET,
  Routes.EXCHANGE_MODAL,
  Routes.EXPANDED_ASSET_SHEET,
  Routes.TOKEN_INDEX_SHEET,
  Routes.CHANGE_WALLET_SHEET,
  Routes.MODAL_SCREEN,
  Routes.SAVINGS_SHEET,
  Routes.SAVINGS_WITHDRAW_MODAL,
  Routes.SAVINGS_DEPOSIT_MODAL,
  ...(IS_IOS
    ? [Routes.SEND_SHEET_NAVIGATOR, Routes.ADD_CASH_SCREEN_NAVIGATOR]
    : []),
];

const RoutesWithPlatformDifferences = {
  ...Routes,
  SEND_FLOW: Routes.SEND_SHEET_NAVIGATOR,
};

export default RoutesWithPlatformDifferences;
