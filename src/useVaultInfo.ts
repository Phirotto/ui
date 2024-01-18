import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";

export type VaultInfo = {
  id: string;
  debt: BigNumber;
};

async function fetchVaultInfo(): Promise<VaultInfo> {
  return {
    id: "123",
    debt: BigNumber("230"),
  };
}

export function useVaultInfo() {
  return useQuery({
    queryKey: ["VAULT"],
    queryFn: fetchVaultInfo,
  });
}
