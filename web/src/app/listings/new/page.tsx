import Nav from '@/components/Nav'
import ListingForm from '@/components/ListingForm'

export default function NewListingPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-5 py-10">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Post a listing</h1>
          <ListingForm mode="create" />
        </div>
      </main>
    </>
  )
}
