import React, { useCallback, useState } from "react";

type Boosts = Record<number, boolean>;

const RATE = 1.05;
const BOOST_RATE = 1.25;

const computeStatAtLevel = (
  boosts: Boosts,
  stat: number,
  isGA: boolean,
  level: number,
  desiredLevel: number
) => {
  let gaStat = 0;
  if (isGA) {
    gaStat = computeStatAtLevel(boosts, stat, false, level, 0) / 3;
    stat -= gaStat;
  }

  if (desiredLevel !== level) {
    const delta = desiredLevel < level ? -1 : 1;
    const offset = desiredLevel < level ? 0 : 1;
    const normalRate = desiredLevel < level ? 1 - (RATE - 1) : RATE;
    const boostRate = desiredLevel < level ? 1 - (BOOST_RATE - 1) : BOOST_RATE;

    for (let i = level; i !== desiredLevel; i += delta) {
      const rate =
        (i + offset) % 4 === 0 && boosts[Math.floor((i + offset) / 4)]
          ? boostRate
          : normalRate;
      stat = stat * rate;
    }
  }
  return stat + gaStat;
};

const App = () => {
  const [stat, setStat] = useState("0");
  const [level, setLevel] = useState(0);
  const [boosts, setBoosts] = useState<Boosts>({
    1: false,
    2: false,
    3: false,
  });
  const [isGA, setIsGA] = useState(false);

  const masterworkLevels = [];
  for (let i = 0; i <= 12; i++) {
    masterworkLevels.push(i);
  }

  const onStatChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      ev.preventDefault();
      setStat(ev.target.value);
    },
    [setStat]
  );

  const onLevelChange = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      ev.preventDefault();

      const newLevel = parseInt(ev.target.value, 10);
      setLevel(newLevel);
    },
    [setLevel]
  );

  const onGaChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setIsGA(ev.target.checked);
    },
    [setIsGA]
  );

  const onBoostChange = useCallback(
    (index: number) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      setBoosts({
        ...boosts,
        [index]: ev.target.checked,
      });
    },
    [boosts, setBoosts]
  );

  const statValue = parseFloat(stat);

  return (
    <>
      <h1>D4 Masterwork Calculator</h1>
      <div className="card">
        <div className="field">
          <label htmlFor="stat">Stat:</label>
          <input name="stat" type="text" onChange={onStatChange} value={stat} />
        </div>
        <div className="field">
          <label htmlFor="level">Masterwork:</label>
          <select onChange={onLevelChange} value={level}>
            {masterworkLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="isGA">GA?</label>
          <input type="checkbox" onChange={onGaChange} checked={isGA} />
        </div>
        <table className="masterwork-table">
          <thead>
            <tr>
              <th />
              {masterworkLevels.map((i) => (
                <th key={i} className={i === level ? "selected" : ""}>
                  {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td />
              {masterworkLevels.map((i) => (
                <td key={i}>
                  {computeStatAtLevel(
                    boosts,
                    statValue,
                    isGA,
                    level,
                    i
                  ).toFixed(2)}
                </td>
              ))}
            </tr>
            <tr>
              <td>
                <strong>25%</strong>
              </td>
              {masterworkLevels.map((i) => (
                <td key={i}>
                  {i % 4 === 0 && i !== 0 ? (
                    <input
                      type="checkbox"
                      onChange={onBoostChange(Math.floor(i / 4))}
                      checked={boosts[Math.floor(i / 4)]}
                    />
                  ) : null}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default App;
