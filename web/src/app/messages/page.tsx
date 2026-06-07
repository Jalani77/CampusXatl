import Nav from '@/components/Nav'
import ConversationList from '@/components/ConversationList'

export default function MessagesPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-5 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Messages</h1>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <ConversationList />
          </div>
        </div>
      </main>
    </>
  )
}
