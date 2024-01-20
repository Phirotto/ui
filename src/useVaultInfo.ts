import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { providers, Contract } from "ethers";
import { VAULT_ABI } from "./constants";

const provider = new providers.JsonRpcProvider(import.meta.env.VITE_VAULT_RPC);

export type VaultInfo = {
  id: string;
  debt: BigNumber;
};

async function fetchVaultInfo(): Promise<VaultInfo> {
  const contract = new Contract(
    import.meta.env.VITE_VAULT_ADDRESS!,
    VAULT_ABI,
    provider
  );

  const requestedAmount: BigNumber.Value = await contract.requestedAmount();
  const fillPercent: BigNumber.Value = await contract.fillPercent();

  const debt = BigNumber(requestedAmount.toString())
    .div(100)
    .multipliedBy(BigNumber(100).minus(fillPercent.toString()));

  return {
    id: import.meta.env.VITE_VAULT_ADDRESS!,
    debt: debt.dividedBy(BigNumber(10).pow(18)),
  };
}

export function useVaultInfo() {
  return useQuery({
    queryKey: ["VAULT"],
    queryFn: () => fetchVaultInfo(),
  });
}
