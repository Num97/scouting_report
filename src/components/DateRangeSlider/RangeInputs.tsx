// import { useState, useEffect } from "react";
// import styles from "./DateRangeSlider.module.css";

// type Props = {
//   min: number;
//   max: number;
//   startValue: number;
//   endValue: number;
//   onStartChange: (value: number) => void;
//   onEndChange: (value: number) => void;
// };

// export default function RangeInputs({
//   min,
//   max,
//   startValue,
//   endValue,
//   onStartChange,
//   onEndChange,
// }: Props) {
//   const [localStart, setLocalStart] = useState(startValue);
//   const [localEnd, setLocalEnd] = useState(endValue);

//   // Синхронизация с пропсами извне
//   useEffect(() => setLocalStart(startValue), [startValue]);
//   useEffect(() => setLocalEnd(endValue), [endValue]);

//   const handleStartChange = (value: number) => {
//     setLocalStart(value);
//     onStartChange(value); // обновляем родителя мгновенно
//   };

//   const handleEndChange = (value: number) => {
//     setLocalEnd(value);
//     onEndChange(value); // обновляем родителя мгновенно
//   };

//   return (
//     <>
//       <input
//         type="range"
//         min={min}
//         max={max}
//         step={1}
//         value={localStart}
//         onChange={(e) => handleStartChange(Number(e.target.value))}
//         className={styles.slider}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "12px",
//           zIndex: localStart > localEnd ? 5 : 4,
//         }}
//       />

//       <input
//         type="range"
//         min={min}
//         max={max}
//         step={1}
//         value={localEnd}
//         onChange={(e) => handleEndChange(Number(e.target.value))}
//         className={styles.slider}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "12px",
//           zIndex: localEnd < localStart ? 5 : 4,
//         }}
//       />
//     </>
//   );
// }
import styles from "./DateRangeSlider.module.css";

type Props = {
  min: number;
  max: number;
  startValue: number;
  endValue: number;
  onStartChange: (value: number) => void;
  onEndChange: (value: number) => void;
};

export default function RangeInputs({
  min,
  max,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
}: Props) {
  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={startValue}
        onChange={(e) => onStartChange(Number(e.target.value))}
        className={styles.slider}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "12px",
          zIndex: startValue > endValue ? 5 : 4,
        }}
      />

      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={endValue}
        onChange={(e) => onEndChange(Number(e.target.value))}
        className={styles.slider}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "12px",
          zIndex: endValue < startValue ? 5 : 4,
        }}
      />
    </>
  );
}