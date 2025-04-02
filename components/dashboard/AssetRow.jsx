import React from "react";

const AssetRow = ({
  asset,
  usdValue,
  type,
  supplied,
  borrowed,
  rewards,
  Logo,
  apr,
  onViewDetails,
}) => (
  <tr className="hover:bg-purple-50 transition-colors">
    <td className="p-3 border-b">
      <span className="flex items-center gap-2">
        {Logo && <Logo className="w-6 h-6" />}
        <div className="text-base">{asset}</div>
      </span>
    </td>

    <td className="p-3 border-b">
      <span className="inline-block text-xs py-1 px-2 rounded-md bg-green-200 text-green-900">
        {type}
      </span>
    </td>

    <td className="p-3 border-b">
      <div>
        <div className="text-gray-500 text-sm">
          {(Number(supplied) || 0).toFixed(5)} {asset}
        </div>
        <div>${(Number(usdValue) * Number(supplied) || 0).toFixed(3)}</div>
      </div>
    </td>

    <td className="p-3 border-b">
      <div>
        <div className="text-gray-500 text-sm">
          {(Number(borrowed) || 0).toFixed(5)} {asset}
        </div>
        <div>${(Number(usdValue) * Number(borrowed) || 0).toFixed(3)}</div>
      </div>
    </td>

    <td className="p-3 border-b">
      <div className="font-mono text-black">
        {(Number(apr) || 0).toFixed(2)}%
      </div>
    </td>

    <td className="p-3 border-b">
      <div className="font-mono text-black flex items-center">
        <span className="mr-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M9.00004 11.0339H8.33337V8.36719H7.66671M8.33337 5.70052H8.34004M14.3334 8.36719C14.3334 11.6809 11.6471 14.3672 8.33337 14.3672C5.01967 14.3672 2.33337 11.6809 2.33337 8.36719C2.33337 5.05348 5.01967 2.36719 8.33337 2.36719C11.6471 2.36719 14.3334 5.05348 14.3334 8.36719Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </span>
        ${rewards}
      </div>
    </td>

    <td className="p-3 border-b">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onViewDetails(asset, "supply")}
          className="px-3 py-1 text-sm font-semibold rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
        >
          Supply
        </button>
        <button
          onClick={() => onViewDetails(asset, "withdraw")}
          className="px-3 py-1 text-sm font-semibold rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
        >
          Withdraw
        </button>
        <button
          onClick={() => onViewDetails(asset, "repay")}
          className="px-3 py-1 text-sm font-semibold rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
        >
          Repay
        </button>
      </div>
    </td>
  </tr>
);

export default AssetRow;