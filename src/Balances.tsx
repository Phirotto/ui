import BigNumber from "bignumber.js";
import { Skeleton } from "./components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "./components/ui/table";
import { useBalances } from "./useBalances";

export function Balances() {
  const { isError, data } = useBalances();

  return (
    <>
      <h2 className="text-center">Your balance</h2>
      <Table className="text-center border-collapse border">
        <TableBody>
          {!data ? (
            <TableRow>
              <Skeleton className="w-full h-[20px]" active={!isError} />
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.tokenInfo.symbol}>
                <TableCell className="border">
                  {item.tokenInfo.symbol.toUpperCase()}
                </TableCell>
                <TableCell className="border">
                  {item.decimalBalance.decimalPlaces(2).toString()}$
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {data && (
          <TableFooter>
            <TableRow>
              <TableCell className="border">Total</TableCell>
              <TableCell className="border">
                {data
                  .reduce((acc, i) => acc.plus(i.decimalBalance), BigNumber(0))
                  .toString()}
                $
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
}
