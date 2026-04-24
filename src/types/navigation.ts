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
};

export type MainTabParamList = {
  RadarDashboard: undefined;
  TripHistory: undefined;
  Earnings: undefined;
  Dashboard: undefined;
};
