import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { SUPPORTED_CHAIN_IDS } from "./constants";
import { useBalances } from "./useBalances";
import { Balances } from "./Balances";
import { PaymentForm } from "./PaymentForm";
import { useVaultInfo } from "./useVaultInfo";

function checkContext({ connected, safe }: ReturnType<typeof useSafeAppsSDK>) {
  return {
    connected,
    chainSupported: SUPPORTED_CHAIN_IDS.includes(safe.chainId),
    address: safe.safeAddress,
    isReadOnly: safe.isReadOnly,
  };
}

function App() {
  const { address } = checkContext(useSafeAppsSDK());
  const { data: vault } = useVaultInfo();

  const { data } = useBalances();

  return (
    <div className="h-full w-full justify-center items-center flex object-center">
      <Card className="bg-zinc-50 size-10/12">
        <CardHeader className="text-center">
          <CardTitle>Time to pay debts</CardTitle>
          <CardDescription>{address}</CardDescription>
        </CardHeader>
        <CardContent>
          <Balances />
          {data && vault && <PaymentForm assets={data} vault={vault} />}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
