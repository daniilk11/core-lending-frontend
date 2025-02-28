export default function LoadingMessage({contentName}) {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] text-center">
            <h1 className="text-3xl font-bold text-purple-800 mb-4">Loading {contentName}</h1>
            <p className="text-xl text-purple-600">Please wait while we fetch your data...</p>
        </div>
    );
}
