import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  size: number;
  color: string;
};
export default function Medal({ size = 16, color }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.74963 5.69092C4.74963 3.89599 6.20471 2.44092 7.99963 2.44092C9.79456 2.44092 11.2496 3.89599 11.2496 5.69092C11.2496 6.24658 11.1102 6.76966 10.8644 7.2271C10.8207 7.28274 10.7854 7.34394 10.7591 7.4086C10.2925 8.15666 9.53018 8.70122 8.6357 8.8787C8.62424 8.88064 8.61283 8.88284 8.60149 8.8853C8.40645 8.92182 8.20527 8.94092 7.99963 8.94092C6.20471 8.94092 4.74963 7.48584 4.74963 5.69092ZM12.7496 5.69092C12.7496 6.40463 12.5922 7.08158 12.3102 7.68894L15.1558 12.8276L15.7723 13.9409H14.4996H11.916L10.6439 16.0749L9.90996 17.3061L9.31686 16.0013L7.99965 13.1034L6.6824 16.0013L6.14001 17.1945L5.38611 16.1223L3.95753 14.0905L1.45448 13.9396L0.265625 13.8678L0.844005 12.8267L3.69319 7.69787C3.40859 7.08821 3.24963 6.40813 3.24963 5.69092C3.24963 3.06757 5.37628 0.940918 7.99963 0.940918C10.623 0.940918 12.7496 3.06757 12.7496 5.69092ZM9.29062 10.2634C10.0806 10.0408 10.7871 9.61899 11.3524 9.05564L13.227 12.4409H11.4899H11.0639L10.8457 12.8069L10.0893 14.0758L8.82351 11.291L9.29062 10.2634ZM7.5709 10.4218L7.32115 10.9713L7.31293 10.9893L5.85926 14.1873L4.97679 12.9323L4.76901 12.6368L4.40843 12.615L2.73364 12.514L4.65199 9.06075C5.41567 9.81943 6.43579 10.3203 7.5709 10.4218ZM6.74963 5.69092C6.74963 5.00056 7.30928 4.44092 7.99963 4.44092C8.68999 4.44092 9.24963 5.00056 9.24963 5.69092C9.24963 6.38127 8.68999 6.94092 7.99963 6.94092C7.30928 6.94092 6.74963 6.38127 6.74963 5.69092ZM7.99963 2.94092C6.48085 2.94092 5.24963 4.17213 5.24963 5.69092C5.24963 7.2097 6.48085 8.44092 7.99963 8.44092C9.51842 8.44092 10.7496 7.2097 10.7496 5.69092C10.7496 4.17213 9.51842 2.94092 7.99963 2.94092Z"
        fill={color}
      />
    </Svg>
  );
}
