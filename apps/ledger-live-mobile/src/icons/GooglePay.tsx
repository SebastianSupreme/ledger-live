import React, { memo } from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  height?: number;
  width?: number;
};

const GooglePay: React.FC<Props> = ({ height = 12, width = 32 }) => (
  <Svg viewBox="0 0 32 12" width={width} height={height}>
    <Path
      fill="#999999"
      d="M15.2414 5.86295V9.38045H14.1113V0.693594H17.1084C17.4661 0.686109 17.8217 0.748649 18.1548 0.877605C18.4879 1.00656 18.7918 1.19938 19.049 1.44494C19.3047 1.68005 19.5087 1.96465 19.6481 2.28101C19.7875 2.59737 19.8595 2.9387 19.8595 3.28373C19.8595 3.62876 19.7875 3.97009 19.6481 4.28645C19.5087 4.60281 19.3047 4.88741 19.049 5.12252C18.791 5.36616 18.4866 5.55695 18.1536 5.68387C17.8205 5.81079 17.4653 5.87134 17.1084 5.86204H15.2414V5.86295ZM15.2414 1.7624V4.79506H17.136C17.4366 4.80066 17.7322 4.71871 17.986 4.55945C18.2397 4.40019 18.4403 4.17066 18.5628 3.89951C18.6853 3.62836 18.7243 3.32758 18.6748 3.03472C18.6253 2.74185 18.4896 2.46986 18.2846 2.25268L18.2542 2.22266C18.1115 2.07207 17.938 1.95316 17.7452 1.87381C17.5524 1.79446 17.3448 1.75649 17.136 1.7624H15.2414Z"
    />
    <Path
      fill="#999999"
      d="M22.4637 3.24219C23.2988 3.24219 23.9579 3.46262 24.4412 3.90348C24.9244 4.34434 25.166 4.94893 25.166 5.71726V9.38029H24.0847V8.55526H24.0359C23.568 9.23444 22.9457 9.57404 22.169 9.57404C21.5058 9.57404 20.951 9.37999 20.5046 8.99188C20.2905 8.81374 20.1192 8.59065 20.0034 8.33888C19.8875 8.08711 19.83 7.81299 19.835 7.53649C19.8252 7.25394 19.8843 6.97319 20.0072 6.71787C20.1302 6.46255 20.3134 6.24011 20.5415 6.06928C21.0124 5.70543 21.6409 5.52351 22.4269 5.52351C23.0974 5.52351 23.65 5.64479 24.0847 5.88735V5.63267C24.0859 5.44421 24.0447 5.25785 23.9641 5.08702C23.8835 4.91619 23.7655 4.76515 23.6187 4.64481C23.3195 4.37861 22.9299 4.23344 22.5272 4.23822C22.23 4.2314 21.936 4.3004 21.6737 4.43855C21.4114 4.5767 21.1895 4.77932 21.0296 5.02686L20.034 4.4074C20.5805 3.6312 21.3904 3.24279 22.4637 3.24219ZM21.002 7.56105C21.0013 7.70306 21.035 7.84316 21.1002 7.96973C21.1654 8.09629 21.2603 8.20566 21.3769 8.28875C21.6268 8.4826 21.9368 8.58539 22.2546 8.57982C22.7314 8.57905 23.1885 8.39162 23.5257 8.05861C23.7016 7.90523 23.8426 7.7167 23.9393 7.50548C24.036 7.29426 24.0862 7.06517 24.0866 6.83336C23.7347 6.55562 23.2435 6.41705 22.6129 6.41766C22.2047 6.40278 21.8025 6.51756 21.4653 6.74513C21.1558 6.96708 21.0048 7.23723 21.0048 7.56379L21.002 7.56105Z"
    />
    <Path
      fill="#999999"
      d="M31.3698 3.43689L27.5935 12H26.4275L27.8275 9.00375L25.3462 3.43689H26.5749L28.3681 7.70663H28.3921L30.1365 3.43689H31.3698Z"
    />
    <Path
      fill="#4285F4"
      d="M10.6753 5.10425C10.6759 4.76405 10.647 4.42441 10.5887 4.08911H5.82324V6.01114H8.55229C8.49605 6.31854 8.37726 6.61149 8.20312 6.87227C8.02898 7.13306 7.80311 7.35626 7.53914 7.52838V8.77547H9.16754C10.1263 7.90769 10.6753 6.62786 10.6753 5.10425Z"
    />
    <Path
      fill="#34A853"
      d="M5.82306 9.98063C7.18712 9.98063 8.33474 9.53855 9.17196 8.77629L7.54356 7.5283C7.08948 7.83211 6.50555 8.00585 5.82306 8.00585C4.50504 8.00585 3.38597 7.12806 2.98624 5.94556H1.30811V7.23176C1.72869 8.05826 2.37364 8.75301 3.17092 9.23843C3.96821 9.72385 4.88644 9.98081 5.82306 9.98063Z"
    />
    <Path
      fill="#FBBC04"
      d="M2.98625 5.94561C2.77442 5.32606 2.77442 4.65496 2.98625 4.03541V2.75012H1.30812C0.954293 3.44542 0.77002 4.2128 0.77002 4.99097C0.77002 5.76913 0.954293 6.53652 1.30812 7.23181L2.98625 5.94561Z"
    />
    <Path
      fill="#EA4335"
      d="M5.82289 1.9751C6.54194 1.96522 7.23629 2.23396 7.75708 2.72372L9.19942 1.29926C8.28448 0.451361 7.07288 -0.0141053 5.81828 0.000325801C4.88188 0.000562875 3.96397 0.257823 3.16704 0.743388C2.3701 1.22895 1.72549 1.92371 1.30518 2.7501L2.98331 4.03539C3.38581 2.85289 4.50488 1.9751 5.82289 1.9751Z"
    />
  </Svg>
);

export default memo(GooglePay);
