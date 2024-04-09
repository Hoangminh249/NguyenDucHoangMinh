const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Hàm getPriority được sử dụng để xác định ưu tiên của mỗi blockchain,
  // nhưng nó không được tối ưu hóa và được gọi mỗi khi một số dư được sắp xếp,
  // dẫn đến việc tính toán không cần thiết.
  const getPriority = useCallback((blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
      case "Neo":
        return 20;
      default:
        return -99;
    }
  }, []);

  // Tối ưu hóa hàm filter bằng cách loại bỏ các số dư không cần thiết một cách hiệu quả hơn, và chỉ tính toán lại khi danh sách số dư thay đổi.
  const filteredBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => balance.amount > 0);
  }, [balances]);

  const sortedBalances = useMemo(() => {
    return [...filteredBalances].sort(
      (lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      }
    );
  }, [filteredBalances, getPriority]);
  
  // Đưa hàm sắp xếp ra khỏi hàm useMemo và đặt nó ở ngoài để giảm bớt tính toán không cần thiết.
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(),
    }));
  }, [sortedBalances]);

  const rows = useMemo(() => {
    return formattedBalances.map(
      (balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      }
    );
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
