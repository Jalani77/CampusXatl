import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Join CampusXATL</h1>
          <p className="text-gray-500 text-sm mt-1">Your campus marketplace for Atlanta students</p>
        </div>
        <SignUp appearance={{ variables: { colorPrimary: '#1A7A6E' } }} />
      </div>
    </div>
  )
}
