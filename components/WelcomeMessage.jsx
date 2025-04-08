/**
 * WelcomeMessage component displays a welcome screen with a customizable content name
 * and a prompt to connect wallet. Used as an initial state before wallet connection.
 *
 * @param {Object} props - Component props
 * @param {string} props.contentName - The name of the content/section to welcome to
 * @returns {JSX.Element} A welcome message component with responsive text sizing
 */
export default function WelcomeMessage({ contentName }) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] text-center max-w-2xl mx-auto space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold text-purple-800">
        Welcome to {contentName}
      </h1>
      <p className="text-xl md:text-2xl text-purple-600">
        Please connect your wallet to view your positions.
      </p>
    </div>
  );
}
