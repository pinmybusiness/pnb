import { Providers } from '@/app/providers';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

export default function CandidateRegister() {
  return (
    <Providers>
    <div className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Title and Description */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Candidate Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up with your Google account to explore job opportunities. Registration is completely free.
          </p>
        </div>

        {/* Google Sign-In Button */}
        <div>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
    </Providers>
  );
}