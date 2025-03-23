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
