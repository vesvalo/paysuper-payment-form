export default function getFunctionalUrls(apiUrl) {
  return {
    apiUrl,
    apiPathCreatePayment: `${apiUrl}/api/v1/payment`,
  };
}
