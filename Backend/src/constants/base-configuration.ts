export const BASE_CONFIGURATION: RollingTypes.Configuration = {
  maintenance: false,
  users: {
    signUp: false,
  },
  admin: {
    endpointsEnabled: false,
  },
  address: {
    submissionEnabled: false,
  },
  product: {
    submissionEnabled: false,
  },
  rateLimiting: {
    badAuthentication: {
      enabled: false,
      penalty: 0,
      flaggedStatusCodes: [],
    },
  },
  order: {
    orderPlacingEnabled: false,
  },
};
