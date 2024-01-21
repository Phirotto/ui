import { useCallback, useMemo, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { useBalances } from "./useBalances";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import BigNumber from "bignumber.js";
import { VaultInfo } from "./useVaultInfo";
import { usePay } from "./usePay";

type Row = {
  assetName?: string;
  assetAddress?: string;
  balance: number;
};

interface PaymentFormProps {
  assets: NonNullable<ReturnType<typeof useBalances>["data"]>;
  vault: VaultInfo;
}

interface PaymentPositionProps {
  position: Row;
  positionIndex: number;
  assets: NonNullable<ReturnType<typeof useBalances>["data"]>;
  availableAssets: Array<string>;
  selectAmountForPosition: (amount: number) => void;
  selectAssetForPosition: (asset: string) => void;
}

function PaymentPosition({
  assets,
  availableAssets,
  position,
  positionIndex,
  selectAmountForPosition,
  selectAssetForPosition,
}: PaymentPositionProps) {
  const asset = assets.find((a) => a.tokenInfo.symbol === position.assetName);

  return (
    <div
      className="w-full flex flex-row items-end justify-evenly my-2"
      key={positionIndex}
    >
      <div className="basis-1/3">
        <Select onValueChange={(v) => selectAssetForPosition(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Asset" />
          </SelectTrigger>
          <SelectContent>
            {position.assetName && (
              <SelectItem value={position.assetName} disabled>
                {position.assetName.toUpperCase()}
              </SelectItem>
            )}
            {availableAssets.map((assetToSelect) => (
              <SelectItem value={assetToSelect}>
                {assetToSelect.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="basis-1/3 items-center gap-1.5">
        <Label htmlFor="amount">
          Amount{" "}
          {position.assetName && <>Max: {asset?.decimalBalance.toString()}$</>}
        </Label>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="number"
            id="amount"
            placeholder="Amount"
            min={0}
            max={asset?.decimalBalance.toNumber()}
            disabled={position.assetName == null}
            onChange={(e) => selectAmountForPosition(e.target.valueAsNumber)}
            value={position.balance}
          />
          <Button
            variant="outline"
            disabled={position.assetName == null}
            onClick={() =>
              selectAmountForPosition(asset!.decimalBalance.toNumber())
            }
          >
            Max
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PaymentForm({ assets = [], vault }: PaymentFormProps) {
  const [positions, setPositions] = useState<Array<Row>>([]);
  const { pay } = usePay();

  const addRow = useCallback(() => {
    setPositions([
      ...positions,
      {
        balance: 0,
      },
    ]);
  }, [setPositions, positions]);

  const availableAssets = useMemo(
    () =>
      assets
        .map((a) => a.tokenInfo.symbol)
        .filter((a) => !positions.find((p) => p.assetName === a)),
    [assets, positions]
  );

  const selectAssetForPosition = useCallback(
    (i: number, v: string) => {
      const newPositions = [...positions];
      newPositions[i].assetName = v;
      newPositions[i].assetAddress = assets.find(
        (a) => a.tokenInfo.symbol === v
      )?.tokenInfo.address;
      setPositions(newPositions);
    },
    [positions, setPositions]
  );

  const selectAmountForPosition = useCallback(
    (i: number, v: number) => {
      const newPositions = [...positions];
      newPositions[i].balance = v;
      setPositions(newPositions);
    },
    [positions, setPositions]
  );

  const totalPayout = useMemo(
    () =>
      positions
        .reduce((acc, p) => acc.plus(p.balance), BigNumber(0))
        .decimalPlaces(2)
        .toNumber(),
    [positions]
  );

  return (
    <div className="w-full flex flex-col mt-4 items-center">
      {positions.map((position, i) => (
        <PaymentPosition
          key={i}
          assets={assets}
          availableAssets={availableAssets}
          position={position}
          positionIndex={i}
          selectAmountForPosition={selectAmountForPosition.bind(null, i)}
          selectAssetForPosition={selectAssetForPosition.bind(null, i)}
        />
      ))}
      {availableAssets.length > 0 && positions.length < assets.length && (
        <Button
          variant="ghost"
          className="text-center w-[200px] bg-gray-500 bg-opacity-30 rounded-2xl"
          onClick={addRow}
        >
          +
        </Button>
      )}

      <Label className="mt-5">
        {totalPayout}/{vault.debt.decimalPlaces(2).toNumber()}
      </Label>

      {
        <Button
          className="mt-4 bg-slate-400 hover:bg-slate-600 min-w-[150px] rounded"
          disabled={vault.debt.lte(0)}
          onClick={() =>
            pay(
              positions.map((p) => ({
                address: p.assetAddress!,
                amount: BigNumber(p.balance).multipliedBy(BigNumber(10).pow(6)),
              }))
            )
          }
        >
          Pay
        </Button>
      }
    </div>
  );
}
