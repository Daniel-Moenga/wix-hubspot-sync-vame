export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="max-w-xl text-center px-6 py-12">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Wix-HubSpot Integration
        </h1>
        <p className="text-gray-600 mb-6">
          Bi-directional contact sync between Wix and HubSpot CRM.
          This app is designed to be installed on a Wix site and managed through the Wix dashboard.
        </p>
        <div className="space-y-3 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Bi-directional contact sync</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Form submission capture with UTM tracking</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Configurable field mapping</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>OAuth 2.0 secure authentication</span>
          </div>
        </div>
      </main>
    </div>
  );
}
