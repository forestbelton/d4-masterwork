import { useCallback, useState } from "react";
import { Boosts, MasterworkTable } from "./MasterworkTable";

type MasterworkAffixProps = {
  index: number;
  level: number;
  boosts: Boosts<number>;
};

export const MasterworkAffix = ({
  index,
  level,
  boosts,
}: MasterworkAffixProps) => {
  const [isGA, setIsGA] = useState(false);
  const [stat, setStat] = useState("0");

  const onStatChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      ev.preventDefault();
      setStat(ev.target.value);
    },
    [setStat]
  );

  const onGaChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setIsGA(ev.target.checked);
    },
    [setIsGA]
  );

  const resolvedBoosts = Object.entries(boosts).reduce(
    (boosts, [critIndex, affixIndex]) => ({
      ...boosts,
      [critIndex]: index === affixIndex,
    }),
    {}
  );

  return (
    <div className="affix">
      <div>
        <div className="field">
          <label htmlFor="stat">Affix #{index}</label>
          <input name="stat" type="text" onChange={onStatChange} value={stat} />
        </div>
        <div className="field">
          <label htmlFor="isGA">GA?</label>
          <input type="checkbox" onChange={onGaChange} checked={isGA} />
        </div>
      </div>
      <MasterworkTable
        stat={parseFloat(stat)}
        level={level}
        isGA={isGA}
        boosts={resolvedBoosts}
      />
    </div>
  );
};
