import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import SafeAppsSDK from "@safe-global/safe-apps-sdk";
import { SUPPORTED_CURRENCIES } from "./constants";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

function getDecimalBalance(balance: string, decimals: number): BigNumber {
  return BigNumber(balance).div(BigNumber(10).pow(decimals));
}

async function fetchBalances(sdk: SafeAppsSDK) {
  const safeInfo = await sdk.safe.getInfo();
  const response = await sdk.safe.experimental_getBalances();

  const payableCurrencies = SUPPORTED_CURRENCIES.get(safeInfo.chainId);

  return response.items
    .filter(
      (item) =>
        item.tokenInfo.address &&
        (!payableCurrencies ||
          payableCurrencies.includes(item.tokenInfo.address.toLowerCase()))
    )
    .map((i) => ({
      ...i,
      decimalBalance: getDecimalBalance(i.balance, i.tokenInfo.decimals),
    }));
}

export function useBalances() {
  const { sdk } = useSafeAppsSDK();
  return useQuery({
    queryKey: ["BALANCES"],
    queryFn: () => fetchBalances(sdk),
  });
}
