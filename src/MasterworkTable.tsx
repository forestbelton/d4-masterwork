export type Boosts<A> = Record<number, A>;

export type MasterworkTableProps = {
  stat: number;
  level: number;
  isGA: boolean;
  boosts: Boosts<boolean>;
};

export const MASTERWORK_LEVELS: number[] = [];
for (let i = 0; i <= 12; i++) {
  MASTERWORK_LEVELS.push(i);
}

const RATE = 1.05;
const BOOST_RATE = 1.25;

const computeStatAtLevel = (
  boosts: Boosts<boolean>,
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
        (i + offset) % 4 === 0
          ? boosts[Math.floor((i + offset) / 4)]
            ? boostRate
            : 1
          : normalRate;
      stat = stat * rate;
    }
  }
  return stat + gaStat;
};

export const MasterworkTable = ({
  stat,
  level,
  isGA,
  boosts,
}: MasterworkTableProps) => (
  <table className="masterwork-table">
    <thead>
      <tr>
        <th />
        {MASTERWORK_LEVELS.map((i) => (
          <th key={i} className={i === level ? "selected" : ""}>
            {i}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td />
        {MASTERWORK_LEVELS.map((i) => (
          <td key={i}>
            {computeStatAtLevel(boosts, stat, isGA, level, i).toFixed(2)}
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);
