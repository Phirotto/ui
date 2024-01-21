import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { BaseTransaction } from "@safe-global/safe-apps-sdk";
import { useMutation } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { Contract } from "ethers";

type Position = { address: string; amount: BigNumber.Value };

type UsePayResult = {
  pay(entries: Array<Position>): void;
  error: unknown;
  isPending: boolean;
};

export function usePay(): UsePayResult {
  const { sdk } = useSafeAppsSDK();

  const erc = Contract.getInterface([
    "function approve(address,uint256) public returns(bool)",
  ]);
  const gateway = Contract.getInterface([
    "function deposit(string,address,uint256) public",
  ]);

  const { mutate, error, isPending } = useMutation<
    unknown,
    unknown,
    Array<Position>
  >({
    mutationFn: async (args) => {
      debugger;
      return sdk.txs.send({
        txs: [
          ...args.map<BaseTransaction>((p) => ({
            to: p.address,
            value: "0",
            data: erc.encodeFunctionData("approve", [
              import.meta.env.VITE_GATEWAY_ADDRESS,
              p.amount.toString(),
            ]),
          })),
          ...args.map<BaseTransaction>((p) => ({
            to: import.meta.env.VITE_GATEWAY_ADDRESS,
            value: "0",
            data: gateway.encodeFunctionData("deposit", [
              import.meta.env.VITE_GATEWAY_VAULT_NAME,
              p.address,
              p.amount.toString(),
            ]),
          })),
        ],
        params: {
          safeTxGas: 1_000_000,
        },
      });
    },
    mutationKey: ["PAY"],
  });

  return {
    pay: mutate,
    isPending,
    error,
  };
}
