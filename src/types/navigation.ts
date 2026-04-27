export type RootStackParamList = {
  QuickLogin: undefined;
  PhoneAuth: { phone: string };
  OTPVerification: { phone: string };
  PersonalDocuments: undefined;
  VehicleInformation: undefined;
  Drafts: undefined;
  MainTabs: undefined;
  RideRequest: undefined;
  RideNavigation: undefined;
  Settings: undefined;
  Help: undefined;
  TermsOfService: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  RadarDashboard: undefined;
  TripHistory: undefined;
  Earnings: undefined;
  Dashboard: undefined;
};
