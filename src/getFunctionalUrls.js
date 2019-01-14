function getFunctionalUrls(apiUrl) {
  return {
    apiUrl,
    apiPathCreatePayment: `${apiUrl}/api/v1/payment`,
  };
}

export default getFunctionalUrls;
