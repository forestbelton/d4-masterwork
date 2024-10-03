import React, { useCallback, useState } from "react";
import { Boosts, MASTERWORK_LEVELS } from "./MasterworkTable";
import { MasterworkAffix } from "./MasterworkAffix";

const CRIT_LEVELS = [1, 2, 3];

const NUM_AFFIXES = 5;

const AFFIXES: number[] = [];
for (let i = 1; i <= NUM_AFFIXES; ++i) {
  AFFIXES.push(i);
}

const App = () => {
  const [level, setLevel] = useState(0);
  const [boosts, setBoosts] = useState<Boosts<number>>({
    1: -1,
    2: -1,
    3: -1,
  });

  const onLevelChange = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      ev.preventDefault();

      const newLevel = parseInt(ev.target.value, 10);
      setLevel(newLevel);
    },
    [setLevel]
  );

  const onBoostChange = useCallback(
    (index: number) => (ev: React.ChangeEvent<HTMLSelectElement>) => {
      setBoosts({
        ...boosts,
        [index]:
          ev.target.value !== "none" ? parseInt(ev.target.value, 10) : -1,
      });
    },
    [boosts, setBoosts]
  );

  return (
    <>
      <h1>D4 Masterwork Calculator</h1>
      <div className="global-stats">
        <div className="field">
          <label htmlFor="level">Masterwork</label>
          <select onChange={onLevelChange} value={level}>
            {MASTERWORK_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        {CRIT_LEVELS.map((critLevel) => (
          <div className="field">
            <label htmlFor={`crit-${critLevel}`}>Crit {critLevel}</label>
            <select onChange={onBoostChange(critLevel)}>
              <option value="none">-</option>
              {AFFIXES.map((affix) => (
                <option key={affix} value={affix}>
                  Affix {affix}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      {AFFIXES.map((index) => (
        <MasterworkAffix
          key={index}
          index={index}
          level={level}
          boosts={boosts}
        />
      ))}
    </>
  );
};

export default App;
